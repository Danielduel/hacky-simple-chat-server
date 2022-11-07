import type { WebSocket } from "ws";

import Client from "./Client";
import { ClientSide, ServerSide } from "./ClientEvent";
import ClientEventHandler from "./ClientEventHandler";
import MessageManager from "../Message/MessageManager";

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
}
