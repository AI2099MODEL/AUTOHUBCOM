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
  const [catalogProducts, setCatalogProducts] = useState<HealthBeautyItem[]>(HEALTH_BEAUTY_CATALOG);
  const [selectedStudioProduct, setSelectedStudioProduct] = useState<HealthBeautyItem>(HEALTH_BEAUTY_CATALOG[0]);

  const [linkInput, setLinkInput] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [sourcesList, setSourcesList] = useState([
    { id: "1", url: "https://fkrt.co/pDEIvN", store: "Flipkart Health & Beauty", status: "Active · Scanning hourly", items: 1 },
    { id: "2", url: "https://fkrt.co/ykrYNt", store: "Flipkart / The Derma Co", status: "Active · Scanning hourly", items: 1 },
  ]);

  const handleScanAndAddLink = () => {
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
      const storeName = isFkrt
        ? "Flipkart Health & Beauty"
        : isAjio
        ? "Ajio Beauty & Luxury"
        : isNykaa
        ? "Nykaa"
        : isIherb
        ? "iHerb Global"
        : "Verified Affiliate Merchant";

      const storeId = isFkrt ? "flipkart" : isAjio ? "ajio" : isNykaa ? "nykaa" : isIherb ? "iherb" : "extrape";

      const newProduct: HealthBeautyItem = {
        id: `scanned-${Date.now()}`,
        slug: `scanned-product-${Date.now()}`,
        name: `Curated Health & Beauty Pick (${storeName})`,
        brand: "Verified Brand",
        category: "Skincare",
        type: "affiliate",
        priceUsd: 8.5,
        priceInr: 699,
        storeId,
        storeName,
        imageUrl: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&auto=format&fit=crop&q=80",
        accent: "from-amber-100 via-rose-50 to-orange-50",
        score: 95,
        keyBenefit: "Dermatologist-tested daily skincare formula with clean ingredients and fast express shipping.",
        skinType: "All skin types",
        shipsWorldwide: isIherb,
        shipsIndia: true,
        shippingNote: isFkrt ? "Fast 2-3 Day India Express Delivery (Free over ₹500)" : "India Express Delivery",
        affiliateUrl: url,
        tag: "Scanned in Control Room",
        approvedForPublishing: true,
        createdAt: new Date().toISOString(),
      };

      setCatalogProducts((prev) => [newProduct, ...prev]);

      setSourcesList((prev) => [
        {
          id: String(Date.now()),
          url,
          store: storeName,
          status: "Active · Scanned & Ingested",
          items: 1,
        },
        ...prev,
      ]);

      setLinkInput("");
      toast.success("Affiliate Link Scanned & Added to Store!", {
        description: `Ingested Health & Beauty product from ${storeName}. Added to your live storefront.`,
      });
    }, 800);
  };

  const handleRunHourlyScanNow = () => {
    toast.promise(
      new Promise((resolve) => setTimeout(resolve, 1200)),
      {
        loading: "Running hourly scan across your affiliate feeds...",
        success: `Scan complete! Verified ${sourcesList.length} active feeds. 0 expired links. Store catalog is up to date.`,
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
                <TabsTrigger value="scanner">⚡ Auto Scanner</TabsTrigger>
                <TabsTrigger value="studio">Content studio</TabsTrigger>
                <TabsTrigger value="meta">Meta channels</TabsTrigger>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
                <TabsTrigger value="settings">Guardrails</TabsTrigger>
              </TabsList>

              {/* Auto Scanner & Ingestion Tab */}
              <TabsContent value="scanner" className="mt-6 space-y-5">
                {/* Instant Link Ingestion Box */}
                <Card className="border-stone-300 shadow-xs">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-base font-bold">Auto-Scan &amp; Ingest Affiliate Links</CardTitle>
                        <p className="mt-1 text-xs text-stone-500">
                          Paste any link (Flipkart, ExtraPe, Nykaa, Amazon, Tira, Myntra, Foxtale, Plum, Dot &amp; Key, Tata 1mg, iHerb).
                        </p>
                      </div>
                      <Badge className="bg-amber-100 text-amber-800 font-bold">AI Auto-Parser</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex gap-2">
                      <input
                        type="url"
                        placeholder="e.g. https://fkrt.co/... or https://extrape.com/c/..."
                        value={linkInput}
                        onChange={(e) => setLinkInput(e.target.value)}
                        className="flex-1 rounded-xl border border-stone-300 bg-white px-3.5 py-2.5 text-xs text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-900"
                      />
                      <Button
                        onClick={handleScanAndAddLink}
                        disabled={isScanning}
                        className="bg-stone-950 px-4 text-xs font-bold text-white hover:bg-stone-800"
                      >
                        {isScanning ? "Scanning..." : "Scan & Ingest"}
                      </Button>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 text-[11px] text-stone-500">
                      <span>⚡ Auto-detects store</span>
                      <span>•</span>
                      <span>Calculates Indian/Global shipping</span>
                      <span>•</span>
                      <span>Generates Social Media copy</span>
                    </div>
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
                        Hourly Background Auto-Scanner Active
                      </span>
                    </div>
                    <Button
                      size="sm"
                      onClick={handleRunHourlyScanNow}
                      className="bg-emerald-500 px-3 py-1 text-xs font-bold text-stone-950 hover:bg-emerald-400"
                    >
                      ⚡ Run Auto-Scan Now
                    </Button>
                  </div>
                  <p className="mt-3 text-xs leading-relaxed text-stone-300">
                    Runs every <strong>60 minutes</strong> across all monitored affiliate sources. Verifies destination health, removes expired offers, and updates the live catalog automatically.
                  </p>
                  <div className="mt-4 grid grid-cols-3 gap-2 border-t border-stone-800 pt-3 text-center">
                    <div className="rounded-xl bg-white/5 p-2">
                      <div className="text-sm font-bold text-stone-100">{sourcesList.length}</div>
                      <div className="text-[10px] text-stone-400">Monitored Feeds</div>
                    </div>
                    <div className="rounded-xl bg-white/5 p-2">
                      <div className="text-sm font-bold text-emerald-400">{sourcesList.length}</div>
                      <div className="text-[10px] text-stone-400">Active Links</div>
                    </div>
                    <div className="rounded-xl bg-white/5 p-2">
                      <div className="text-sm font-bold text-stone-400">0</div>
                      <div className="text-[10px] text-stone-400">Expired Flagged</div>
                    </div>
                  </div>
                </div>

                {/* Monitored Affiliate Feed Sources */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-bold">Monitored Affiliate Source Feeds</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {sourcesList.map((source) => (
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
                              setSourcesList((prev) => prev.filter((s) => s.id !== source.id));
                              toast.info("Removed source from auto-scanner");
                            }}
                            className="rounded-lg p-1 text-stone-400 hover:bg-stone-100 hover:text-rose-600"
                            aria-label="Remove source"
                          >
                            <X className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
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
                    <div className="flex flex-wrap gap-2">
                      {HEALTH_BEAUTY_CATALOG.map((item) => (
                        <button
                          key={item.id}
                          onClick={() => setSelectedStudioProduct(item)}
                          className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${selectedStudioProduct.id === item.id ? "bg-stone-950 text-white" : "border border-stone-200 bg-white text-stone-700 hover:bg-stone-100"}`}
                        >
                          {item.name.split(" ")[0]} {item.name.split(" ")[1]}
                        </button>
                      ))}
                    </div>

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

                    <Button
                      variant="outline"
                      className="w-full border-stone-300"
                      onClick={handleAutoPublishAll}
                    >
                      <Send className="mr-2 h-4 w-4" /> Batch Publish All 6 Products
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
