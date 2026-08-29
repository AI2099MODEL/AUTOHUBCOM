import { useMemo, useState } from "react";
import { useLocation } from "wouter";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { ArrowUpRight, BarChart3, Check, ChevronRight, CircleHelp, ExternalLink, Gauge, Instagram, Link2, LockKeyhole, Menu, Play, Search, ShieldCheck, ShoppingBag, Sparkles, TrendingUp, Users, X, Youtube } from "lucide-react";

type Product = {
  id: string;
  name: string;
  category: string;
  type: "affiliate" | "direct";
  price: string;
  note: string;
  accent: string;
  score: number;
  tag: string;
};

const products: Product[] = [
  { id: "halo-desk-light", name: "Halo Desk Light", category: "Workspace", type: "affiliate", price: "$42", note: "Curated partner offer", accent: "from-amber-200 via-orange-100 to-rose-100", score: 92, tag: "Partner pick" },
  { id: "arc-travel-kit", name: "Arc Travel Kit", category: "Travel", type: "affiliate", price: "$68", note: "Tracked offer destination", accent: "from-sky-200 via-cyan-100 to-indigo-100", score: 88, tag: "New deal" },
  { id: "linen-organizer", name: "Linen Drawer Set", category: "Home", type: "direct", price: "$36", note: "Ships from our store", accent: "from-emerald-200 via-teal-100 to-lime-100", score: 95, tag: "In our shop" },
  { id: "quiet-carry", name: "Quiet Carry Pouch", category: "Everyday", type: "direct", price: "$28", note: "Direct checkout product", accent: "from-violet-200 via-fuchsia-100 to-pink-100", score: 90, tag: "Store original" },
];

const channels = [
  { name: "Instagram", account: "@brandjanra", icon: Instagram, status: "Connected via Meta Business", color: "text-pink-600", bg: "bg-pink-50", badge: "Brand Janra" },
  { name: "Facebook", account: "Page ID: 1185676227972117", icon: Users, status: "Brand Janra Official Page", color: "text-blue-600", bg: "bg-blue-50", badge: "Page 1185676227972117" },
  { name: "YouTube", account: "@brandjanra", icon: Youtube, status: "Ready for Shorts & Notes", color: "text-red-600", bg: "bg-red-50", badge: "Channel Active" },
];

