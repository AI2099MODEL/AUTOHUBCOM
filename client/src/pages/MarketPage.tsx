import { ArrowUpRight, ChevronRight, Loader2 } from "lucide-react";
import { Link, useRoute } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";

type AffiliateProduct = {
  id: string; trackingToken: string; network: string; title: string; description: string;
  price: string; currency: string; advertiserName: string; clickUrl: string; imageUrl: string;
  syncedAt: string; marketHint: string;
};

type Market = "all" | "usa" | "canada" | "india" | "uk";
const marketConfig: Record<Market, { label: string; currency: string; patterns: RegExp[] }> = {
  all: { label: "Global catalog", currency: "", patterns: [] },
  usa: { label: "USA", currency: "USD", patterns: [/\bus\b|usa|united states|\.com\b|usd|\$/i] },
  canada: { label: "Canada", currency: "CAD", patterns: [/canada|\bca\b|\.ca\b|cad|canadian/i] },
  india: { label: "India", currency: "INR", patterns: [/india|\bin\b|\.in\b|inr|₹|indian/i] },
  uk: { label: "UK", currency: "GBP", patterns: [/\buk\b|united kingdom|\.co\.uk\b|gbp|£|british/i] },
};

const regions: Array<{ path: string; market: Market; label: string }> = [
  { path: "/usa", market: "usa", label: "USA" },
  { path: "/canada", market: "canada", label: "Canada" },
  { path: "/india", market: "india", label: "India" },
  { path: "/uk", market: "uk", label: "UK" },
];

function matchesMarket(product: AffiliateProduct, market: Market) {
  if (market === "all") return true;
  const config = marketConfig[market];
  const hint = `${product.marketHint} ${product.currency} ${product.clickUrl}`.toLowerCase();
  return product.currency?.toUpperCase() === config.currency || config.patterns.some((pattern) => pattern.test(hint));
}

function ProductCard({ product }: { product: AffiliateProduct }) {
  return <Card className="overflow-hidden border-stone-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
    <Link href={`/product/${encodeURIComponent(product.trackingToken)}`} className="block">
      <div className="relative h-32 overflow-hidden bg-stone-100 sm:h-36">
        {product.imageUrl ? <img src={product.imageUrl} alt={product.title} className="h-full w-full object-cover" loading="lazy" onError={(event) => { event.currentTarget.style.display = "none"; }} /> : <div className="flex h-full items-center justify-center px-5 text-center text-xs text-stone-500">Product image unavailable</div>}
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-stone-950/70 to-transparent px-3 pb-2 pt-8"><span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-white">{product.network === "cj" ? "CJ selection" : "Awin selection"}</span></div>
      </div>
    </Link>
    <CardContent className="p-3.5">
      <div className="flex items-start justify-between gap-2"><div className="min-w-0"><p className="truncate text-[10px] uppercase tracking-[0.14em] text-stone-500">{product.advertiserName}</p><Link href={`/product/${encodeURIComponent(product.trackingToken)}`} className="mt-1 block text-sm font-semibold leading-5 hover:underline">{product.title}</Link></div>{product.price && <p className="shrink-0 text-xs font-semibold">{product.currency ? `${product.currency} ` : ""}{product.price}</p>}</div>
      <p className="mt-2 line-clamp-2 text-xs leading-5 text-stone-600">{product.description || "Product details available from the seller."}</p>
      <Link href={`/product/${encodeURIComponent(product.trackingToken)}`} className="mt-3 flex items-center text-xs font-semibold text-stone-800">View details <ChevronRight className="ml-auto h-3.5 w-3.5" /></Link>
    </CardContent>
  </Card>;
}

