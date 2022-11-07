import RawMessage from "../Message/RawMessage";

export enum ClientEventKind {
  "hello" = "hello",
  "newMessage" = "newMessage",
  "getMessages" = "getMessages",
}

export type ClientEvent = {
  kind: ClientEventKind;
}

export namespace ClientSide {
  export type Union = Hello | NewMessage | GetMessages;

  export type Hello = ClientEvent & {
    kind: ClientEventKind.hello;
    data: {
      name: string;
    }
  };

  export type NewMessage = ClientEvent & {
    kind: ClientEventKind.newMessage;
    data: {
      author: string;
      text: string;
    }
  }

  export type GetMessages = ClientEvent & {
    kind: ClientEventKind.getMessages;
    data: null;
  }
};

export namespace ServerSide {
  export type Union = Hello | NewMessage | GetMessages;

  export type Hello = ClientSide.Hello; // echo

  export type NewMessage = ClientSide.NewMessage; // broadcasted echo

  export type GetMessages = ClientEvent & {
    kind: ClientEventKind.getMessages;
    data: {
      messages: RawMessage[];
    };
  }
};
