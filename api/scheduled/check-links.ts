import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") return res.status(405).json({ ok: false, message: "Use POST." });
  const expected = process.env.CRON_SECRET;
  const authorization = String(req.headers.authorization || "");
  if (expected && authorization !== `Bearer ${expected}`) return res.status(401).json({ ok: false, message: "Unauthorized." });
  try {
    const { getTrackedLinkLifecycle, markTrackedLinkCheck } = await import("../../server/db.js");
    const links = (await getTrackedLinkLifecycle()).filter((link) => link.linkStatus === "active").slice(0, 100);
    let active = 0; let expired = 0;
    for (const link of links) {
      try {
        let response = await fetch(link.destinationUrl, { method: "HEAD", redirect: "follow" });
        if (response.status === 405 || response.status === 403) response = await fetch(link.destinationUrl, { method: "GET", redirect: "follow" });
        const ok = response.status >= 200 && response.status < 400;
        await markTrackedLinkCheck(link.id, ok, ok ? undefined : `HTTP ${response.status}`);
        ok ? active++ : expired++;
      } catch (error) { await markTrackedLinkCheck(link.id, false, error instanceof Error ? error.message : "Request failed"); expired++; }
    }
    return res.status(200).json({ ok: true, checked: links.length, active, expired });
  } catch (error) {
    return res.status(500).json({ ok: false, error: error instanceof Error ? error.message : "Expiry check failed", timestamp: new Date().toISOString() });
  }
}
