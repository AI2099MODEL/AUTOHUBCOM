import type { VercelRequest, VercelResponse } from "@vercel/node";
import { nodeHTTPRequestHandler } from "@trpc/server/adapters/node-http";
import { appRouter } from "../../server/routers";
import { createContext } from "../../server/_core/context";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const path = (req.query.trpc || req.url?.split("?")[0].split("/").filter(Boolean).pop() || "").toString();
  try {
    await nodeHTTPRequestHandler({
      req: req as any,
      res: res as any,
      path,
      router: appRouter,
      createContext: ({ req: contextReq, res: contextRes }) =>
        createContext({ req: contextReq as any, res: contextRes as any }),
    });
  } catch (error) {
    console.error("[Vercel tRPC] Request failed:", error);
    if (!res.headersSent) {
      res.status(500).json({ error: { message: "Control Room API unavailable. Verify the Supabase connection and schema." } });
    }
  }
}
