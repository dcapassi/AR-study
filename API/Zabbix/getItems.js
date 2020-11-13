import createZabbixApi from "./zabbixAPI";

async function getItems(token, zabbixAPI, hostId) {
  const obj = {
    jsonrpc: "2.0",
    method: "item.get",
    params: {
      output: "extend",
      hostids: hostId,
      sortfield: "name",
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

export default getItems;
