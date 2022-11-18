import type { WebSocket } from "ws";
import { match as matchO } from "fp-ts/lib/Option";
import { pipe } from "fp-ts/lib/function";

import Client from "./Client";
import { ClientEventKind, ClientSide, ServerSide } from "./ClientEvent";
import ClientEventHandler from "./ClientEventHandler";
import MessageManager from "../Message/MessageManager";
import { User } from "./User";

export default class ClientManager {
  private connectionIndex: number = 0;
  clients: Client[] = [];
  clientEventHandler: ClientEventHandler = new ClientEventHandler(this);
  messageManager: MessageManager = new MessageManager();

  registerClient (socket: WebSocket) {
    this.connectionIndex++;
    const client = new Client(socket, this, this.connectionIndex);
    this.clients.push(client);
    return client;
  }

  broadcast (message: ServerSide.Union) {
    this.clients.forEach(client => client.send(message));
  }

  handleClientEvent = (client: Client, clientEvent: ClientSide.Union) =>
    this.clientEventHandler.handle(client, clientEvent);

  toServerSideGetUsers = (): ServerSide.GetUsers => {
    return {
      kind: ClientEventKind.getUsers,
      data: {
        users: this.clients.flatMap((client) => {
          return {
            name: pipe(client.name, matchO(() => "", name => name))
          }
        })
      }
    };
  }

  getUsers = (): User[] => {
    return this.clients.flatMap((client) => {
      return {
        name: pipe(client.name, matchO(() => "", name => name))
      }
    })
  }
}
