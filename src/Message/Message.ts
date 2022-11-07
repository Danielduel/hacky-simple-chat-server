import { ClientEventKind, ClientSide, ServerSide } from "../Client/ClientEvent";
import RawMessage from "./RawMessage";

export default class Message implements RawMessage {
  author: string;
  text: string;

  constructor (newMessageEvent: ClientSide.NewMessage) {
    this.author = newMessageEvent.data.author;
    this.text = newMessageEvent.data.text;
  }

  toServerSideNewMessage (): ServerSide.NewMessage {
    return {
      kind: ClientEventKind.newMessage,
      data: {
        author: this.author,
        text: this.text
      }
    }
  }

  toRawMessage (): RawMessage {
    return {
      author: this.author,
      text: this.text
    };
  }
}