export function MarketPage({ market = "all" }: { market?: Market }) {
  const productsQuery = trpc.catalog.affiliateProducts.useQuery();
  const products = ((productsQuery.data || []) as AffiliateProduct[]).filter((product) => matchesMarket(product, market));
  const config = marketConfig[market];
  return <div className="min-h-screen bg-[#f6f3ed] text-stone-950">
    <header className="border-b border-stone-200/80 bg-[#f6f3ed]/95"><div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-5 py-3 lg:px-10"><Link href="/" className="font-display text-xl font-semibold tracking-tight">Brand Janra</Link><nav className="flex flex-wrap gap-3 text-xs text-stone-600" aria-label="Markets"><Link href="/" className="hover:text-stone-950">All</Link>{regions.map((region) => <Link key={region.path} href={region.path} className={market === region.market ? "font-semibold text-stone-950" : "hover:text-stone-950"}>{region.label}</Link>)}</nav></div></header>
    <main className="mx-auto max-w-7xl px-5 pb-20 pt-7 lg:px-10"><div className="mb-7 flex flex-wrap items-end justify-between gap-4"><div><p className="text-[10px] font-bold uppercase tracking-[0.24em] text-stone-500">{market === "all" ? "Thoughtful discoveries" : `${config.label} selections`}</p><h1 className="mt-1 font-display text-3xl leading-tight sm:text-4xl">{config.label}</h1><p className="mt-2 max-w-2xl text-sm text-stone-600">Compact product picks with current seller information, pricing when supplied, and checkout on the seller’s site.</p></div><span className="rounded-full bg-white px-3 py-1.5 text-xs text-stone-600 shadow-sm">{products.length} selections</span></div>
      {productsQuery.isLoading && <div className="flex items-center gap-2 py-16 text-sm text-stone-500"><Loader2 className="h-4 w-4 animate-spin" /> Loading live catalog…</div>}
      {!productsQuery.isLoading && products.length === 0 && <div className="rounded-2xl border border-dashed border-stone-300 bg-white px-6 py-12 text-center"><p className="font-semibold">No matching selections yet</p><p className="mt-2 text-sm text-stone-600">Try another market or return to the global catalog.</p></div>}
      {products.length > 0 && <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{products.map((product) => <ProductCard key={`${product.network}-${product.trackingToken}`} product={product} />)}</div>}
    </main>
  </div>;
}

export function ProductDetailsPage() {
  const [, params] = useRoute<{ token: string }>("/product/:token");
  const token = params?.token ? decodeURIComponent(params.token) : "";
  const detailsQuery = trpc.catalog.productDetails.useQuery({ token }, { enabled: Boolean(token) });
  const detail = detailsQuery.data;
  return <div className="min-h-screen bg-[#f6f3ed] text-stone-950"><header className="border-b border-stone-200/80 bg-[#f6f3ed]/95"><div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3 lg:px-10"><Link href="/" className="font-display text-xl font-semibold">Brand Janra</Link><Link href="/" className="text-xs text-stone-600 hover:text-stone-950">Back to catalog</Link></div></header><main className="mx-auto max-w-5xl px-5 py-10 lg:px-10">{detailsQuery.isLoading && <div className="flex items-center gap-2 text-sm text-stone-500"><Loader2 className="h-4 w-4 animate-spin" /> Fetching current seller details…</div>}{detailsQuery.error && <div className="rounded-2xl bg-white p-8 text-sm text-stone-600">This product detail is currently unavailable.</div>}{detail && <div className="grid gap-8 rounded-3xl bg-white p-5 shadow-sm sm:p-8 md:grid-cols-[0.9fr_1.1fr]"><div className="overflow-hidden rounded-2xl bg-stone-100"><img src={detail.imageUrl || "/manus-storage/Logo_294c6d62.png"} alt={detail.title} className="aspect-square h-full w-full object-contain" /></div><div className="flex flex-col justify-center"><p className="text-[10px] font-bold uppercase tracking-[0.22em] text-stone-500">{detail.sellerBrand || detail.source}</p><h1 className="mt-2 font-display text-3xl leading-tight sm:text-4xl">{detail.title}</h1><p className="mt-4 text-sm leading-7 text-stone-600">{detail.description || "The seller page did not provide additional description text."}</p><div className="mt-6 flex items-center gap-3"><p className="text-lg font-semibold">{detail.price ? `${detail.currency} ${detail.price}` : "Price shown by seller"}</p><span className="rounded-full bg-stone-100 px-3 py-1 text-xs text-stone-600">{detail.availability.replaceAll("_", " ")}</span></div><a href={`/go/${encodeURIComponent(detail.token)}`} className="mt-7"><Button className="w-full bg-stone-950 text-white hover:bg-stone-800">Continue to seller checkout <ArrowUpRight className="ml-auto h-4 w-4" /></Button></a><p className="mt-3 text-xs leading-5 text-stone-500">Checkout, payment, shipping, and final order confirmation are completed securely on the seller’s website.</p>{detail.fetchedFromSellerPage && <p className="mt-2 text-xs text-stone-500">Details refreshed from the seller page.</p>}</div></div>}</main></div>;
}
