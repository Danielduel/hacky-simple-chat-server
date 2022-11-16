import chalk from "chalk";
import type { WebSocket } from "ws";
import { pipe } from "fp-ts/function";
import { none, Option, match as matchO } from "fp-ts/Option";

import { nbsp, parseJSON } from "../utils";
import ClientManager from "./ClientManager";
import { ClientSide, ServerSide } from "./ClientEvent";

export default class Client {
  manager: ClientManager;
  index: number;
  socket: WebSocket;
  name: Option<string> = none;

  constructor (socket: WebSocket, manager: ClientManager, index: number) {
    this.socket = socket;
    this.manager = manager;
    this.index = index;
    this.log("New client");
  }

  registerEvents () {
    this.socket.on("message", this.onMessage);
    this.socket.on("close", this.onClose);
    this.socket.on("error", this.onError);
    this.log("Events attached");
    return this;
  }

  unregisterEvents () {
    this.socket.removeAllListeners();
    this.log("Events detached");
    return this;
  }

  send (event: ServerSide.Union) {
    this.socket.send(JSON.stringify(event));
    this.log(`<= ${event.kind}`);
  }

  private onMessage: NonNullable<WebSocket["onmessage"]> = (event) => {
    // Not sure if this "toString" will work as intended in case of Buffers
    pipe(
      `${event}`, // I prefer creating a string instead of checking if data exists
      parseJSON<ClientSide.Union>,
      matchO(
        () => {
          this.log(`=> Can't match event ${event.data}`)
        },
        clientEvent => {
          this.log(`=> Event is ${clientEvent.kind}`)
          this.manager.handleClientEvent(this, clientEvent)
        }
      )
    )
  }

  private onClose: NonNullable<WebSocket["onclose"]> = (event) => {
    this.log("Closing")
    event.reason;
  }

  private onError: NonNullable<WebSocket["onerror"]> = (event) => {
    this.log("Error")
    event.error;
  }

  private log (message: string) {
    console.log(
      chalk.bgBlack.cyan`${nbsp}${this.index}${
        matchO(
          () => "",
          (name) => `(${name})`
        )(this.name)
      }${nbsp}` + chalk.bgBlack.white`${nbsp}${message}${nbsp}`
    );
  }
}

