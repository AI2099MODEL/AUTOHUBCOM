import type { Express, Request, Response } from "express";

export interface ExtraPeFeedItem {
  id?: string | number;
  title: string;
  price: string | number;
  description?: string;
  image?: string;
  link: string;
  category?: string;
  brand?: string;
  store?: string;
}

/**
 * Product routes intentionally fail closed. A product must come from a verified
 * upstream feed; no hand-written fallback catalog is exposed to the storefront.
 */
export function registerProductsApiRoutes(app: Express) {
  app.get("/api/products", (_req: Request, res: Response) => {
    res.status(200).json({
      success: true,
      configured: false,
      products: [],
      message: "No verified affiliate catalog is configured. Products are hidden until a partner feed sync succeeds.",
    });
  });

  app.get("/api/fetchStore", async (req: Request, res: Response) => {
    const slug = String(req.query.slug || "").trim().toLowerCase();
    const apiKey = process.env.EXTRAPE_API_KEY;

    if (!apiKey) {
      res.status(503).json({
        success: false,
        configured: false,
        storeSlug: slug || null,
        products: [],
        message: "ExtraPe is not configured. No fallback or sample products are available.",
      });
      return;
    }

    if (!slug) {
      res.status(400).json({ success: false, products: [], message: "A store slug is required." });
      return;
    }

    try {
      const response = await fetch(`https://www.extrape.com/api/store-details/${encodeURIComponent(slug)}`, {
        headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      });
      const data = await response.json().catch(() => null) as { items?: Array<Record<string, unknown>> } | null;
      if (!response.ok || !data || !Array.isArray(data.items)) {
        res.status(502).json({ success: false, configured: true, storeSlug: slug, products: [], message: "The verified ExtraPe feed could not be read. No fallback products are shown." });
        return;
      }

      const products = data.items
        .map((item) => ({
          id: item.id,
          title: item.name || item.title,
          price: item.price,
          description: item.description,
          image: item.image_url || item.image,
          link: item.affiliate_link || item.link,
          category: item.category,
          brand: item.brand,
          store: slug,
        }))
        .filter((item) => Boolean(item.id && item.title && item.link));

      res.status(200).json({ success: true, configured: true, storeSlug: slug, products });
    } catch (error) {
      console.warn(`[ExtraPe API Fetch] Remote failed: ${error instanceof Error ? error.message : "unknown error"}`);
      res.status(502).json({ success: false, configured: true, storeSlug: slug, products: [], message: "The verified ExtraPe feed is unavailable. No fallback products are shown." });
    }
  });

  app.post("/api/products", (req: Request, res: Response) => {
    const { products } = req.body;
    if (!Array.isArray(products)) {
      res.status(400).json({ success: false, error: "Invalid payload: 'products' array is required." });
      return;
    }
    res.status(202).json({ success: true, message: "Feed received for validation; products are not published by this endpoint.", products: [] });
  });
}

export default registerProductsApiRoutes;
