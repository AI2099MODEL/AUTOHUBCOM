import type { Express, Request, Response } from "express";
import { eq, sql } from "drizzle-orm";
import { attributionEvents, trackedLinks } from "../drizzle/schema";
import { getDb } from "./db";

export function registerRedirectRoutes(app: Express) {
  app.get("/go/:token", async (req: Request, res: Response) => {
    const token = req.params.token;
    const db = await getDb();
    if (!db) return res.status(503).send("Tracking service unavailable");
    const rows = await db.select().from(trackedLinks).where(eq(trackedLinks.token, token)).limit(1);
    const link = rows[0];
    if (!link) return res.status(404).send("Offer link not found");
    await db.update(trackedLinks).set({ clickCount: sql`${trackedLinks.clickCount} + 1` }).where(eq(trackedLinks.id, link.id));
    await db.insert(attributionEvents).values({ productId: link.productId, platform: link.source, eventType: "outbound", consentGiven: false });
    return res.redirect(302, link.destinationUrl);
  });
}
