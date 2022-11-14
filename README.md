Dependencies:
  * node 16
  * yarn

It installs own version of TypeScript

Install using `yarn`, then run `yarn start` to start.

There is a hacky client in `testclient`, just open `client.html` in browser (after `yarn start`).

## Brief summary of happy path

### Connecting with WebSocket

Default listening port is 25123, you can use

```typescript
  const ws = new WebSocket("ws://localhost:25123");
```

to attempt connection on localhost.
Keep in mind that the server doesn't support secure websockets (`wss`) protocol
(you can wrap it with nginx upgrade passthrough, but it exceeds scope of this repo).

Next step is to wait for "open" on connection
(it is a good idea to bind "close" and "error" events to a function that will attempt reconnection)

```typescript
  ws.addEventListener("open", () => {
    // you can continue your logic here
  }, { once: true })
```

Yay, you are set now.

### WebSocket communication

Server reacts only to stringified messages (`JSON.stringify(eventData)`)

`Hello` event
* Kind `hello`
* Data
  * name
    * type: string
    * description: The name that user will be introduced to the server (sets name serverside)
* Example
```json6
{
  kind: "hello",
  data: {
    name: "test user"
  }
}
```
* Effects
  * Server will echo
  * Example
```json6
{
  kind: "hello",
  data: {
    name: "test user"
  }
}
```

`RawMessage` type
* Note: Nothing is validated, author and text are never checked if they are actual authors
* Fields
  * author
    * type: string
    * description: name of user who sent the message
  * text
    * type: string
    * description: body of the message

`GetMessages` event
* Kind `getMessages`
* Data
Data is null for this event, server will ignore data if sent
* Example
```json6
{
  kind: "getMessages",
  data: null
}
```
* Effects
  * Server will reply with event
    * Kind `getMessages`
    * Data
      * messages
        * type: array of `RawMessage`
        * description: all messages that are stored serverside
    * Example
```json6
{
  kind: "getMessages",
  data: {
    messages: [
      {
        author: "Daniel",
        text: "Hi, how is the course going?"
      },
      {
        author: "Maciej",
        text: "Great!"
      }
    ]
  }
}
```

`NewMessage` event
* Kind `newMessage`
* Data
  * type: `RawMessage`
* Example
```json6
{
  kind: "newMessage",
  data: {
    author: "Daniel",
    text: "I'm happy to hear that"
  }
}
```
* Effects
  * Server will broadcast echo of this event (including the sender)
  * Example
```json6
{
  kind: "newMessage",
  data: {
    author: "Daniel",
    text: "I'm happy to hear that"
  }
}
```

You can check `/src/Client/ClientEvent.ts` in order to see available events.
You can copy-paste this file to your project if you want to get headstart with typings.
If you will want that - `ClientSide` are events that you will send, `ServerSide` are events that you will receive.
