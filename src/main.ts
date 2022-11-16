import chalk from "chalk";
import WebSocket from "ws";
import express from "express";

import ClientManager from "./Client/ClientManager";
import { nbsp } from "./utils";

const HOST = process.env.HOST || "localhost";
const PORT = process.env.PORT || "25123";
const clientManager = new ClientManager();

const server = express()
  .use((req, res) => res.sendFile("testclient/client.html", { root: __dirname }))
  .listen(+PORT, HOST, () => console.log(chalk.bgBlack.cyan`${nbsp}(Express) Listening on port ${PORT}${nbsp}`));

const opts: WebSocket.ServerOptions = { server };

const WSServer = new WebSocket.Server(opts, () => {
  console.log(chalk.bgBlack.cyan`${nbsp}(WS) Listening on port ${PORT}${nbsp}`);
});

WSServer.on("connection", (socket) => {
  console.log(chalk.bgBlack.cyan`${nbsp}New connection${nbsp}`);
  const client = clientManager
    .registerClient(socket)
    .registerEvents();
});
