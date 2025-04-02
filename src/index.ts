import { DurableObject } from "cloudflare:workers";

import { template } from "./template";

// Worker
export default {
  async fetch(request, env, ctx) {
    if (request.url.endsWith("/ws")) {
      // Expect to receive a WebSocket Upgrade request.
      // If there is one, accept the request and return a WebSocket Response.
      const upgradeHeader = request.headers.get("Upgrade");
      if (!upgradeHeader || upgradeHeader !== "websocket") {
        return new Response("Durable Object expected Upgrade: websocket", {
          status: 426,
        });
      }

      // This example will refer to the same Durable Object,
      // since the name "foo" is hardcoded.
      let id = env.WEBSOCKET_HIBERNATION_SERVER.idFromName("foo");
      let stub = env.WEBSOCKET_HIBERNATION_SERVER.get(id);

      return stub.fetch(request);
    }

    if (request.url.startsWith("/honk.mp3")) {
      return env.ASSETS.fetch(request);
    }

    return new Response(template, {
      headers: {
        "Content-type": "text/html; charset=utf-8",
      },
    });
  },
};

// Durable Object
export class WebSocketHibernationServer extends DurableObject {
  async fetch(request) {
    // Creates two ends of a WebSocket connection.
    const webSocketPair = new WebSocketPair();
    const [client, server] = Object.values(webSocketPair);

    // Calling `acceptWebSocket()` informs the runtime that this WebSocket is to begin terminating
    // request within the Durable Object. It has the effect of "accepting" the connection,
    // and allowing the WebSocket to send and receive messages.
    // Unlike `ws.accept()`, `state.acceptWebSocket(ws)` informs the Workers Runtime that the WebSocket
    // is "hibernatable", so the runtime does not need to pin this Durable Object to memory while
    // the connection is open. During periods of inactivity, the Durable Object can be evicted
    // from memory, but the WebSocket connection will remain open. If at some later point the
    // WebSocket receives a message, the runtime will recreate the Durable Object
    // (run the `constructor`) and deliver the message to the appropriate handler.
    this.ctx.acceptWebSocket(server);

    return new Response(null, {
      status: 101,
      webSocket: client,
    });
  }

  async webSocketMessage(ws, message) {
    // Upon receiving a message from the client, reply with the same message,
    // but will prefix the message with "[Durable Object]: " and return the
    // total number of connections.

    if (message === "play") {
      this.ctx.getWebSockets().forEach((client) => {
        client.send(`play`);
      });
    }
  }

  async webSocketClose(ws, code, reason, wasClean) {
    // If the client closes the connection, the runtime will invoke the webSocketClose() handler.
    ws.close(code, "Durable Object is closing WebSocket");
  }
}
