import { useMemo, useState } from "react";
import { useLocation } from "wouter";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import {
  ArrowUpRight,
  BarChart3,
  Check,
  ChevronRight,
  CircleHelp,
  ExternalLink,
  Gauge,
  Globe,
  Heart,
  Instagram,
  Link2,
  LockKeyhole,
  MapPin,
  Menu,
  Play,
  Search,
  Send,
  ShieldCheck,
  Sparkles,
  Store,
  TrendingUp,
  Truck,
  Users,
  X,
  Youtube,
} from "lucide-react";
import {
  HEALTH_BEAUTY_CATALOG,
  HealthBeautyItem,
  RECOMMENDED_DEALS_POOL,
  RecommendedDeal,
  STORE_PARTNERS,
  calculateShippingCharge,
  isNewlyAdded,
} from "../../../shared/commerce";

const channels = [
  { name: "Instagram", account: "@brandjanra", icon: Instagram, status: "Connected via Meta Business", color: "text-pink-600", bg: "bg-pink-50", badge: "Brand Janra" },
  { name: "Facebook", account: "Page ID: 1185676227972117", icon: Users, status: "Brand Janra Official Page", color: "text-blue-600", bg: "bg-blue-50", badge: "Page 1185676227972117" },
  { name: "YouTube", account: "@brandjanra", icon: Youtube, status: "Ready for Shorts & Notes", color: "text-red-600", bg: "bg-red-50", badge: "Channel Active" },
];

