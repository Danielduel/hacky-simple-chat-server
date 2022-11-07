import chalk from "chalk";
import WebSocket from "ws";
import ClientManager from "./Client/ClientManager";
import { nbsp } from "./utils";

const clientManager = new ClientManager();

const opts: WebSocket.ServerOptions = {
  port: 25123
};
const WSServer = new WebSocket.Server(opts, () => {
  console.log(chalk.bgGray.blue`${nbsp}Listening on port ${opts.port}${nbsp}`);
});

WSServer.on("connection", (socket) => {
  console.log(chalk.bgGray.blue`${nbsp}New connection${nbsp}`);
  const client = clientManager
    .registerClient(socket)
    .registerEvents();
});
