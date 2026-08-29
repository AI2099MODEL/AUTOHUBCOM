import type { VercelRequest, VercelResponse } from "@vercel/node";
import { saveSocialConnection } from "../server/db";

const appUrl = process.env.PUBLIC_APP_URL || "https://brandjanra.vercel.app";
const redirectUri = `${appUrl}/api/social-oauth`;
function error(res: VercelResponse, message: string) { return res.status(400).send(`<h1>Social connection failed</h1><p>${message}</p><p>Return to Brand Janra Control Room.</p>`); }
export default async function handler(req: VercelRequest, res: VercelResponse) {
  const provider = String(req.query.provider || "");
  const action = String(req.query.action || "start");
  if (!["meta", "youtube"].includes(provider)) return error(res, "Unknown social provider.");
  if (action === "start") {
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