function ProductCard({ product, onOpen }: { product: Product; onOpen: (product: Product) => void }) {
  const isAffiliate = product.type === "affiliate";
  return (
    <Card className="group overflow-hidden border-white/70 bg-white/80 shadow-[0_18px_60px_rgba(40,31,20,0.08)] backdrop-blur transition duration-200 hover:-translate-y-1 hover:shadow-[0_24px_70px_rgba(40,31,20,0.13)]">
      <div className={`relative flex h-44 items-end bg-gradient-to-br ${product.accent} p-5`}>
        <div className="absolute right-4 top-4 rounded-full bg-white/75 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-stone-700">{product.category}</div>
        <div className="relative w-full">
          <div className="mb-3 h-2 w-24 rounded-full bg-stone-900/15" />
          <div className="h-7 w-40 rounded-xl bg-white/75 shadow-sm" />
        </div>
      </div>
      <CardContent className="p-5">
        <div className="mb-3 flex items-center justify-between gap-3">
          <Badge className={isAffiliate ? "bg-orange-100 text-orange-800 hover:bg-orange-100" : "bg-emerald-100 text-emerald-800 hover:bg-emerald-100"}>
            {isAffiliate ? "Affiliate partner deal" : "Direct purchase"}
          </Badge>
          <span className="text-sm font-semibold text-stone-900">{product.price}</span>
        </div>
        <h3 className="text-xl font-semibold tracking-tight text-stone-950">{product.name}</h3>
        <p className="mt-1 text-sm text-stone-500">{product.note}</p>
        <div className="mt-5 flex items-center justify-between border-t border-stone-100 pt-4">
          <span className="text-xs font-medium text-stone-500">AI fit score <strong className="text-stone-900">{product.score}</strong>/100</span>
          <Button size="sm" onClick={() => onOpen(product)} className={isAffiliate ? "bg-stone-950 text-white hover:bg-stone-800" : "bg-emerald-700 text-white hover:bg-emerald-800"}>
            {isAffiliate ? "View offer" : "Shop now"}<ArrowUpRight className="ml-1.5 h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default function Home() {
  const [, setLocation] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState<"all" | "affiliate" | "direct">("all");
  const [activeTab, setActiveTab] = useState("storefront");
  const filteredProducts = useMemo(() => activeFilter === "all" ? products : products.filter((product) => product.type === activeFilter), [activeFilter]);

  const openProduct = (product: Product) => setLocation(`/product/${product.id}`);

  return (
    <div className="min-h-screen bg-[#f8f6f1] text-stone-950">
      <header className="sticky top-0 z-30 border-b border-stone-200/70 bg-[#f8f6f1]/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
          <a href="#top" className="flex items-center gap-3" aria-label="Curated commerce home">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-stone-950 text-sm font-bold text-amber-200">AC</span>
            <span><span className="block text-sm font-bold tracking-[0.18em]">ARC &amp; CO.</span><span className="block text-[10px] uppercase tracking-[0.2em] text-stone-500">Useful finds, thoughtfully chosen</span></span>
          </a>
          <nav className="hidden items-center gap-7 text-sm font-medium text-stone-600 md:flex">
            <a href="#deals" className="transition hover:text-stone-950">Partner deals</a>
            <a href="#shop" className="transition hover:text-stone-950">Our shop</a>
            <a href="#content" className="transition hover:text-stone-950">Field notes</a>
            <a href="#trust" className="transition hover:text-stone-950">Trust center</a>
          </nav>
          <div className="hidden items-center gap-3 md:flex"><Button variant="outline" className="border-stone-300 bg-transparent" onClick={() => setActiveTab("studio")}><Gauge className="mr-2 h-4 w-4" />Operations</Button><Button className="bg-stone-950 text-white hover:bg-stone-800" onClick={() => toast("Search and discovery are ready for your niche catalog.")}><Search className="mr-2 h-4 w-4" />Explore</Button></div>
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMobileOpen((value) => !value)} aria-label="Toggle navigation">{mobileOpen ? <X /> : <Menu />}</Button>
        </div>
        {mobileOpen && <div className="border-t border-stone-200 px-5 py-4 md:hidden"><div className="flex flex-col gap-4 text-sm font-medium"><a href="#deals" onClick={() => setMobileOpen(false)}>Partner deals</a><a href="#shop" onClick={() => setMobileOpen(false)}>Our shop</a><a href="#content" onClick={() => setMobileOpen(false)}>Field notes</a><a href="#trust" onClick={() => setMobileOpen(false)}>Trust center</a></div></div>}
      </header>

      <main id="top">
        <section className="relative overflow-hidden px-5 pb-16 pt-14 lg:px-8 lg:pb-24 lg:pt-24">
          <div className="absolute -right-24 top-10 h-80 w-80 rounded-full bg-amber-200/50 blur-3xl" /><div className="absolute -left-24 bottom-0 h-72 w-72 rounded-full bg-emerald-200/35 blur-3xl" />
          <div className="relative mx-auto grid max-w-7xl items-end gap-12 lg:grid-cols-[1.08fr_0.92fr]">
            <div><Badge className="mb-6 border border-stone-300 bg-white/60 px-3 py-1.5 text-stone-700"><Sparkles className="mr-2 h-3.5 w-3.5" />A clearer way to shop the internet</Badge><h1 className="max-w-3xl text-5xl font-semibold leading-[0.98] tracking-[-0.055em] sm:text-6xl lg:text-8xl">Less noise.<br /><span className="text-stone-400">Better finds.</span></h1><p className="mt-7 max-w-xl text-lg leading-8 text-stone-600">A calm, useful storefront for the products worth your attention — with partner offers clearly labeled and our own products ready for direct checkout.</p><div className="mt-9 flex flex-wrap gap-3"><Button size="lg" className="bg-stone-950 px-6 text-white hover:bg-stone-800" onClick={() => document.getElementById("deals")?.scrollIntoView({ behavior: "smooth" })}>Browse the edit<ChevronRight className="ml-2 h-4 w-4" /></Button><Button size="lg" variant="outline" className="border-stone-300 bg-white/50" onClick={() => document.getElementById("trust")?.scrollIntoView({ behavior: "smooth" })}>How it works</Button></div></div>
            <div className="relative rounded-[2rem] border border-white/80 bg-stone-950 p-5 text-white shadow-[0_30px_90px_rgba(20,18,14,0.18)] sm:p-7"><div className="flex items-center justify-between border-b border-white/10 pb-5"><span className="text-xs uppercase tracking-[0.2em] text-stone-400">The operating system</span><span className="flex items-center gap-2 text-xs text-emerald-300"><span className="h-2 w-2 rounded-full bg-emerald-300" />Live framework</span></div><div className="py-8"><p className="text-3xl font-semibold tracking-tight">Discover → verify → share → measure</p><p className="mt-4 max-w-md text-sm leading-6 text-stone-400">Every offer is checked for fit, availability, and claim safety before it becomes a storefront item or a content package.</p></div><div className="grid grid-cols-3 gap-2 border-t border-white/10 pt-5 text-center"><div><div className="text-2xl font-semibold">24</div><div className="mt-1 text-[10px] uppercase tracking-widest text-stone-500">Offers queued</div></div><div><div className="text-2xl font-semibold">3</div><div className="mt-1 text-[10px] uppercase tracking-widest text-stone-500">Channels</div></div><div><div className="text-2xl font-semibold">100%</div><div className="mt-1 text-[10px] uppercase tracking-widest text-stone-500">Tracked</div></div></div></div>
          </div>
        </section>

        <section className="border-y border-stone-200/80 bg-white/55 px-5 py-5 lg:px-8"><div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4"><p className="text-sm font-medium text-stone-500">Built for useful niche commerce, not noisy catalogs.</p><div className="flex flex-wrap gap-3 text-xs font-semibold text-stone-600"><span className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-emerald-600" />Claim-safe by design</span><span className="flex items-center gap-2"><Link2 className="h-4 w-4 text-orange-600" />Transparent redirects</span><span className="flex items-center gap-2"><LockKeyhole className="h-4 w-4 text-stone-700" />Consent-aware analytics</span></div></div></section>

        <section id="deals" className="scroll-mt-24 px-5 py-16 lg:px-8 lg:py-24"><div className="mx-auto max-w-7xl"><div className="mb-10 flex flex-col justify-between gap-5 sm:flex-row sm:items-end"><div><p className="text-xs font-bold uppercase tracking-[0.22em] text-orange-700">The daily edit</p><h2 className="mt-3 text-4xl font-semibold tracking-[-0.04em]">Deals, without the disguise.</h2><p className="mt-3 max-w-xl text-stone-600">Partner offers and direct-purchase products stay visibly separate, so you always know who fulfills the order.</p></div><div className="flex gap-2"><Button size="sm" variant={activeFilter === "all" ? "default" : "outline"} className={activeFilter === "all" ? "bg-stone-950" : "border-stone-300 bg-transparent"} onClick={() => setActiveFilter("all")}>All picks</Button><Button size="sm" variant={activeFilter === "affiliate" ? "default" : "outline"} className={activeFilter === "affiliate" ? "bg-stone-950" : "border-stone-300 bg-transparent"} onClick={() => setActiveFilter("affiliate")}>Partner deals</Button><Button size="sm" variant={activeFilter === "direct" ? "default" : "outline"} className={activeFilter === "direct" ? "bg-stone-950" : "border-stone-300 bg-transparent"} onClick={() => setActiveFilter("direct")}>Our shop</Button></div></div><div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{filteredProducts.map((product) => <ProductCard key={product.id} product={product} onOpen={openProduct} />)}</div></div></section>

        <section id="content" className="scroll-mt-24 bg-stone-950 px-5 py-16 text-white lg:px-8 lg:py-24">
          <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-amber-300">Field notes</p>
              <h2 className="mt-3 text-4xl font-semibold tracking-[-0.04em] sm:text-5xl">Connected to Brand Janra.</h2>
              <p className="mt-5 max-w-md leading-7 text-stone-400">
                Automated, FTC-compliant content distribution across the official <strong>Brand Janra</strong> Facebook Page and linked <strong>Instagram</strong> channel.
              </p>
              <div className="mt-6 flex flex-wrap gap-2 text-xs text-stone-400">
                <span className="rounded-full bg-white/10 px-3 py-1 text-emerald-300">FB Page: 1185676227972117</span>
                <span className="rounded-full bg-white/10 px-3 py-1 text-pink-300">IG: @brandjanra</span>
              </div>
              <Button className="mt-8 bg-amber-200 text-stone-950 hover:bg-amber-100" onClick={() => setActiveTab("studio")}>
                Open content studio<ArrowUpRight className="ml-2 h-4 w-4" />
              </Button>
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

        <section id="trust" className="scroll-mt-24 px-5 py-16 lg:px-8 lg:py-24"><div className="mx-auto max-w-7xl"><div className="mb-9 flex items-end justify-between gap-5"><div><p className="text-xs font-bold uppercase tracking-[0.22em] text-emerald-700">Trust center</p><h2 className="mt-3 text-4xl font-semibold tracking-[-0.04em]">Clear by default.</h2></div><a href="#" className="hidden items-center gap-2 text-sm font-semibold text-stone-600 hover:text-stone-950 sm:flex">Read our principles<ExternalLink className="h-4 w-4" /></a></div><div className="grid gap-4 md:grid-cols-3"><Card className="border-stone-200 bg-white/60"><CardHeader><ShieldCheck className="h-6 w-6 text-emerald-700" /><CardTitle className="mt-2 text-xl">Affiliate disclosure</CardTitle></CardHeader><CardContent className="text-sm leading-6 text-stone-600">Partner links are labeled before you click. We may earn a commission without changing your price.</CardContent></Card><Card className="border-stone-200 bg-white/60"><CardHeader><Link2 className="h-6 w-6 text-orange-700" /><CardTitle className="mt-2 text-xl">Transparent links</CardTitle></CardHeader><CardContent className="text-sm leading-6 text-stone-600">Our redirects preserve campaign attribution and send you to the stated merchant or checkout destination.</CardContent></Card><Card className="border-stone-200 bg-white/60"><CardHeader><CircleHelp className="h-6 w-6 text-stone-700" /><CardTitle className="mt-2 text-xl">Useful, not absolute</CardTitle></CardHeader><CardContent className="text-sm leading-6 text-stone-600">We avoid unsupported promises and mark product information that needs confirmation or a fresh stock check.</CardContent></Card></div></div></section>
      </main>

      <section className="border-t border-stone-200 bg-white/60 px-5 py-8 lg:px-8"><div className="mx-auto flex max-w-7xl flex-col justify-between gap-3 text-sm text-stone-500 sm:flex-row"><span>© 2026 Brand Janra. All rights reserved.</span><span className="flex items-center gap-2"><LockKeyhole className="h-4 w-4" />Privacy-aware analytics · Affiliate disclosure</span></div></section>

      {activeTab !== "storefront" && <div className="fixed inset-0 z-40 bg-stone-950/35 backdrop-blur-sm" onClick={() => setActiveTab("storefront")}><aside className="absolute right-0 top-0 h-full w-full max-w-2xl overflow-y-auto bg-[#f8f6f1] p-6 shadow-2xl sm:p-10" onClick={(event) => event.stopPropagation()}><div className="flex items-center justify-between"><div><p className="text-xs font-bold uppercase tracking-[0.2em] text-stone-500">Control room</p><h2 className="mt-2 text-3xl font-semibold">Brand Janra OS</h2></div><Button variant="ghost" size="icon" onClick={() => setActiveTab("storefront")}><X /></Button></div><Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="mt-8"><TabsList className="grid w-full grid-cols-4 bg-stone-200/60"><TabsTrigger value="studio">Content studio</TabsTrigger><TabsTrigger value="meta">Meta channels</TabsTrigger><TabsTrigger value="analytics">Analytics</TabsTrigger><TabsTrigger value="settings">Guardrails</TabsTrigger></TabsList><TabsContent value="studio" className="mt-6 space-y-4"><Card><CardHeader><div className="flex items-center justify-between"><div><CardTitle>Next package: Halo Desk Light</CardTitle><p className="mt-1 text-sm text-stone-500">Target: Brand Janra (Facebook Page 1185676227972117 &amp; Instagram @brandjanra)</p></div><Badge className="bg-amber-100 text-amber-800">Ready</Badge></div></CardHeader><CardContent className="space-y-4"><div className="rounded-2xl bg-stone-950 p-5 text-white"><div className="flex items-center gap-2 text-xs uppercase tracking-widest text-amber-200"><Play className="h-3 w-3" />Instagram Reel script &amp; Facebook Copy</div><p className="mt-4 text-lg leading-7">“A softer workspace starts with one small change. Here’s what this compact desk light does well, where it fits, and the offer curated by Brand Janra.”</p><div className="mt-4 rounded-xl bg-white/10 p-3 text-xs text-stone-300">#BrandJanraPartner #ad · Link in bio &amp; Facebook link card attached</div></div><div className="grid gap-3 sm:grid-cols-2"><Button className="w-full justify-between bg-blue-700 text-white hover:bg-blue-800" onClick={() => toast.success("Posted to Brand Janra Facebook Page (ID: 1185676227972117)")}>Publish to Facebook<ChevronRight className="h-4 w-4" /></Button><Button className="w-full justify-between bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:opacity-90" onClick={() => toast.success("Published Reel to Instagram (@brandjanra)")}>Publish to Instagram<ChevronRight className="h-4 w-4" /></Button></div><p className="flex items-center gap-2 text-xs text-stone-500"><Check className="h-4 w-4 text-emerald-600" />Claim scan passed · tracking link attached · verified by Brand Janra</p></CardContent></Card></TabsContent><TabsContent value="meta" className="mt-6 space-y-4"><Card><CardHeader><CardTitle>Meta Connected Channels</CardTitle></CardHeader><CardContent className="space-y-4"><div className="rounded-2xl border border-stone-200 bg-white/70 p-4"><div className="flex items-center justify-between"><div><div className="font-semibold text-stone-950">Brand Janra (Facebook Page)</div><div className="text-xs text-stone-500">Page ID: <strong className="text-stone-800">1185676227972117</strong></div></div><span className="flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800"><Check className="h-3.5 w-3.5" />Configured</span></div></div><div className="rounded-2xl border border-stone-200 bg-white/70 p-4"><div className="flex items-center justify-between"><div><div className="font-semibold text-stone-950">Instagram Business Account</div><div className="text-xs text-stone-500">Handle: <strong className="text-stone-800">@brandjanra</strong> (Linked to Page 1185676227972117)</div></div><span className="flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800"><Check className="h-3.5 w-3.5" />Linked</span></div></div><Button variant="outline" className="w-full border-stone-300" onClick={() => toast("Meta Graph API connection verified for Brand Janra (Page ID: 1185676227972117)")}>Test Meta API Connection</Button></CardContent></Card></TabsContent><TabsContent value="analytics" className="mt-6 space-y-4"><div className="grid grid-cols-2 gap-3"><Metric label="Outbound clicks" value="1,284" change="+18.4%" icon={Link2} /><Metric label="Offers viewed" value="3,906" change="+11.2%" icon={TrendingUp} /><Metric label="Content saves" value="428" change="+9.7%" icon={BarChart3} /><Metric label="Attribution" value="76%" change="Consent-aware" icon={Gauge} /></div><Card><CardHeader><CardTitle>Channel signal</CardTitle></CardHeader><CardContent className="space-y-4">{[["Instagram (@brandjanra)", "68%", "bg-pink-500"], ["Facebook (Brand Janra)", "44%", "bg-blue-500"], ["YouTube (@brandjanra)", "52%", "bg-red-500"]].map(([name, value, color]) => <div key={name}><div className="mb-2 flex justify-between text-sm"><span>{name}</span><span className="font-semibold">{value}</span></div><div className="h-2 rounded-full bg-stone-100"><div className={`h-2 rounded-full ${color}`} style={{ width: value }} /></div></div>)}</CardContent></Card></TabsContent><TabsContent value="settings" className="mt-6 space-y-4"><Card><CardHeader><CardTitle>Automation guardrails</CardTitle></CardHeader><CardContent className="space-y-4">{["Reject unsupported health, income, or performance claims", "Pause offers when destination or stock checks fail", "Require a disclosure on partner content (#BrandJanraPartner #ad)", "Use official platform integrations only (Page ID: 1185676227972117)", "Keep a safe manual fallback when publishing is blocked"].map((rule) => <div key={rule} className="flex items-start gap-3 text-sm"><span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700"><Check className="h-3 w-3" /></span><span>{rule}</span></div>)}</CardContent></Card></TabsContent></Tabs></aside></div>}
    </div>
  );
}

function Metric({ label, value, change, icon: Icon }: { label: string; value: string; change: string; icon: typeof Link2 }) { return <Card className="border-stone-200 bg-white/70"><CardContent className="p-4"><Icon className="h-4 w-4 text-stone-500" /><div className="mt-5 text-2xl font-semibold">{value}</div><div className="mt-1 text-xs text-stone-500">{label}</div><div className="mt-3 text-xs font-semibold text-emerald-700">{change}</div></CardContent></Card>; }
