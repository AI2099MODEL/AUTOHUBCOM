import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") return res.status(405).json({ ok: false, message: "Use POST." });
  const expected = process.env.CRON_SECRET; if (expected && String(req.headers.authorization || "") !== `Bearer ${expected}`) return res.status(401).json({ ok: false, message: "Unauthorized." });
  const apiToken = process.env.CJ_API_TOKEN; const pid = process.env.CJ_PID; const companyId = process.env.CJ_COMPANY_ID || "";
  if (!apiToken || !pid) return res.status(503).json({ ok: false, message: "CJ automatic sync is not configured. Add CJ_API_TOKEN and CJ_PID to the production deployment." });
  try {
    const response = await fetch(`${process.env.PUBLIC_APP_URL || "https://brandjanra.vercel.app"}/api/cj-sync`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "sync", apiToken, pid, companyId, keyword: "" }) });
    const raw = await response.text(); let result: unknown; try { result = raw ? JSON.parse(raw) : { ok: false, message: `CJ sync returned HTTP ${response.status} with an empty response.` }; } catch { result = { ok: false, message: `CJ sync returned HTTP ${response.status} with a non-JSON response.` }; }
    return res.status(response.ok ? 200 : response.status).json(result);
  } catch (error) { return res.status(500).json({ ok: false, message: error instanceof Error ? error.message : "Automatic CJ sync failed." }); }
}
