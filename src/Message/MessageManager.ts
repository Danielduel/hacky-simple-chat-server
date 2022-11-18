import { ClientEventKind, ClientSide, ServerSide } from "../Client/ClientEvent";
import Message from "./Message";
import RawMessage from "./RawMessage";

export default class MessageManager {
  private messages: Message[] = [];

  newMessage(newMessageEvent: ClientSide.NewMessage): ServerSide.NewMessage {
    const message = new Message(newMessageEvent);
    this.messages.push(message);
    return message.toServerSideNewMessage();
  }

  pushMessage = (author: string, text: string) => {
    this.newMessage({
      kind: ClientEventKind.newMessage,
      data: {
        author,
        text,
      },
    });
  };

  toServerSideGetMessages(): ServerSide.GetMessages {
    return {
      kind: ClientEventKind.getMessages,
      data: {
        messages: this.messages.map((msg) => msg.toRawMessage()),
      },
    };
  }

  getMessages = (): RawMessage[] => {
    return this.messages.map((msg) => msg.toRawMessage());
  };

  clear = () => {
    this.messages = [];
  }
}
