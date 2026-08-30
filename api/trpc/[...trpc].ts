import type { VercelRequest, VercelResponse } from "@vercel/node";
import express from "express";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { appRouter } from "../../server/routers";
import { createContext } from "../../server/_core/context";

const app = express();
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ limit: "5mb", extended: true }));
app.use("/api/trpc", createExpressMiddleware({ router: appRouter, createContext }));
app.use((error: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error("[Vercel tRPC] Request failed:", error);
  if (!res.headersSent) res.status(500).json({ error: { message: "Control Room API unavailable. Verify the Supabase connection and schema." } });
});

export default function handler(req: VercelRequest, res: VercelResponse) {
  return app(req, res);
}
