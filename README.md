## Honk all together with 🪿 HONC

This is a project created with the `create-honc-app` template for the [World Wild Web Hack Night](https://github.com/Nlea/World-Wild-Web-Hack-Night) in Paris 🥖

When clicking on the Honk button, your device will honk… as well as all devices currently connected to this page!

Honks are sent through a WebSocket hosted by [Cloudflare Workers](https://hono.dev/docs/getting-started/cloudflare-workers) and [Durable Objects](https://hono.dev/examples/cloudflare-durable-objects).
The frontend and Honk noise use the [Static Assets](https://hono.dev/docs/getting-started/cloudflare-workers#serve-static-files) binding.

### Live demo

➡️ https://duck.raspy-butterfly-46a8.workers.dev ⬅️

### Running locally

```sh
pnpm run dev
```

### Deploying to Cloudflare

```sh
pnpm run deploy
```

### Resources

- https://github.com/cloudflare/websocket-template
- https://github.com/honojs/examples/tree/main/durable-objects
- https://developers.cloudflare.com/durable-objects/examples/websocket-hibernation-server/
