import type { VercelRequest, VercelResponse } from "@vercel/node";
import mysql from "mysql2/promise";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") return res.status(405).json({ ok: false, message: "Use POST." });
  const expected = process.env.CRON_SECRET; if (expected && String(req.headers.authorization || "") !== `Bearer ${expected}`) return res.status(401).json({ ok: false, message: "Unauthorized." });
  if (!process.env.DATABASE_URL) return res.status(503).json({ ok: false, message: "DATABASE_URL is not configured in the production deployment." });
  let connection: mysql.Connection | undefined;
  try {
    connection = await mysql.createConnection(process.env.DATABASE_URL);
    const [rows] = await connection.query<Array<{ id: number; destinationUrl: string }>>("SELECT id, destinationUrl FROM tracked_links WHERE linkStatus = 'active' ORDER BY lastCheckedAt ASC LIMIT 100");
    let active = 0; let expired = 0;
    for (const link of rows) {
      try {
        let response = await fetch(link.destinationUrl, { method: "HEAD", redirect: "follow" });
        if (response.status === 405 || response.status === 403) response = await fetch(link.destinationUrl, { method: "GET", redirect: "follow" });
        const ok = response.status >= 200 && response.status < 400;
        await connection.query("UPDATE tracked_links SET lastCheckedAt = NOW(), linkStatus = ?, lastCheckError = ? WHERE id = ?", [ok ? "active" : "expired", ok ? null : `HTTP ${response.status}`, link.id]);
        ok ? active++ : expired++;
      } catch (error) { await connection.query("UPDATE tracked_links SET lastCheckedAt = NOW(), linkStatus = 'expired', lastCheckError = ? WHERE id = ?", [error instanceof Error ? error.message : "Request failed", link.id]); expired++; }
    }
    return res.status(200).json({ ok: true, checked: rows.length, active, expired });
  } catch (error) { return res.status(500).json({ ok: false, error: error instanceof Error ? error.message : "Expiry check failed", timestamp: new Date().toISOString() }); }
  finally { await connection?.end(); }
}
