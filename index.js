import * as THREE from "./three.js";
import { StereoEffect } from "./stereo.js";
import { fontJSON } from "./font.js";
import jsQR from "jsqr";
import Stats from "stats.js"

var video = document.createElement("video");
var canvasElement = document.getElementById("canvas");
var canvas = canvasElement.getContext("2d");

var stats;
var output = false;
var showing = ""

var meshTextOutput;

var planeOutput;


// Use facingMode: environment to attemt to get the front camera on phones
if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
  var constraints = {
    video: { width: 1280, height: 720, facingMode: "environment" },
  };

  navigator.mediaDevices
    .getUserMedia(constraints)
    .then(function (stream) {
      // apply the stream to the video element used in the texture

      video.srcObject = stream;
      video.play();
    })
    .catch(function (error) {
      console.error("Unable to access the camera/webcam.", error);
    });
} else {
  console.error("MediaDevices interface not available.");
}

function tick() {
  
  if (video.readyState === video.HAVE_ENOUGH_DATA) {

    canvasElement.height = video.videoHeight;
    canvasElement.width = video.videoWidth;
    canvas.drawImage(video, 0, 0, canvasElement.width, canvasElement.height);
    var imageData = canvas.getImageData(
      0,
      0,
      canvasElement.width,
      canvasElement.height
    );
   
    var code = jsQR(imageData.data, imageData.width, imageData.height, {
      inversionAttempts: "dontInvert"
    });
    if (code) {

      console.log(code.data);

      if (code.data === "ap001")
      {
      createOutput(code.data)
      }
      if (code.data === "ap002"){
      createOutput(code.data)
      }

    } else {
    }
  }
}


var rtTexture, imageData, texture, camera, scene, sceneScreen, renderer;


init();

animate();
//tick()

window.setInterval(function(){
  tick();
}, 500);

function init() {

  stats = createStats();
  //document.body.appendChild( stats.domElement );


  rtTexture = new THREE.WebGLRenderTarget(
    window.innerWidth,
    window.innerHeight,
    {
      minFilter: THREE.LinearFilter,
      magFilter: THREE.NearestFilter,
      format: THREE.RGBFormat
    }
  );

  camera = new THREE.PerspectiveCamera(
    100,
    window.innerWidth / window.innerHeight,
    0.1,
    500
  );
  camera.position.z = 500;

  scene = new THREE.Scene();

    sceneScreen = new THREE.Scene();
  texture = new THREE.VideoTexture(video);

 

  var material = new THREE.MeshBasicMaterial({ color: 0xffffff });
  var geometry = new THREE.PlaneBufferGeometry(
    1200,
    1100
  );
  var material = new THREE.MeshBasicMaterial({ map: texture });

  var mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  window.addEventListener("resize", onWindowResize, false);

  

       
        
}

function createStats() {
  var stats = new Stats();
  stats.setMode(0);

  stats.domElement.style.position = 'absolute';
  stats.domElement.style.left = '0';
  stats.domElement.style.top = '0';

  return stats;
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}

function createOutput(currentlyReading){

  if ( output === true && currentlyReading !== showing){
    scene.remove(meshTextOutput);
    scene.remove(planeOutput)

    output = false;
  }

  if (output === false){

    var geometry = new THREE.PlaneBufferGeometry(300, 180);
  

    var material = new THREE.MeshBasicMaterial({
      color: 0x000000,
      opacity: 0.5,
      transparent: true
    });
    

    planeOutput = new THREE.Mesh(geometry, material);
    console.log(window.innerWidth/2)
    planeOutput.position.x = -300;
    planeOutput.position.y =  230;
  


  var loader = new THREE.FontLoader();
  let font = loader.parse(fontJSON);
  var material = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent:true,opacity:0.5});

  let disponibilidadeRandom = getRandomInt(90,100);
  let latenciaRandom = getRandomInt(1,30);

  var geometry = new THREE.TextGeometry(`     ${currentlyReading}\n-----------------\nOperacional: Sim\nDisponibilidade: ${disponibilidadeRandom}%\nLatencia: ${latenciaRandom}ms`, {
    font: font,
    size: 15,
    height: 1,
    material: 0,
    bevelThickness: 1,
    extrudeMaterial: 1
  });
  meshTextOutput = new THREE.Mesh(geometry, material);
    meshTextOutput.position.x = -390;
    meshTextOutput.position.y = 280;





  
  scene.add(meshTextOutput);
  scene.add(planeOutput);

  output = true;
  showing = currentlyReading;

  setTimeout(function(){ output = false; scene.remove(planeOutput),scene.remove(meshTextOutput);  }, 4000);

  }

}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
  requestAnimationFrame(animate);
  
  renderer.setRenderTarget(null);
  renderer.clear();
  var effect = new StereoEffect(renderer);
  effect.render(scene,camera)
  //renderer.render(scene, camera);
  stats.update();


}
