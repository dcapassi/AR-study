import createZabbixApi from "./zabbixAPI";

async function getTemplates(token,zabbixAPI) {

  const obj = {
    jsonrpc: "2.0",
    method: "template.get",
    params: {
      output: "extend",
      filter: {
        host: [],
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

export default getTemplates;
