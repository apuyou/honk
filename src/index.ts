import { Hono } from "hono";

import { WebSocketHibernationServer } from "./durable";

type Env = {
  Bindings: {
    WEBSOCKET_HIBERNATION_SERVER: DurableObjectNamespace<WebSocketHibernationServer>;
  };
};

const app = new Hono<Env>();

app.mount("/ws", (request, env, ctx) => {
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
});

export default app;

export { WebSocketHibernationServer };
