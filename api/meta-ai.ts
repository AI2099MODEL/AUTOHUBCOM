import type { VercelRequest, VercelResponse } from "@vercel/node";

const DEFAULT_PAYLOAD = {
  model: process.env.MODEL || "maverick-1.2-contributor",
  input: [],
  stream: true,
  temperature: 1,
  max_output_tokens: 32000,
  top_p: 1,
  reasoning: { effort: "medium" },
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const apiKey = process.env.MODEL_API_KEY || process.env.META_API_KEY;
  if (!apiKey || apiKey === "your_key_you_just_copied") {
    return res.status(503).json({ error: "Meta AI is not configured. Add MODEL_API_KEY to the production environment." });
  }

  const body = req.body && typeof req.body === "object" ? req.body : {};
  const payload = { ...DEFAULT_PAYLOAD, ...body };

  try {
    const upstream = await fetch("https://api.meta.ai/v1/responses", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        Accept: payload.stream ? "text/event-stream" : "application/json",
      },
      body: JSON.stringify(payload),
    });

    const contentType = upstream.headers.get("content-type") || (payload.stream ? "text/event-stream" : "application/json");
    res.status(upstream.status).setHeader("Content-Type", contentType);
    res.setHeader("Cache-Control", "no-store");

    if (!upstream.body) {
      return res.send(await upstream.text());
    }

    const reader = upstream.body.getReader();
    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        res.write(Buffer.from(value));
      }
    } finally {
      reader.releaseLock();
    }
    return res.end();
  } catch (error) {
    return res.status(502).json({ error: error instanceof Error ? error.message : "Meta AI request failed" });
  }
}
