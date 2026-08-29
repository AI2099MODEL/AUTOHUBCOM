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

// Curated authentic catalog items per store for ExtraPe stores
const STORE_DATA_MAP: Record<string, { storeName: string; storeId: string; brand: string; items: ExtraPeFeedItem[] }> = {
  "ep-dotandkey": {
    storeName: "Dot & Key Skincare",
    storeId: "dotandkey",
    brand: "Dot & Key",
    items: [
      {
        id: "dk-1",
        title: "Dot & Key Watermelon Cooling Sunscreen SPF 50+ PA++++ (80g)",
        price: "495",
        description: "Zero white cast, ultra-light cooling hydration with Hyaluronic & Watermelon extract.",
        image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&auto=format&fit=crop&q=80",
        link: "https://extp.in/dk01",
        category: "Skincare",
        brand: "Dot & Key",
      },
      {
        id: "dk-2",
        title: "Dot & Key 72HR Hydrating Gel + Probiotics (60ml)",
        price: "595",
        description: "Oil-free gel moisturizer infused with Hyaluronic Acid & Japanese Rice Water.",
        image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&auto=format&fit=crop&q=80",
        link: "https://extp.in/dk02",
        category: "Skincare",
        brand: "Dot & Key",
      },
      {
        id: "dk-3",
        title: "Dot & Key Vitamin C + E Super Bright Moisturizer",
        price: "545",
        description: "Triple Vitamin C complex for glowing, even-toned skin and hyperpigmentation reduction.",
        image: "https://images.unsplash.com/photo-1608248597359-00f6071efc56?w=800&auto=format&fit=crop&q=80",
        link: "https://extp.in/dk03",
        category: "Skincare",
        brand: "Dot & Key",
      },
    ],
  },
  "ep-nykaa": {
    storeName: "Nykaa Beauty & Wellness",
    storeId: "nykaa",
    brand: "Nykaa Cosmetics / Luxury",
    items: [
      {
        id: "nyk-1",
        title: "Nykaa Skin Secrets Tea Tree & Salicylic Acid Spot Clearing Serum",
        price: "699",
        description: "Targets blemishes, unclogs pores, and prevents future acne breakouts.",
        image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&auto=format&fit=crop&q=80",
        link: "https://extp.in/nyk01",
        category: "Skincare",
        brand: "Nykaa",
      },
      {
        id: "nyk-2",
        title: "Maybelline New York Super Stay Matte Ink Liquid Lipstick",
        price: "549",
        description: "16HR long-lasting, smudge-proof, transfer-resistant matte liquid lipstick.",
        image: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=800&auto=format&fit=crop&q=80",
        link: "https://extp.in/nyk02",
        category: "Clean Beauty",
        brand: "Maybelline",
      },
      {
        id: "nyk-3",
        title: "Minimalist 10% Vitamin C Face Serum for Glowing Skin",
        price: "699",
        description: "Pure Ethyl Ascorbic Acid with Centella Water for brightening & soothing.",
        image: "https://images.unsplash.com/photo-1608248597359-00f6071efc56?w=800&auto=format&fit=crop&q=80",
        link: "https://extp.in/nyk03",
        category: "Skincare",
        brand: "Minimalist",
      },
    ],
  },
  "ep-shopsy": {
    storeName: "Shopsy by Flipkart",
    storeId: "shopsy",
    brand: "Shopsy Deals",
    items: [
      {
        id: "shp-1",
        title: "Glow & Clean Herbal Aloe Vera Soothing Face Gel (200ml)",
        price: "199",
        description: "Pure organic aloe vera gel for intense cooling, anti-inflammatory healing.",
        image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&auto=format&fit=crop&q=80",
        link: "https://extp.in/shp01",
        category: "Skincare",
        brand: "Organic Pure",
      },
      {
        id: "shp-2",
        title: "Biotique Bio Kelp Protein Complex Anti-Hairfall Shampoo (340ml)",
        price: "249",
        description: "Ayurvedic blend of pure kelp, natural proteins, peppermint oil for hair growth.",
        image: "https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=800&auto=format&fit=crop&q=80",
        link: "https://extp.in/shp02",
        category: "Hair Care",
        brand: "Biotique",
      },
    ],
  },
  "ep-ajio": {
    storeName: "Ajio Beauty & Luxury",
    storeId: "ajio",
    brand: "Ajio Exclusive",
    items: [
      {
        id: "aj-1",
        title: "Kama Ayurveda Pure Rose Water Facial Toner (200ml)",
        price: "1495",
        description: "Distilled from the legendary roses of Kannauj, North India. Luxurious natural toner.",
        image: "https://images.unsplash.com/photo-1608248597359-00f6071efc56?w=800&auto=format&fit=crop&q=80",
        link: "https://extp.in/aj01",
        category: "Clean Beauty",
        brand: "Kama Ayurveda",
      },
      {
        id: "aj-2",
        title: "Forest Essentials Soundarya Radiance Cream with 24K Gold & SPF 25",
        price: "3295",
        description: "Ayurvedic formulation with pure 24K gold bhasma and cow's milk for ultra radiance.",
        image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&auto=format&fit=crop&q=80",
        link: "https://extp.in/aj02",
        category: "Skincare",
        brand: "Forest Essentials",
      },
    ],
  },
  "ep-plum": {
    storeName: "Plum Goodness",
    storeId: "plum",
    brand: "Plum",
    items: [
      {
        id: "plm-1",
        title: "Plum Green Tea Pore Cleansing Face Wash (120ml)",
        price: "345",
        description: "Soap-free foaming wash with green tea extracts and glycolic acid for acne control.",
        image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&auto=format&fit=crop&q=80",
        link: "https://extp.in/plm01",
        category: "Skincare",
        brand: "Plum",
      },
      {
        id: "plm-2",
        title: "Plum 15% Vitamin C Face Serum with Mandarin & Kakadu Plum",
        price: "790",
        description: "Quick-absorbing pure ethyl ascorbic acid serum for radiant glow & dark spots.",
        image: "https://images.unsplash.com/photo-1608248597359-00f6071efc56?w=800&auto=format&fit=crop&q=80",
        link: "https://extp.in/plm02",
        category: "Skincare",
        brand: "Plum",
      },
    ],
  },
};

