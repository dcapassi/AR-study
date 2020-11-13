import createZabbixApi from "./zabbixAPI";

async function createHost(
  token,
  zabbixAPI,
  templateList,
  hostGroup,
  hostName,
  ipAddress
) {
  let templateListArray = [];
  templateList.map((entry) => {
    templateListArray.push({ templateid: entry });
  });

  console.log(templateListArray);
  const obj = {
    jsonrpc: "2.0",
    method: "host.create",
    params: {
      host: hostName,
      templates: templateListArray,
      interfaces: [
        {
          type: 1,
          main: 1,
          useip: 1,
          ip: ipAddress,
          dns: "",
          port: "10050",
        },
      ],
      groups: [
        {
          groupid: hostGroup,
        },
      ],
      inventory_mode: 0,
      inventory: {},
    },
    auth: token,
    id: 1,
  };

  const response = await zabbixAPI
    .post("", obj, {
      headers: {
        "Content-Type": "application/json",
      },
    })
    .catch((err) => {
      console.log(err);
    });
  return response;
}

export default createHost;
