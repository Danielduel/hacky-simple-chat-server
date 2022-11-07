import { ClientEventKind, ClientSide, ServerSide } from "../Client/ClientEvent";
import Message from "./Message";

export default class MessageManager {
  private messages: Message[] = [];

  newMessage (newMessageEvent: ClientSide.NewMessage): ServerSide.NewMessage {
    const message = new Message(newMessageEvent)
    this.messages.push(message);
    return message.toServerSideNewMessage();
  }

  toServerSideGetMessages (): ServerSide.GetMessages {
    return {
      kind: ClientEventKind.getMessages,
      data: {
        messages: this.messages.map(msg => msg.toRawMessage())
      }
    };
  }
}
