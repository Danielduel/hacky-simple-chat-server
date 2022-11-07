import { some } from "fp-ts/lib/Option";
import { match, P } from "ts-pattern";

import Client from "./Client";
import { ClientEventKind, ClientSide } from "./ClientEvent";
import type ClientManager from "./ClientManager";

type Handler<T> = (a: [T, Client]) => void;
export default class ClientEventHandler {
  manager: ClientManager;

  constructor (manager: ClientManager) {
    this.manager = manager;
  }
  
  handle (client: Client, clientEvent: ClientSide.Union) {
    match([clientEvent, client])
      .with([{ kind: ClientEventKind.hello }, P._], this.onMessageHello)
      .with([{ kind: ClientEventKind.newMessage }, P._], this.onMessageNewMessage)
      .with([{ kind: ClientEventKind.getMessages }, P._], this.onMessageGetMessages)
      .with(P._, () => void 0)
      .exhaustive()
  }

  private onMessageHello: Handler<ClientSide.Hello> = ([event, client]) => {
    client.name = some(event.data.name);
    client.send(event);
  };

  private onMessageNewMessage: Handler<ClientSide.NewMessage> = ([event]) => {
    const serverSideNewMessage = this.manager.messageManager.newMessage(event);
    this.manager.broadcast(serverSideNewMessage);
  };

  private onMessageGetMessages: Handler<ClientSide.GetMessages> = ([, client]) => {
    client.send(this.manager.messageManager.toServerSideGetMessages());
  };
}