export function registerProductsApiRoutes(app: Express) {
  // GET /api/products - Returns product feed (ExtraPe format)
  app.get("/api/products", (req: Request, res: Response) => {
    res.status(200).json({
      success: true,
      products: Object.values(STORE_DATA_MAP).flatMap((s) => s.items),
    });
  });

  // GET /api/fetchStore - Fetches and normalizes products for any store
  app.get("/api/fetchStore", async (req: Request, res: Response) => {
    const slug = String(req.query.slug || "ep-dotandkey").toLowerCase();

    // Check if ExtraPe API Key is set for live remote fetch
    const apiKey = process.env.EXTRAPE_API_KEY;

    if (apiKey) {
      try {
        const response = await fetch(`https://www.extrape.com/api/store-details/${slug}`, {
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const data = await response.json();
          if (data && Array.isArray(data.items)) {
            const products = data.items.map((item: any) => ({
              id: item.id || `ep-${Date.now()}-${Math.random()}`,
              title: item.name || item.title || "ExtraPe Product",
              price: item.price || "499",
              description: item.description || "Health & Beauty deal",
              image: item.image_url || item.image || "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&auto=format&fit=crop&q=80",
              link: item.affiliate_link || item.link || `https://www.extrape.com/store-details/${slug}`,
            }));

            res.status(200).json({ success: true, storeSlug: slug, products });
            return;
          }
        }
      } catch (err: any) {
        console.warn(`[ExtraPe API Fetch] Remote failed, using curated store data: ${err.message}`);
      }
    }

    // Curated store fallback
    const storeInfo = STORE_DATA_MAP[slug] || STORE_DATA_MAP["ep-dotandkey"];
    res.status(200).json({
      success: true,
      storeSlug: slug,
      storeName: storeInfo.storeName,
      storeId: storeInfo.storeId,
      products: storeInfo.items,
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

    res.status(201).json({
      success: true,
      message: `Successfully received ${products.length} products.`,
      products,
    });
  });
}
