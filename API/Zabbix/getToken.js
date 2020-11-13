async function getToken(username, password, zabbixAPI) {
  const obj = {
    jsonrpc: "2.0",
    method: "user.login",
    params: {
      user: username,
      password: password,
    },
    id: 1,
    auth: null,
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

export default getToken;
