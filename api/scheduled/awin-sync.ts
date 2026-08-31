import type { VercelRequest, VercelResponse } from "@vercel/node";
import runAwinSync from "../awin-sync.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  return runAwinSync(req, res);
}
