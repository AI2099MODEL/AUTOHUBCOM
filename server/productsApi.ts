import type { Express, Request, Response } from "express";
import { autoScanAndParseLink } from "./linkScanner";

export interface ExtraPeFeedItem {
  title: string;
  price: string | number;
  description?: string;
  image?: string;
  link: string;
  category?: string;
  brand?: string;
}

// In-memory feed cache fallback
let memoryFeed: ExtraPeFeedItem[] = [
  {
    title: "COSRX Advanced Snail 96 Mucin Power Essence (100ml)",
    price: "19.00",
    description: "Deep skin barrier repair, 96.3% snail secretion filtrate intense hydration.",
    image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&auto=format&fit=crop&q=80",
    link: "https://extp.in/1wlOQq",
    category: "Skincare",
    brand: "COSRX",
  },
  {
    title: "The Ordinary Niacinamide 10% + Zinc 1% (30ml)",
    price: "6.50",
    description: "Minimizes enlarged pores, regulates sebum activity and balances skin texture.",
    image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&auto=format&fit=crop&q=80",
    link: "https://extp.in/xyz123",
    category: "Skincare",
    brand: "The Ordinary",
  },
];

export function registerProductsApiRoutes(app: Express) {
  // GET /api/products - Returns product feed (ExtraPe format)
  app.get("/api/products", (req: Request, res: Response) => {
    res.status(200).json({
      success: true,
      count: memoryFeed.length,
      products: memoryFeed,
    });
  });

  // POST /api/products - Ingests new ExtraPe JSON product feed
  app.post("/api/products", (req: Request, res: Response) => {
    const { products } = req.body;
    if (!Array.isArray(products)) {
      res.status(400).json({
        success: false,
        error: "Invalid payload: 'products' array is required.",
      });
      return;
    }

    const validated: ExtraPeFeedItem[] = products.map((item) => ({
      title: String(item.title || "ExtraPe Curated Product"),
      price: item.price || "15.00",
      description: item.description || "Health & Beauty affiliate deal",
      image: item.image || "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&auto=format&fit=crop&q=80",
      link: String(item.link || item.url || ""),
      category: item.category || "Skincare",
      brand: item.brand || "ExtraPe Verified",
    }));

    memoryFeed = [...validated, ...memoryFeed];

    res.status(201).json({
      success: true,
      message: `Successfully ingested ${validated.length} products from ExtraPe feed.`,
      products: memoryFeed,
    });
  });
}
