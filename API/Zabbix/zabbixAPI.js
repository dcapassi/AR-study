import axios from "axios";

export default function createZabbixAPI(ip, port) {
  const apiURL = `http://${ip}:${port}/zabbix/api_jsonrpc.php`;
  const api = axios.create({ baseURL: apiURL });
  return api;
}