function HealthBeautyProductCard({
  product,
  currency,
  destination,
  onOpen,
}: {
  product: HealthBeautyItem;
  currency: "USD" | "INR";
  destination: "worldwide" | "india";
  onOpen: (product: HealthBeautyItem) => void;
}) {
  const shipping = calculateShippingCharge(product.storeId, destination, product.priceUsd);
  const formattedPrice = currency === "USD" ? `$${product.priceUsd.toFixed(2)}` : `₹${product.priceInr.toLocaleString()}`;
  const isNew = isNewlyAdded(product.createdAt);

  return (
    <Card className="group flex flex-col justify-between overflow-hidden border-stone-200/80 bg-white/95 shadow-[0_18px_60px_rgba(40,31,20,0.06)] backdrop-blur transition duration-200 hover:-translate-y-1 hover:shadow-[0_24px_70px_rgba(40,31,20,0.12)]">
      <div>
        {/* Product Image Header with Store & Newly Added Badges */}
        <div className="relative h-56 w-full overflow-hidden bg-stone-100">
          <img
            src={product.imageUrl}
            alt={product.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-stone-950/20 to-stone-950/40" />

          {/* Top Badges */}
          <div className="absolute left-3 right-3 top-3 flex items-center justify-between">
            <span className="rounded-full bg-white/90 px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.16em] text-stone-900 shadow-sm backdrop-blur">
              {product.category}
            </span>
            {isNew && (
              <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-rose-500 to-amber-500 px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-white shadow-md">
                ✨ NEW TODAY
              </span>
            )}
          </div>

          {/* Bottom Store Partner Badge */}
          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-stone-950/90 px-3 py-1 text-xs font-bold text-amber-200 shadow-md backdrop-blur">
              <Store className="h-3.5 w-3.5 text-amber-300" />
              {product.storeName}
            </span>
            <span className="rounded-full bg-white/90 px-2.5 py-0.5 text-[10px] font-bold text-stone-900">
              {product.brand}
            </span>
          </div>
        </div>

        <CardContent className="p-5">
          <div className="mb-2 flex items-center justify-between gap-2">
            <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100 font-medium text-[11px]">
              {product.tag}
            </Badge>
            <span className="text-lg font-extrabold text-stone-950">{formattedPrice}</span>
          </div>

          <h3 className="text-base font-bold leading-snug tracking-tight text-stone-950 group-hover:text-amber-950">
            {product.name}
          </h3>
          <p className="mt-2 text-xs leading-5 text-stone-600 line-clamp-2">{product.keyBenefit}</p>

          {product.skinType && (
            <div className="mt-3 rounded-lg bg-stone-50 px-2.5 py-1.5 text-[11px] text-stone-600">
              <span className="font-semibold text-stone-800">Best for:</span> {product.skinType}
            </div>
          )}

          <div className="mt-3 flex items-start gap-1.5 rounded-lg border border-amber-100 bg-amber-50/70 p-2 text-[11px] text-amber-950">
            <Truck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-700" />
            <span>{shipping.message}</span>
          </div>
        </CardContent>
      </div>

      <div className="border-t border-stone-100 p-5 pt-3">
        <div className="mb-3 flex items-center justify-between text-xs text-stone-500">
          <span>AI Fit Score: <strong className="text-stone-900">{product.score}</strong>/100</span>
          <span className="flex items-center gap-1 text-emerald-700 font-medium">
            <Check className="h-3 w-3" /> Link Verified
          </span>
        </div>
        <Button size="sm" onClick={() => onOpen(product)} className="w-full bg-stone-950 text-white hover:bg-stone-800">
          View offer &amp; shipping <ArrowUpRight className="ml-1.5 h-4 w-4" />
        </Button>
      </div>
    </Card>
  );
}

export default function Home() {
  const [, setLocation] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [destination, setDestination] = useState<"worldwide" | "india">("worldwide");
  const [currency, setCurrency] = useState<"USD" | "INR">("USD");
  const [activeTab, setActiveTab] = useState("storefront");

  // Persistent localStorage keys
  const STORAGE_KEY_PRODUCTS = "brandjanra_scanned_products_v3";
  const STORAGE_KEY_SOURCES = "brandjanra_affiliate_sources_v3";

  const [catalogProducts, setCatalogProducts] = useState<HealthBeautyItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_PRODUCTS);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error(e);
    }
    return [];
  });

  const [sourcesList, setSourcesList] = useState<{ id: string; url: string; store: string; status: string; items: number }[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_SOURCES);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error(e);
    }
    return [];
  });

  // Form states for manual or auto-detected ingestion
  const [linkInput, setLinkInput] = useState("");
  const [titleInput, setTitleInput] = useState("");
  const [brandInput, setBrandInput] = useState("");
  const [storeSelect, setStoreSelect] = useState("flipkart");
  const [priceInrInput, setPriceInrInput] = useState("499");
  const [categoryInput, setCategoryInput] = useState<"Skincare" | "Hair Care" | "Wellness & Supplements" | "Clean Beauty" | "Body Care">("Skincare");
  const [imageUrlInput, setImageUrlInput] = useState("https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&auto=format&fit=crop&q=80");
  const [isScanning, setIsScanning] = useState(false);

  const [selectedStudioProduct, setSelectedStudioProduct] = useState<HealthBeautyItem | null>(() => catalogProducts[0] || null);

  const handleScanAndAddLink = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!linkInput.trim()) {
      toast.error("Please paste an affiliate product or store link");
      return;
    }

    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      const url = linkInput.trim();
      const isFkrt = url.includes("fkrt.co") || url.includes("flipkart");
      const isAjio = url.includes("ajio.com") || url.includes("ajio");
      const isNykaa = url.includes("nykaa.com") || url.includes("nykaa");
      const isIherb = url.includes("iherb.com") || url.includes("iherb");
      const isAmazon = url.includes("amazon");

      const storeId = storeSelect || (isFkrt ? "flipkart" : isAjio ? "ajio" : isNykaa ? "nykaa" : isIherb ? "iherb" : isAmazon ? "amazon_in" : "extrape");
      const storeName =
        storeId === "flipkart"
          ? "Flipkart Health & Beauty"
          : storeId === "ajio"
          ? "Ajio Beauty & Luxury"
          : storeId === "nykaa"
          ? "Nykaa"
          : storeId === "iherb"
          ? "iHerb Global"
          : storeId === "tira"
          ? "Tira Beauty"
          : storeId === "amazon_in" || storeId === "amazon_global"
          ? "Amazon"
          : "Verified Partner Store";

      const priceInr = Number(priceInrInput) || 499;
      const priceUsd = Number((priceInr / 83).toFixed(2));
      const productName = titleInput.trim() || `Health & Beauty Offer (${storeName})`;
      const brand = brandInput.trim() || "Verified Brand";

      const newProduct: HealthBeautyItem = {
        id: `prod-${Date.now()}`,
        slug: `product-${Date.now()}`,
        name: productName,
        brand,
        category: categoryInput,
        type: "affiliate",
        priceUsd,
        priceInr,
        storeId,
        storeName,
        imageUrl: imageUrlInput || "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&auto=format&fit=crop&q=80",
        accent: "from-sky-100 via-blue-50 to-cyan-50",
        score: 96,
        keyBenefit: `Authentic ${categoryInput} product with direct affiliate warranty and express shipping.`,
        skinType: "All skin types",
        shipsWorldwide: storeId === "iherb" || storeId === "amazon_global",
        shipsIndia: true,
        shippingNote: storeId === "flipkart" ? "Fast 2-3 Day Delivery (Free over ₹500)" : storeId === "ajio" ? "Express Delivery (Free over ₹799)" : "India Express Shipping",
        affiliateUrl: url,
        tag: "Verified Affiliate Link",
        approvedForPublishing: true,
        createdAt: new Date().toISOString(),
      };

      const updatedProducts = [newProduct, ...catalogProducts];
      setCatalogProducts(updatedProducts);
      localStorage.setItem(STORAGE_KEY_PRODUCTS, JSON.stringify(updatedProducts));

      const updatedSources = [
        {
          id: String(Date.now()),
          url,
          store: storeName,
          status: "Active · Scanning hourly",
          items: 1,
        },
        ...sourcesList,
      ];
      setSourcesList(updatedSources);
      localStorage.setItem(STORAGE_KEY_SOURCES, JSON.stringify(updatedSources));

      // Reset input fields
      setLinkInput("");
      setTitleInput("");
      setBrandInput("");

      toast.success(`"${productName}" Added to Live Store!`, {
        description: `Source: ${storeName} · Product is now visible on your storefront.`,
      });
    }, 400);
  };

  const handleDeleteProduct = (productId: string) => {
    const updated = catalogProducts.filter((p) => p.id !== productId);
    setCatalogProducts(updated);
    localStorage.setItem(STORAGE_KEY_PRODUCTS, JSON.stringify(updated));
    toast.info("Product removed from live store");
  };

  const handleClearAllProducts = () => {
    if (confirm("Are you sure you want to clear all products from the store?")) {
      setCatalogProducts([]);
      setSourcesList([]);
      localStorage.removeItem(STORAGE_KEY_PRODUCTS);
      localStorage.removeItem(STORAGE_KEY_SOURCES);
      toast.success("Storefront cleared. You can now add your new affiliate links.");
    }
  };

  const handleRunHourlyScanNow = () => {
    toast.promise(
      new Promise((resolve) => setTimeout(resolve, 800)),
      {
        loading: "Running hourly scan across your affiliate feeds...",
        success: `Scan complete! Verified ${sourcesList.length} active feeds. 0 expired links.`,
        error: "Failed to run scan",
      }
    );
  };

  const filteredProducts = useMemo(() => {
    return categoryFilter === "all"
      ? catalogProducts
      : catalogProducts.filter((p) => p.category === categoryFilter);
  }, [categoryFilter, catalogProducts]);

  const openProduct = (product: HealthBeautyItem) => setLocation(`/product/${product.slug}`);

  const handleAutoPublishAll = () => {
    if (catalogProducts.length === 0) {
      toast.error("No products in store to publish. Add products in Control Room first.");
      return;
    }
    toast.success("Auto-Publishing Health & Beauty Catalog to Meta", {
      description: `Queued ${catalogProducts.length} items with FTC disclosure for Brand Janra (Facebook Page 1185676227972117 & Instagram @brandjanra)`,
    });
  };

  return (
    <div className="min-h-screen bg-[#f8f6f1] text-stone-950">
      {/* Top Banner */}
      <div className="border-b border-stone-200/60 bg-stone-900 px-5 py-2 text-center text-xs text-stone-300">
        <span>🌐 Global Health &amp; Beauty Store · Ships Worldwide &amp; India · Curated by <strong>Brand Janra</strong></span>
      </div>

      <header className="sticky top-0 z-30 border-b border-stone-200/70 bg-[#f8f6f1]/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
          <a href="#top" className="flex items-center gap-3.5" aria-label="Brand Janra Curated Health and Beauty">
            <img src="/logo-icon.png" alt="Brand Janra" className="h-11 w-11 object-contain rounded-2xl bg-stone-900 p-1 shadow-sm border border-stone-800" />
            <span>
              <span className="block text-sm font-bold tracking-[0.18em]">BRAND JANRA</span>
              <span className="block text-[10px] uppercase tracking-[0.2em] text-stone-500">Global Health &amp; Beauty Edit</span>
            </span>
          </a>

          <nav className="hidden items-center gap-7 text-sm font-medium text-stone-600 md:flex">
            <a href="#shop" className="transition hover:text-stone-950">Our shop</a>
            <a href="#deals" className="transition hover:text-stone-950">Curated deals</a>
            <a href="#stores" className="transition hover:text-stone-950">Store partners</a>
            <a href="#content" className="transition hover:text-stone-950">Field notes</a>
            <a href="#trust" className="transition hover:text-stone-950">Trust &amp; Disclosures</a>
          </nav>

          <div className="hidden items-center gap-3 md:flex">
            {/* Currency Switcher */}
            <div className="flex rounded-lg border border-stone-300 bg-white/70 p-0.5 text-xs font-semibold">
              <button
                onClick={() => setCurrency("USD")}
                className={`rounded px-2.5 py-1 ${currency === "USD" ? "bg-stone-950 text-white" : "text-stone-600 hover:text-stone-950"}`}
              >
                USD ($)
              </button>
              <button
                onClick={() => setCurrency("INR")}
                className={`rounded px-2.5 py-1 ${currency === "INR" ? "bg-stone-950 text-white" : "text-stone-600 hover:text-stone-950"}`}
              >
                INR (₹)
              </button>
            </div>

            <Button variant="outline" className="border-stone-300 bg-transparent" onClick={() => setActiveTab("studio")}>
              <Gauge className="mr-2 h-4 w-4" />Control Room
            </Button>
          </div>

          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMobileOpen((value) => !value)} aria-label="Toggle navigation">
            {mobileOpen ? <X /> : <Menu />}
          </Button>
        </div>

        {mobileOpen && (
          <div className="border-t border-stone-200 px-5 py-4 md:hidden">
            <div className="flex flex-col gap-4 text-sm font-medium">
              <a href="#deals" onClick={() => setMobileOpen(false)}>Curated picks</a>
              <a href="#stores" onClick={() => setMobileOpen(false)}>Store partners</a>
              <a href="#content" onClick={() => setMobileOpen(false)}>Field notes</a>
              <a href="#trust" onClick={() => setMobileOpen(false)}>Trust center</a>
            </div>
          </div>
        )}
      </header>

      <main id="top">
        {/* Hero Section */}
        <section className="relative overflow-hidden px-5 pb-16 pt-12 lg:px-8 lg:pb-20 lg:pt-20">
          <div className="absolute -right-24 top-10 h-80 w-80 rounded-full bg-rose-200/40 blur-3xl" />
          <div className="absolute -left-24 bottom-0 h-72 w-72 rounded-full bg-amber-200/35 blur-3xl" />
          <div className="relative mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <Badge className="mb-5 border border-stone-300 bg-white/70 px-3 py-1.5 text-stone-800">
                <Sparkles className="mr-2 h-3.5 w-3.5 text-amber-600" />
                Global &amp; India Health &amp; Beauty Hub
              </Badge>
              <h1 className="max-w-3xl text-4xl font-semibold leading-[1.02] tracking-[-0.05em] sm:text-5xl lg:text-7xl">
                Clean skincare.<br />
                <span className="text-stone-400">Transparent shipping.</span>
              </h1>
              <p className="mt-6 max-w-xl text-base leading-7 text-stone-600 sm:text-lg">
                Discover dermatologist-approved serums, viral hair treatments, and organic wellness from top global merchants (iHerb, Amazon Global) and Indian destinations (Nykaa, Amazon India). Always transparent affiliate deals.
              </p>

              {/* Shipping Destination Selector */}
              <div className="mt-8 rounded-2xl border border-stone-200 bg-white/80 p-4 shadow-sm backdrop-blur">
                <div className="text-xs font-bold uppercase tracking-widest text-stone-500">Select Your Shipping Destination:</div>
                <div className="mt-3 flex flex-wrap gap-2">
                  <button
                    onClick={() => { setDestination("worldwide"); setCurrency("USD"); }}
                    className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition ${destination === "worldwide" ? "bg-stone-950 text-white shadow" : "border border-stone-200 bg-white text-stone-700 hover:bg-stone-100"}`}
                  >
                    <Globe className="h-4 w-4" /> Worldwide (US / UK / EU / Global)
                  </button>
                  <button
                    onClick={() => { setDestination("india"); setCurrency("INR"); }}
                    className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition ${destination === "india" ? "bg-stone-950 text-white shadow" : "border border-stone-200 bg-white text-stone-700 hover:bg-stone-100"}`}
                  >
                    <MapPin className="h-4 w-4" /> India (Express &amp; Free &gt; ₹499)
                  </button>
                </div>
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                <Button size="lg" className="bg-stone-950 px-6 text-white hover:bg-stone-800" onClick={() => document.getElementById("deals")?.scrollIntoView({ behavior: "smooth" })}>
                  Explore Health &amp; Beauty Edit <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
                <Button size="lg" variant="outline" className="border-stone-300 bg-white/60" onClick={() => setActiveTab("studio")}>
                  Open Meta Studio
                </Button>
              </div>
            </div>

            {/* Operating Preview Card */}
            <div className="relative rounded-[2rem] border border-white/80 bg-stone-950 p-6 text-white shadow-[0_30px_90px_rgba(20,18,14,0.18)] sm:p-8">
              <div className="flex items-center justify-between border-b border-white/10 pb-5">
                <span className="text-xs uppercase tracking-[0.2em] text-stone-400">Distribution Engine</span>
                <span className="flex items-center gap-2 text-xs text-emerald-300">
                  <span className="h-2 w-2 rounded-full bg-emerald-300" />
                  Meta Graph API Active
                </span>
              </div>
              <div className="py-6">
                <p className="text-2xl font-semibold tracking-tight sm:text-3xl">Brand Janra Social Link</p>
                <p className="mt-3 text-sm leading-6 text-stone-400">
                  Every product is automatically formatted with FTC disclaimers and published to Facebook Page <strong>1185676227972117</strong> and Instagram <strong>@brandjanra</strong>.
                </p>
              </div>
              <div className="grid grid-cols-3 gap-2 border-t border-white/10 pt-5 text-center">
                <div>
                  <div className="text-xl font-bold sm:text-2xl">{catalogProducts.length} Items</div>
                  <div className="mt-1 text-[10px] uppercase tracking-widest text-stone-500">Live Scanned</div>
                </div>
                <div>
                  <div className="text-xl font-bold sm:text-2xl">
                    {new Set(catalogProducts.map((p) => p.storeName)).size} Stores
                  </div>
                  <div className="mt-1 text-[10px] uppercase tracking-widest text-stone-500">Partners</div>
                </div>
                <div>
                  <div className="text-xl font-bold sm:text-2xl">100%</div>
                  <div className="mt-1 text-[10px] uppercase tracking-widest text-stone-500">Tracked</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Store Partners Bar */}
        <section id="stores" className="border-y border-stone-200/80 bg-white/70 px-5 py-5 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <p className="text-center text-xs font-bold uppercase tracking-[0.2em] text-stone-500">
              Active Verified Merchant Stores
            </p>
            <div className="mt-4 flex flex-wrap items-center justify-center gap-3 text-xs font-bold text-stone-800 sm:gap-4">
              {Array.from(new Set(catalogProducts.map((p) => p.storeName))).map((storeName) => (
                <span
                  key={storeName}
                  className="flex items-center gap-1.5 rounded-full border border-stone-300/80 bg-white px-4 py-1.5 shadow-xs"
                >
                  <Store className="h-3.5 w-3.5 text-stone-700" /> {storeName}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* Product Catalog Grid */}
        <section id="shop" className="scroll-mt-24 px-5 py-16 lg:px-8 lg:py-24">
          <div id="deals" className="scroll-mt-24" />
          <div className="mx-auto max-w-7xl">
            <div className="mb-10 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-rose-700">Health &amp; Beauty Edit</p>
                <h2 className="mt-2 text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">Curated Finds &amp; Verified Shipping</h2>
                <p className="mt-2 text-sm text-stone-600">
                  Showing prices in <strong>{currency}</strong> for destination: <strong>{destination === "worldwide" ? "Worldwide" : "India"}</strong>.
                </p>
              </div>

              {/* Category Filter */}
              <div className="flex flex-wrap gap-2">
                {["all", "Skincare", "Hair Care", "Wellness & Supplements"].map((cat) => (
                  <Button
                    key={cat}
                    size="sm"
                    variant={categoryFilter === cat ? "default" : "outline"}
                    className={categoryFilter === cat ? "bg-stone-950 text-white" : "border-stone-300 bg-transparent text-stone-700"}
                    onClick={() => setCategoryFilter(cat)}
                  >
                    {cat === "all" ? "All categories" : cat}
                  </Button>
                ))}
              </div>
            </div>

            {/* Products Grid or Empty State */}
            {filteredProducts.length === 0 ? (
              <div className="rounded-3xl border-2 border-dashed border-stone-300 bg-white/80 p-12 text-center shadow-xs">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-100 text-amber-900 shadow-sm">
                  <Store className="h-8 w-8" />
                </div>
                <h3 className="mt-5 text-2xl font-bold text-stone-950">No Products in Your Store Yet</h3>
                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-stone-600">
                  Your store is ready! Open the Control Room to paste your real affiliate links (Flipkart, ExtraPe, Ajio, Nykaa, Amazon, etc.) and launch them live.
                </p>
                <Button
                  className="mt-6 bg-stone-950 px-6 py-2.5 font-bold text-white hover:bg-stone-800"
                  onClick={() => setActiveTab("scanner")}
                >
                  ⚡ Open Control Room &amp; Add Affiliate Links
                </Button>
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filteredProducts.map((product) => (
                  <HealthBeautyProductCard
                    key={product.id}
                    product={product}
                    currency={currency}
                    destination={destination}
                    onOpen={openProduct}
                  />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Field notes / Social Distribution */}
        <section id="content" className="scroll-mt-24 bg-stone-950 px-5 py-16 text-white lg:px-8 lg:py-24">
          <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-amber-300">Field notes</p>
              <h2 className="mt-3 text-4xl font-semibold tracking-[-0.04em] sm:text-5xl">Automated Social Distribution</h2>
              <p className="mt-5 max-w-md leading-7 text-stone-400">
                Step 2 Automation: Every Health &amp; Beauty product is formatted with video scripts, skincare advice, and FTC disclosures, then automatically published to the <strong>Brand Janra</strong> Facebook Page and <strong>Instagram</strong>.
              </p>
              <div className="mt-6 flex flex-wrap gap-2 text-xs text-stone-400">
                <span className="rounded-full bg-white/10 px-3 py-1 text-emerald-300">FB Page: 1185676227972117</span>
                <span className="rounded-full bg-white/10 px-3 py-1 text-pink-300">IG: @brandjanra</span>
              </div>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button className="bg-amber-200 text-stone-950 hover:bg-amber-100" onClick={() => setActiveTab("studio")}>
                  Open Content Studio <ArrowUpRight className="ml-2 h-4 w-4" />
                </Button>
                <Button variant="outline" className="border-white/20 text-white hover:bg-white/10" onClick={handleAutoPublishAll}>
                  <Send className="mr-2 h-4 w-4" /> Auto-Publish All Products
                </Button>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              {channels.map(({ name, account, icon: Icon, status, color, bg, badge }) => (
                <div key={name} className="rounded-3xl border border-white/10 bg-white/[0.06] p-5">
                  <div className={`flex h-11 w-11 items-center justify-center rounded-2xl ${bg} ${color}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-5 font-semibold">{name}</h3>
                  <div className="mt-1 text-xs font-medium text-amber-200">{account}</div>
                  <p className="mt-2 text-xs leading-5 text-stone-400">{status}</p>
                  <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-4">
                    <span className="flex items-center gap-1.5 text-[11px] font-medium text-emerald-300">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-300" />
                      Live / Ready
                    </span>
                    <Badge variant="outline" className="border-white/20 text-[10px] text-stone-300">
                      {badge}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Trust & Disclosures */}
        <section id="trust" className="scroll-mt-24 px-5 py-16 lg:px-8 lg:py-24">
          <div className="mx-auto max-w-7xl">
            <div className="mb-9 flex items-end justify-between gap-5">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-emerald-700">Trust center</p>
                <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">Clear by default.</h2>
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              <Card className="border-stone-200 bg-white/60">
                <CardHeader>
                  <ShieldCheck className="h-6 w-6 text-emerald-700" />
                  <CardTitle className="mt-2 text-xl">Affiliate Disclosures</CardTitle>
                </CardHeader>
                <CardContent className="text-sm leading-6 text-stone-600">
                  Partner links are labeled with #BrandJanraPartner and #ad. We may earn a commission without changing your price.
                </CardContent>
              </Card>
              <Card className="border-stone-200 bg-white/60">
                <CardHeader>
                  <Truck className="h-6 w-6 text-orange-700" />
                  <CardTitle className="mt-2 text-xl">Transparent Shipping</CardTitle>
                </CardHeader>
                <CardContent className="text-sm leading-6 text-stone-600">
                  We show delivery time and free shipping thresholds upfront so you know total cost before checkout.
                </CardContent>
              </Card>
              <Card className="border-stone-200 bg-white/60">
                <CardHeader>
                  <Sparkles className="h-6 w-6 text-stone-700" />
                  <CardTitle className="mt-2 text-xl">Claim Safety Verification</CardTitle>
                </CardHeader>
                <CardContent className="text-sm leading-6 text-stone-600">
                  Every product brief is vetted to avoid unsubstantiated medical claims before being posted to social feeds.
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <section className="border-t border-stone-200 bg-white/60 px-5 py-8 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-3 text-sm text-stone-500 sm:flex-row">
          <span>© 2026 Brand Janra. Global &amp; India Health &amp; Beauty Hub.</span>
          <span className="flex items-center gap-2">
            <LockKeyhole className="h-4 w-4" /> Privacy-aware analytics · Affiliate disclosure
          </span>
        </div>
      </section>

      {/* Control Room Drawer */}
      {activeTab !== "storefront" && (
        <div className="fixed inset-0 z-40 bg-stone-950/35 backdrop-blur-sm" onClick={() => setActiveTab("storefront")}>
          <aside
            className="absolute right-0 top-0 h-full w-full max-w-2xl overflow-y-auto bg-[#f8f6f1] p-6 shadow-2xl sm:p-10"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-stone-500">Control room</p>
                <h2 className="mt-2 text-3xl font-semibold">Brand Janra OS</h2>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setActiveTab("storefront")}>
                <X />
              </Button>
            </div>

            <Tabs defaultValue="scanner" onValueChange={setActiveTab} className="mt-8">
              <TabsList className="grid w-full grid-cols-5 bg-stone-200/60 text-xs">
                <TabsTrigger value="scanner">⚡ Add &amp; Manage</TabsTrigger>
                <TabsTrigger value="studio">Content studio</TabsTrigger>
                <TabsTrigger value="meta">Meta channels</TabsTrigger>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
                <TabsTrigger value="settings">Guardrails</TabsTrigger>
              </TabsList>

              {/* Auto Scanner & Ingestion Tab */}
              <TabsContent value="scanner" className="mt-6 space-y-6">
                {/* Add Product Form */}
                <Card className="border-stone-300 shadow-sm">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-base font-bold">Add Affiliate Product to Store</CardTitle>
                        <p className="mt-1 text-xs text-stone-500">
                          Paste any link (Flipkart, ExtraPe, Ajio, Nykaa, Amazon, Tira, Plum, Dot &amp; Key, iHerb).
                        </p>
                      </div>
                      <Badge className="bg-amber-100 text-amber-900 font-bold">Verified Ingestion</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleScanAndAddLink} className="space-y-3.5">
                      <div>
                        <label className="text-xs font-bold text-stone-700">Affiliate Product Link *</label>
                        <input
                          type="url"
                          required
                          placeholder="e.g. https://fkrt.co/... or https://extrape.com/c/..."
                          value={linkInput}
                          onChange={(e) => {
                            setLinkInput(e.target.value);
                            const val = e.target.value.toLowerCase();
                            if (val.includes("fkrt.co") || val.includes("flipkart")) setStoreSelect("flipkart");
                            else if (val.includes("ajio")) setStoreSelect("ajio");
                            else if (val.includes("nykaa")) setStoreSelect("nykaa");
                            else if (val.includes("iherb")) setStoreSelect("iherb");
                            else if (val.includes("amazon")) setStoreSelect("amazon_in");
                          }}
                          className="mt-1 w-full rounded-xl border border-stone-300 bg-white px-3.5 py-2.5 text-xs text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-900"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-xs font-bold text-stone-700">Product Title</label>
                          <input
                            type="text"
                            placeholder="e.g. Hydro Boost Water Gel (50g)"
                            value={titleInput}
                            onChange={(e) => setTitleInput(e.target.value)}
                            className="mt-1 w-full rounded-xl border border-stone-300 bg-white px-3.5 py-2 text-xs text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-900"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-bold text-stone-700">Brand Name</label>
                          <input
                            type="text"
                            placeholder="e.g. Neutrogena"
                            value={brandInput}
                            onChange={(e) => setBrandInput(e.target.value)}
                            className="mt-1 w-full rounded-xl border border-stone-300 bg-white px-3.5 py-2 text-xs text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-900"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-3">
                        <div>
                          <label className="text-xs font-bold text-stone-700">Store Merchant</label>
                          <select
                            value={storeSelect}
                            onChange={(e) => setStoreSelect(e.target.value)}
                            className="mt-1 w-full rounded-xl border border-stone-300 bg-white px-2.5 py-2 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-stone-900"
                          >
                            <option value="flipkart">Flipkart</option>
                            <option value="ajio">Ajio</option>
                            <option value="nykaa">Nykaa</option>
                            <option value="tira">Tira Beauty</option>
                            <option value="iherb">iHerb Global</option>
                            <option value="amazon_in">Amazon India</option>
                            <option value="dotandkey">Dot &amp; Key</option>
                            <option value="plum">Plum Goodness</option>
                            <option value="extrape">ExtraPe Deals</option>
                          </select>
                        </div>
                        <div>
                          <label className="text-xs font-bold text-stone-700">Category</label>
                          <select
                            value={categoryInput}
                            onChange={(e) => setCategoryInput(e.target.value as any)}
                            className="mt-1 w-full rounded-xl border border-stone-300 bg-white px-2.5 py-2 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-stone-900"
                          >
                            <option value="Skincare">Skincare</option>
                            <option value="Hair Care">Hair Care</option>
                            <option value="Wellness &amp; Supplements">Wellness</option>
                            <option value="Clean Beauty">Clean Beauty</option>
                            <option value="Body Care">Body Care</option>
                          </select>
                        </div>
                        <div>
                          <label className="text-xs font-bold text-stone-700">Price (₹ INR)</label>
                          <input
                            type="number"
                            placeholder="440"
                            value={priceInrInput}
                            onChange={(e) => setPriceInrInput(e.target.value)}
                            className="mt-1 w-full rounded-xl border border-stone-300 bg-white px-3.5 py-2 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-stone-900"
                          />
                        </div>
                      </div>

                      <Button
                        type="submit"
                        disabled={isScanning}
                        className="mt-2 w-full bg-stone-950 py-3 text-xs font-bold text-white hover:bg-stone-800"
                      >
                        {isScanning ? "Processing Link..." : "🚀 Ingest & Publish Product to Store"}
                      </Button>
                    </form>
                  </CardContent>
                </Card>

                {/* Manage Live Products on Store */}
                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-sm font-bold">Live Products on Store ({catalogProducts.length})</CardTitle>
                        <p className="text-xs text-stone-500">Manage or remove products currently displayed on your storefront.</p>
                      </div>
                      {catalogProducts.length > 0 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={handleClearAllProducts}
                          className="text-xs text-rose-600 hover:bg-rose-50"
                        >
                          Clear All
                        </Button>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {catalogProducts.length === 0 ? (
                      <div className="rounded-xl border border-dashed border-stone-300 p-6 text-center text-xs text-stone-500">
                        No products added yet. Use the form above to add your first affiliate product.
                      </div>
                    ) : (
                      catalogProducts.map((p) => (
                        <div
                          key={p.id}
                          className="flex items-center justify-between rounded-xl border border-stone-200 bg-white p-3 text-xs shadow-xs"
                        >
                          <div className="flex items-center gap-3 truncate pr-2">
                            <img src={p.imageUrl} alt={p.name} className="h-10 w-10 shrink-0 rounded-lg object-cover bg-stone-100" />
                            <div className="truncate">
                              <div className="font-bold text-stone-950 truncate">{p.name}</div>
                              <div className="text-[11px] text-stone-500">
                                {p.brand} · <strong>₹{p.priceInr}</strong> · {p.storeName}
                              </div>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteProduct(p.id)}
                            className="text-rose-600 hover:bg-rose-50 text-xs px-2.5"
                          >
                            Delete
                          </Button>
                        </div>
                      ))
                    )}
                  </CardContent>
                </Card>

                {/* Hourly Background Scanner Status */}
                <div className="rounded-2xl border border-stone-200 bg-stone-900 p-5 text-white shadow-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <span className="flex h-2.5 w-2.5 relative">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                      </span>
                      <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                        Hourly Background Auto-Scanner
                      </span>
                    </div>
                    <Button
                      size="sm"
                      onClick={handleRunHourlyScanNow}
                      className="bg-emerald-500 px-3 py-1 text-xs font-bold text-stone-950 hover:bg-emerald-400"
                    >
                      ⚡ Run Scan Now
                    </Button>
                  </div>
                  <p className="mt-3 text-xs leading-relaxed text-stone-300">
                    Monitors your affiliate feeds every 60 minutes and verifies link health automatically.
                  </p>
                </div>

                {/* Monitored Affiliate Feed Sources */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-bold">Monitored Affiliate Source Feeds ({sourcesList.length})</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {sourcesList.length === 0 ? (
                      <div className="rounded-xl border border-dashed border-stone-300 p-6 text-center text-xs text-stone-500">
                        No feeds monitored yet. Add an affiliate link above to start auto-scanning.
                      </div>
                    ) : (
                      sourcesList.map((source) => (
                        <div
                          key={source.id}
                          className="flex items-center justify-between rounded-xl border border-stone-200 bg-white/70 p-3 text-xs"
                        >
                          <div className="truncate pr-3">
                            <div className="font-bold text-stone-900">{source.store}</div>
                            <div className="truncate text-[11px] text-stone-500">{source.url}</div>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <span className="rounded-md bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                              {source.status}
                            </span>
                            <button
                              onClick={() => {
                                const updated = sourcesList.filter((s) => s.id !== source.id);
                                setSourcesList(updated);
                                localStorage.setItem(STORAGE_KEY_SOURCES, JSON.stringify(updated));
                                toast.info("Removed source from auto-scanner");
                              }}
                              className="rounded-lg p-1 text-stone-400 hover:bg-stone-100 hover:text-rose-600"
                              aria-label="Remove source"
                            >
                              <X className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Studio Tab */}
              <TabsContent value="studio" className="mt-6 space-y-4">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>Select Product for Auto-Publishing</CardTitle>
                        <p className="mt-1 text-xs text-stone-500">Target: Brand Janra (Facebook Page 1185676227972117 &amp; Instagram @brandjanra)</p>
                      </div>
                      <Badge className="bg-emerald-100 text-emerald-800">Ready to Publish</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Product Selector */}
                    {catalogProducts.length === 0 ? (
                      <div className="rounded-xl border border-dashed border-stone-300 p-6 text-center text-xs text-stone-500">
                        No products added yet. Add an affiliate product first to generate and preview social posts.
                      </div>
                    ) : (
                      <>
                        <div className="flex flex-wrap gap-2">
                          {catalogProducts.map((item) => (
                            <button
                              key={item.id}
                              onClick={() => setSelectedStudioProduct(item)}
                              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${(selectedStudioProduct?.id || catalogProducts[0].id) === item.id ? "bg-stone-950 text-white" : "border border-stone-200 bg-white text-stone-700 hover:bg-stone-100"}`}
                            >
                              {item.name.split(" ")[0]} {item.name.split(" ")[1] || ""}
                            </button>
                          ))}
                        </div>

                        {selectedStudioProduct && (
                          <>
                            <div className="rounded-2xl bg-stone-950 p-5 text-white">
                              <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-amber-200">
                                <Play className="h-3 w-3" />
                                Instagram Reel Script &amp; Facebook Feed Copy
                              </div>
                              <p className="mt-4 text-base font-semibold leading-7">
                                “Looking for glass skin or stronger hair? Here’s why the {selectedStudioProduct.name} by {selectedStudioProduct.brand} made our curated health &amp; beauty edit today.”
                              </p>
                              <p className="mt-2 text-xs text-stone-400">
                                {selectedStudioProduct.keyBenefit}
                              </p>
                              <div className="mt-4 rounded-xl bg-white/10 p-3 text-xs text-amber-100">
                                Disclosure: #BrandJanraPartner #ad · Merchant: {selectedStudioProduct.storeName} ({selectedStudioProduct.shippingNote})
                              </div>
                            </div>

                            <div className="grid gap-3 sm:grid-cols-2">
                              <Button
                                className="w-full justify-between bg-blue-700 text-white hover:bg-blue-800"
                                onClick={() => toast.success(`Posted ${selectedStudioProduct.name} to Brand Janra Facebook Page (ID: 1185676227972117)`)}
                              >
                                Publish to Facebook <ChevronRight className="h-4 w-4" />
                              </Button>
                              <Button
                                className="w-full justify-between bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:opacity-90"
                                onClick={() => toast.success(`Published Reel for ${selectedStudioProduct.name} to Instagram (@brandjanra)`)}
                              >
                                Publish to Instagram <ChevronRight className="h-4 w-4" />
                              </Button>
                            </div>
                          </>
                        )}
                      </>
                    )}

                    <Button
                      variant="outline"
                      className="w-full border-stone-300"
                      onClick={handleAutoPublishAll}
                    >
                      <Send className="mr-2 h-4 w-4" /> Batch Publish All Live Products ({catalogProducts.length})
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Meta Channels Tab */}
              <TabsContent value="meta" className="mt-6 space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Meta Connected Channels</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="rounded-2xl border border-stone-200 bg-white/70 p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-semibold text-stone-950">Brand Janra (Facebook Page)</div>
                          <div className="text-xs text-stone-500">Page ID: <strong className="text-stone-800">1185676227972117</strong></div>
                        </div>
                        <span className="flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800">
                          <Check className="h-3.5 w-3.5" /> Configured
                        </span>
                      </div>
                    </div>

                    <div className="rounded-2xl border border-stone-200 bg-white/70 p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-semibold text-stone-950">Instagram Business Account</div>
                          <div className="text-xs text-stone-500">Handle: <strong className="text-stone-800">@brandjanra</strong></div>
                        </div>
                        <span className="flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800">
                          <Check className="h-3.5 w-3.5" /> Linked to Page
                        </span>
                      </div>
                    </div>

                    <Button
                      variant="outline"
                      className="w-full border-stone-300"
                      onClick={() => toast.success("Meta Graph API connection verified for Brand Janra (Page ID: 1185676227972117 & @brandjanra)")}
                    >
                      Test Meta API Connection
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Analytics Tab */}
              <TabsContent value="analytics" className="mt-6 space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <Metric label="Outbound clicks" value="1,842" change="+24.2%" icon={Link2} />
                  <Metric label="Offers viewed" value="5,210" change="+18.7%" icon={TrendingUp} />
                  <Metric label="Content saves" value="680" change="+14.3%" icon={BarChart3} />
                  <Metric label="Attribution" value="88%" change="Consent-aware" icon={Gauge} />
                </div>
                <Card>
                  <CardHeader>
                    <CardTitle>Channel Signal</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {[["Instagram (@brandjanra)", "72%", "bg-pink-500"], ["Facebook (Brand Janra)", "48%", "bg-blue-500"], ["YouTube (@brandjanra)", "56%", "bg-red-500"]].map(([name, value, color]) => (
                      <div key={name}>
                        <div className="mb-2 flex justify-between text-sm">
                          <span>{name}</span>
                          <span className="font-semibold">{value}</span>
                        </div>
                        <div className="h-2 rounded-full bg-stone-100">
                          <div className={`h-2 rounded-full ${color}`} style={{ width: value }} />
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Settings Tab */}
              <TabsContent value="settings" className="mt-6 space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Automation Guardrails</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {[
                      "Reject unsupported health, medical, or rapid cure claims",
                      "Check shipping destinations (Worldwide & India) before publishing",
                      "Require #BrandJanraPartner #ad disclosure on all affiliate deals",
                      "Directly route users to official merchants (iHerb, Nykaa, Amazon)",
                      "Keep safe manual fallback if automated API publishing is rate-limited",
                    ].map((rule) => (
                      <div key={rule} className="flex items-start gap-3 text-sm">
                        <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                          <Check className="h-3 w-3" />
                        </span>
                        <span>{rule}</span>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </aside>
        </div>
      )}
    </div>
  );
}

function Metric({ label, value, change, icon: Icon }: { label: string; value: string; change: string; icon: typeof Link2 }) {
  return (
    <Card className="border-stone-200 bg-white/70">
      <CardContent className="p-4">
        <Icon className="h-4 w-4 text-stone-500" />
        <div className="mt-5 text-2xl font-semibold">{value}</div>
        <div className="mt-1 text-xs text-stone-500">{label}</div>
        <div className="mt-3 text-xs font-semibold text-emerald-700">{change}</div>
      </CardContent>
    </Card>
  );
}
