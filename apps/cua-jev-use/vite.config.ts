import react from "@vitejs/plugin-react";
import type { IncomingMessage, ServerResponse } from "node:http";
import { defineConfig, type Plugin } from "vite";

function readBody(req: IncomingMessage): Promise<string> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    req.on("data", (chunk) => chunks.push(Buffer.from(chunk)));
    req.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
    req.on("error", reject);
  });
}

function typesafeProxyPlugin(): Plugin {
  return {
    name: "typesafe-proxy",
    configureServer(server) {
      server.middlewares.use("/api/mode", (_req, res) => {
        res.setHeader("Content-Type", "application/json");
        res.end(
          JSON.stringify({
            mode: process.env.TYPESAFE_API_KEY ? "live" : "mock",
          }),
        );
      });

      server.middlewares.use(
        "/api/systemone",
        async (req: IncomingMessage, res: ServerResponse) => {
          if (req.method !== "POST") {
            res.statusCode = 405;
            res.end("Method not allowed");
            return;
          }

          const apiKey = process.env.TYPESAFE_API_KEY;
          if (!apiKey) {
            res.statusCode = 503;
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify({ error: "TYPESAFE_API_KEY not set" }));
            return;
          }

          try {
            const body = await readBody(req);
            const upstream = await fetch(
              "https://api.typesafe.ai/v1/systemone",
              {
                method: "POST",
                headers: {
                  Authorization: `Bearer ${apiKey}`,
                  "Content-Type": "application/json",
                },
                body,
              },
            );

            const text = await upstream.text();
            res.statusCode = upstream.status;
            res.setHeader("Content-Type", "application/json");
            res.end(text);
          } catch (err) {
            res.statusCode = 502;
            res.setHeader("Content-Type", "application/json");
            res.end(
              JSON.stringify({
                error: err instanceof Error ? err.message : "Proxy error",
              }),
            );
          }
        },
      );
    },
  };
}

export default defineConfig({
  plugins: [react(), typesafeProxyPlugin()],
  server: { port: 5173, host: true },
});
