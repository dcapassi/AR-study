import createZabbixApi from "./zabbixAPI";

async function getHost(token, zabbixAPI, hostName) {
  const obj = {
    jsonrpc: "2.0",
    method: "host.get",
    params: {
      filter: {
        host: [hostName],
      },
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

export default getHost;
