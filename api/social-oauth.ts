import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createCipheriv, createHash, randomBytes } from "node:crypto";
import { Pool } from "pg";

const appUrl = process.env.PUBLIC_APP_URL || "https://brandjanra.vercel.app";
const redirectUri = `${appUrl}/api/social-oauth`;
const databaseUrl = () => process.env.DATABASE_URL || process.env.POSTGRES_URL || process.env.POSTGRES_PRISMA_URL || process.env.SUPABASE_DB_URL || "";
const postgresUrl = (raw: string) => { try { const url = new URL(raw); ["sslmode", "sslcert", "sslkey", "sslrootcert"].forEach((key) => url.searchParams.delete(key)); return url.toString(); } catch { return raw; } };
const encryptSecret = (value?: string) => { if (!value) return value; const key = createHash("sha256").update(process.env.JWT_SECRET || "brandjanra-token-key").digest(); const iv = randomBytes(12); const cipher = createCipheriv("aes-256-gcm", key, iv); const encrypted = Buffer.concat([cipher.update(value, "utf8"), cipher.final()]); return `v1:${iv.toString("base64url")}:${cipher.getAuthTag().toString("base64url")}:${encrypted.toString("base64url")}`; };

async function saveSocialConnection(input: { platform: "meta" | "youtube"; accountId: string; accountName: string; accessToken: string; refreshToken?: string; tokenExpiresAt?: Date; scopes: string }) {
  const rawUrl = databaseUrl();
  if (!rawUrl) throw new Error("No Vercel/Supabase PostgreSQL URL is configured.");
  const pool = new Pool({ connectionString: postgresUrl(rawUrl), ssl: { rejectUnauthorized: false }, max: 1 });
  try {
    const existing = await pool.query<{ id: number }>('SELECT "id" FROM "social_connections" WHERE "accountId" = $1 LIMIT 1', [input.accountId]);
    const values = [input.platform, input.accountId, input.accountName, encryptSecret(input.accessToken), encryptSecret(input.refreshToken) || null, input.tokenExpiresAt || null, input.scopes];
    if (existing.rows[0]) {
      await pool.query('UPDATE "social_connections" SET "platform"=$1,"accountName"=$2,"accessToken"=$3,"refreshToken"=$4,"tokenExpiresAt"=$5,"scopes"=$6,"status"=\'connected\',"updatedAt"=NOW() WHERE "id"=$7', [...values, existing.rows[0].id]);
      return existing.rows[0].id;
    }
    const result = await pool.query<{ id: number }>('INSERT INTO "social_connections" ("platform","accountId","accountName","accessToken","refreshToken","tokenExpiresAt","scopes","status") VALUES ($1,$2,$3,$4,$5,$6,$7,\'connected\') RETURNING "id"', values);
    return result.rows[0]?.id;
  } finally { await pool.end(); }
}

function error(res: VercelResponse, message: string) { return res.status(400).send(`<h1>Social connection failed</h1><p>${message}</p><p>Return to Brand Janra Control Room.</p>`); }

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const provider = String(req.query.provider || "") as "meta" | "youtube";
  const action = String(req.query.action || "start");
  if (provider !== "meta" && provider !== "youtube") return error(res, "Unknown social provider.");
  if (action === "start") {
    if (provider === "meta" && (!process.env.META_APP_ID || !process.env.META_APP_SECRET)) return error(res, "Meta OAuth is not configured. Add META_APP_ID and META_APP_SECRET to the deployment.");
    if (provider === "youtube" && (!process.env.YOUTUBE_CLIENT_ID || !process.env.YOUTUBE_CLIENT_SECRET)) return error(res, "YouTube OAuth is not configured. Add YOUTUBE_CLIENT_ID and YOUTUBE_CLIENT_SECRET to the deployment.");
    const state = Buffer.from(JSON.stringify({ provider, createdAt: Date.now() })).toString("base64url");
    res.setHeader("Set-Cookie", `janra_oauth_state=${state}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=600`);
    if (provider === "meta") {
      const params = new URLSearchParams({ client_id: process.env.META_APP_ID || "", redirect_uri: redirectUri, state, response_type: "code", scope: "pages_show_list,pages_read_engagement,pages_manage_posts,business_management,instagram_basic,instagram_content_publish" });
      return res.redirect(`https://www.facebook.com/v22.0/dialog/oauth?${params}`);
    }
    const params = new URLSearchParams({ client_id: process.env.YOUTUBE_CLIENT_ID || "", redirect_uri: redirectUri, state, response_type: "code", access_type: "offline", prompt: "consent", scope: "https://www.googleapis.com/auth/youtube.upload https://www.googleapis.com/auth/youtube.readonly" });
    return res.redirect(`https://accounts.google.com/o/oauth2/v2/auth?${params}`);
  }
  const code = String(req.query.code || ""); if (!code) return error(res, "OAuth provider did not return an authorization code.");
  const returnedState = String(req.query.state || ""); const cookieHeader = String(req.headers.cookie || ""); const cookieState = cookieHeader.match(/(?:^|;\s*)janra_oauth_state=([^;]+)/)?.[1] || "";
  if (!returnedState || returnedState !== cookieState) return error(res, "OAuth state validation failed. Restart the connection from the Control Room.");
  try {
    if (provider === "meta") {
      const tokenResponse = await fetch("https://graph.facebook.com/v22.0/oauth/access_token", { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body: new URLSearchParams({ client_id: process.env.META_APP_ID || "", client_secret: process.env.META_APP_SECRET || "", redirect_uri: redirectUri, code }) });
      const token = await tokenResponse.json() as { access_token?: string; error?: { message?: string } }; if (!token.access_token) return error(res, token.error?.message || "Meta did not return an access token.");
      await saveSocialConnection({ platform: "meta", accountId: "meta-business", accountName: "Meta Business Suite", accessToken: token.access_token, scopes: "pages_show_list,pages_read_engagement,pages_manage_posts,business_management,instagram_basic,instagram_content_publish" });
    } else {
      const tokenResponse = await fetch("https://oauth2.googleapis.com/token", { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body: new URLSearchParams({ client_id: process.env.YOUTUBE_CLIENT_ID || "", client_secret: process.env.YOUTUBE_CLIENT_SECRET || "", redirect_uri: redirectUri, grant_type: "authorization_code", code }) });
      const token = await tokenResponse.json() as { access_token?: string; refresh_token?: string; expires_in?: number; error?: string }; if (!token.access_token) return error(res, token.error || "YouTube did not return an access token.");
      await saveSocialConnection({ platform: "youtube", accountId: "youtube-channel", accountName: "YouTube Studio", accessToken: token.access_token, refreshToken: token.refresh_token, tokenExpiresAt: token.expires_in ? new Date(Date.now() + token.expires_in * 1000) : undefined, scopes: "youtube.upload,youtube.readonly" });
    }
    return res.redirect(`${appUrl}/?social=${provider}&connected=1`);
  } catch (e) { return error(res, e instanceof Error ? e.message : "OAuth callback failed."); }
}
