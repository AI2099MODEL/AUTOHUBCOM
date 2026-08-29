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

  return (
    <Card className="group flex flex-col justify-between overflow-hidden border-stone-200/80 bg-white/90 shadow-[0_18px_60px_rgba(40,31,20,0.06)] backdrop-blur transition duration-200 hover:-translate-y-1 hover:shadow-[0_24px_70px_rgba(40,31,20,0.12)]">
      <div>
        <div className={`relative flex h-48 flex-col justify-between bg-gradient-to-br ${product.accent} p-5`}>
          <div className="flex items-center justify-between">
            <span className="rounded-full bg-white/85 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-stone-800 shadow-sm backdrop-blur">
              {product.category}
            </span>
            <span className="rounded-full bg-stone-950/80 px-2.5 py-0.5 text-[10px] font-medium text-amber-200">
              {product.brand}
            </span>
          </div>
          <div>
            <span className="inline-flex items-center gap-1 rounded-md bg-white/90 px-2 py-0.5 text-[11px] font-semibold text-stone-900 shadow-xs">
              <Store className="h-3 w-3 text-stone-600" />
              {product.storeName}
            </span>
          </div>
        </div>

        <CardContent className="p-5">
          <div className="mb-2 flex items-center justify-between gap-2">
            <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100 font-medium text-[11px]">
              {product.tag}
            </Badge>
            <span className="text-base font-bold text-stone-950">{formattedPrice}</span>
          </div>

          <h3 className="text-base font-semibold leading-snug tracking-tight text-stone-950 group-hover:text-amber-950">
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
  const [selectedStudioProduct, setSelectedStudioProduct] = useState<HealthBeautyItem>(HEALTH_BEAUTY_CATALOG[0]);

  const filteredProducts = useMemo(() => {
    return categoryFilter === "all"
      ? HEALTH_BEAUTY_CATALOG
      : HEALTH_BEAUTY_CATALOG.filter((p) => p.category === categoryFilter);
  }, [categoryFilter]);

  const openProduct = (product: HealthBeautyItem) => setLocation(`/product/${product.slug}`);

  const handleAutoPublishAll = () => {
    toast.success("Auto-Publishing Health & Beauty Catalog to Meta", {
      description: `Queued 6 items with FTC disclosure for Brand Janra (Facebook Page 1185676227972117 & Instagram @brandjanra)`,
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
                  <div className="text-xl font-bold sm:text-2xl">6 Picks</div>
                  <div className="mt-1 text-[10px] uppercase tracking-widest text-stone-500">Live Deals</div>
                </div>
                <div>
                  <div className="text-xl font-bold sm:text-2xl">5 Stores</div>
                  <div className="mt-1 text-[10px] uppercase tracking-widest text-stone-500">Global &amp; India</div>
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
        <section id="stores" className="border-y border-stone-200/80 bg-white/60 px-5 py-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <p className="text-center text-xs font-bold uppercase tracking-[0.2em] text-stone-500">
              Curated Across Verified Affiliate Merchants
            </p>
            <div className="mt-5 flex flex-wrap items-center justify-center gap-6 text-xs font-semibold text-stone-700 sm:gap-10">
              <span className="flex items-center gap-2 rounded-full border border-stone-200 bg-white px-3.5 py-1.5 shadow-xs">
                🌿 iHerb (150+ Countries · Free &gt; $40)
              </span>
              <span className="flex items-center gap-2 rounded-full border border-stone-200 bg-white px-3.5 py-1.5 shadow-xs">
                💄 Nykaa (India Express · Free &gt; ₹499)
              </span>
              <span className="flex items-center gap-2 rounded-full border border-stone-200 bg-white px-3.5 py-1.5 shadow-xs">
                📦 Amazon Global &amp; Amazon India
              </span>
              <span className="flex items-center gap-2 rounded-full border border-stone-200 bg-white px-3.5 py-1.5 shadow-xs">
                ✨ Sephora &amp; LookFantastic
              </span>
            </div>
          </div>
        </section>

        {/* Recommended Deals Section */}
        <section className="border-b border-stone-200/80 bg-stone-900 px-5 py-14 text-white lg:px-8 lg:py-18">
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
              <div>
                <span className="inline-flex items-center gap-2 rounded-full bg-rose-500/20 px-3 py-1 text-xs font-bold uppercase tracking-widest text-rose-300">
                  <Sparkles className="h-3.5 w-3.5" /> High-Discount Recommended Deals
                </span>
                <h2 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl">
                  Curated Partner Deals (Up to 26% OFF)
                </h2>
                <p className="mt-2 text-sm text-stone-400">
                  Live trending offers from Tira Beauty, Foxtale, Tata 1mg, Purplle, Myntra, and iHerb.
                </p>
              </div>
            </div>

            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {RECOMMENDED_DEALS_POOL.map((deal) => (
                <div
                  key={deal.id}
                  className="group relative flex flex-col justify-between rounded-2xl border border-stone-800 bg-stone-950 p-5 transition-all hover:border-amber-400/40 hover:shadow-xl"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="rounded-md bg-amber-400/10 px-2.5 py-1 text-[11px] font-bold text-amber-300">
                        {deal.storeName}
                      </span>
                      <span className="rounded-full bg-rose-500 px-2.5 py-0.5 text-xs font-extrabold text-white">
                        {deal.discountPercent}% OFF
                      </span>
                    </div>

                    <h3 className="mt-3 text-base font-bold leading-snug text-stone-100 group-hover:text-amber-200">
                      {deal.name}
                    </h3>
                    <p className="mt-1 text-xs font-medium text-stone-400">
                      By {deal.brand} · {deal.category}
                    </p>

                    <p className="mt-3 text-xs leading-relaxed text-stone-400">
                      {deal.keyBenefit}
                    </p>
                  </div>

                  <div className="mt-5 border-t border-stone-800/80 pt-4">
                    <div className="flex items-baseline justify-between">
                      <div>
                        <span className="text-lg font-extrabold text-white">
                          {currency === "USD" ? `$${deal.dealPriceUsd.toFixed(2)}` : `₹${deal.dealPriceInr.toLocaleString()}`}
                        </span>
                        <span className="ml-2 text-xs text-stone-500 line-through">
                          {currency === "USD" ? `$${deal.originalPriceUsd.toFixed(2)}` : `₹${deal.originalPriceInr.toLocaleString()}`}
                        </span>
                      </div>
                      <span className="text-[11px] text-emerald-400">
                        ★ {deal.rating} ({deal.reviewsCount.toLocaleString()})
                      </span>
                    </div>

                    <a
                      href={deal.affiliateUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-amber-300 py-2.5 text-xs font-bold text-stone-950 transition hover:bg-amber-200"
                    >
                      Shop Verified Deal <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  </div>
                </div>
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

            <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="mt-8">
              <TabsList className="grid w-full grid-cols-4 bg-stone-200/60">
                <TabsTrigger value="studio">Content studio</TabsTrigger>
                <TabsTrigger value="meta">Meta channels</TabsTrigger>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
                <TabsTrigger value="settings">Guardrails</TabsTrigger>
              </TabsList>

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
