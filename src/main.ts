import chalk from "chalk";
import WebSocket from "ws";
import cors from "cors";
import express, { NextFunction, Request, Response } from "express";

import ClientManager from "./Client/ClientManager";
import { nbsp } from "./utils";

const HOST = process.env.HOST || "localhost";
const PORT = process.env.PORT || "25123";

console.log("HOST: ", HOST);
console.log("PORT: ", PORT);

let clientManager = new ClientManager();

const app = express();
app.use(cors());
const server = app.listen(+PORT, HOST, () => console.log(chalk.bgBlack.cyan`${nbsp}(Express) Listening on port ${PORT}${nbsp}`));

const restrict = (req: Request, res: Response, next: NextFunction): void => {
  if (!process.env.ADMIN_PANEL_PASS) {
    res.sendStatus(403);
    return;
  }
  if (req.headers["admin-panel-pass"] === process.env.ADMIN_PANEL_PASS) {
    next();
    return;
  }
  res.sendStatus(403);
}

app.get("/getMessages", (_, res) => res.send(clientManager.messageManager.getMessages()));
app.get("/getUsers", (_, res) => res.send(clientManager.getUsers()));

app.get("/adminFakeMessages", restrict, (req, res) => {
  clientManager.messageManager.pushMessage("Croatian user", "Zdravo!");
  clientManager.messageManager.pushMessage("Czech user", "Čau!");
  clientManager.messageManager.pushMessage("Slovak user", "Ahoj!");
  clientManager.messageManager.pushMessage("Polish user", "Cześć!");
  res.sendStatus(200);
})
app.get("/adminClearMessages", restrict, (req, res) => {
  clientManager.messageManager.clear();
  res.sendStatus(200);
})
app.get("/adminRestart", restrict, (req, res) => {
  clientManager.messageManager.clear();
  clientManager.clients.forEach(client => client.socket.close());
  clientManager = new ClientManager();
  res.sendStatus(200);
})

app.use(express.static('admin-panel/dist'));

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
