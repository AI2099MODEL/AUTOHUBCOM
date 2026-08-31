import { ArrowUpRight, ChevronRight } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";

type AffiliateProduct = {
  id: string;
  title: string;
  description: string;
  price: string;
  currency: string;
  advertiserName: string;
  clickUrl: string;
  imageUrl: string;
  syncedAt: string;
  trackingToken: string;
  network: string;
};

const socialProfiles = [
  { label: "Facebook", url: "https://www.facebook.com/profile.php?id=61593884283083" },
  { label: "Instagram", url: "https://www.instagram.com/brandjanra/" },
  { label: "YouTube handle", url: "https://www.youtube.com/@brandjanra" },
  { label: "YouTube channel", url: "https://www.youtube.com/channel/UCb_Bm4zZrEjTDmG7uU-eV2Q" },
];

export default function Home() {
  const affiliateProductsQuery = trpc.catalog.affiliateProducts.useQuery();
  const socialConnections = trpc.social.connections.useQuery();
  const products = (affiliateProductsQuery.data || []) as AffiliateProduct[];

  return (
    <div className="min-h-screen bg-[#f6f3ed] text-stone-950">
      <header className="sticky top-0 z-20 border-b border-stone-200/80 bg-[#f6f3ed]/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-10">
          <div className="flex items-center gap-3">
            <img src="/manus-storage/Logo_294c6d62.png" alt="Janra" className="h-11 w-11 rounded-full object-cover shadow-sm" />
            <div><p className="text-[10px] font-bold uppercase tracking-[0.28em] text-stone-500">Global health & beauty</p><h1 className="font-display text-2xl font-semibold tracking-tight">Brand Janra</h1></div>
          </div>
          <div className="flex flex-wrap items-center gap-3"><span className="text-sm text-stone-500">Official Storefront</span><nav className="flex gap-2 text-xs text-stone-600" aria-label="Markets"><Link href="/usa" className="hover:text-stone-950">USA</Link><Link href="/canada" className="hover:text-stone-950">Canada</Link><Link href="/india" className="hover:text-stone-950">India</Link><Link href="/uk" className="hover:text-stone-950">UK</Link></nav></div>
        </div>
      </header>

      <main>
        <section className="mx-auto max-w-7xl px-5 pb-6 pt-6 lg:px-10 lg:pt-8"><div className="rounded-[1.5rem] bg-stone-950 px-7 py-7 text-white shadow-xl sm:px-10 sm:py-9"><p className="text-[10px] font-bold uppercase tracking-[0.28em] text-amber-200">Janra showroom</p><h2 className="mt-2 max-w-3xl font-display text-4xl leading-[1] sm:text-6xl">Thoughtful discoveries for everyday rituals.</h2><p className="mt-4 max-w-xl text-sm leading-6 text-stone-300">Explore the latest beauty, wellness, and lifestyle selections.</p></div></section>
        <section className="mx-auto max-w-7xl px-5 pt-2 lg:px-10" aria-label="Brand Janra promotion">
          <div className="overflow-hidden rounded-[1.5rem] bg-stone-950 shadow-xl ring-1 ring-stone-900/10">
            <video className="h-[clamp(180px,28vw,360px)] w-full object-cover" controls muted autoPlay loop playsInline preload="metadata" aria-label="Brand Janra promotion video">
              <source src="/Main_PromotionVideo.mp4" type="video/mp4" />
              Your browser does not support the promotion video.
            </video>
          </div>
        </section>
        <section className="mx-auto max-w-7xl px-5 pb-24 pt-8 lg:px-10">
          <div className="mb-7"><p className="text-xs font-bold uppercase tracking-[0.22em] text-stone-500">Janra selections</p><h3 className="mt-2 font-display text-4xl">Curated catalog</h3></div>
          {affiliateProductsQuery.isLoading && <p className="py-12 text-sm text-stone-500">Loading products…</p>}
          {!affiliateProductsQuery.isLoading && products.length === 0 && <div className="rounded-2xl border border-dashed border-stone-300 bg-white px-7 py-12 text-center"><p className="font-semibold">No products yet</p><p className="mt-2 text-sm text-stone-600">New selections will appear here soon.</p></div>}
          {products.length > 0 && <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{products.map((product) => <Card key={`${product.advertiserName}-${product.id}`} className="overflow-hidden border-stone-200 bg-white shadow-sm"><Link href={`/product/${encodeURIComponent(product.trackingToken)}`} className="block"><div className="relative h-32 overflow-hidden bg-stone-100"><img src={product.imageUrl} alt={product.title} className="h-full w-full object-cover" loading="lazy" onError={(event) => { event.currentTarget.style.display = "none"; }} /><div className="absolute inset-0 bg-gradient-to-t from-stone-950/45 to-transparent" /><div className="absolute bottom-2 left-3"><span className="rounded-full bg-white/90 px-2 py-1 text-[10px] font-semibold text-stone-700">Featured selection</span></div></div></Link><CardContent className="p-3.5"><div className="flex items-start justify-between gap-2"><div className="min-w-0"><p className="truncate text-[10px] uppercase tracking-wider text-stone-500">{product.advertiserName}</p><Link href={`/product/${encodeURIComponent(product.trackingToken)}`}><h4 className="mt-1 line-clamp-2 text-sm font-semibold leading-5">{product.title}</h4></Link></div>{product.price && <p className="shrink-0 text-xs font-semibold">{product.currency ? `${product.currency} ` : ""}{product.price}</p>}</div><p className="mt-2 line-clamp-2 text-xs leading-5 text-stone-600">{product.description || "Product details available from the seller."}</p><Link href={`/product/${encodeURIComponent(product.trackingToken)}`} className="mt-3 flex items-center text-xs font-semibold">View details <ChevronRight className="ml-auto h-3.5 w-3.5" /></Link></CardContent></Card>)}</div>}
        </section>

      </main>

      <footer className="mx-auto max-w-7xl px-5 pb-16 lg:px-10"><div className="rounded-2xl bg-stone-950 p-6 text-white"><p className="text-xs font-bold uppercase tracking-[0.22em] text-amber-200">Brand Janra channels</p><div className="mt-4 flex flex-wrap gap-3">{socialProfiles.map((profile) => <a key={profile.url} href={profile.url} target="_blank" rel="noreferrer noopener" className="text-sm text-stone-300 hover:text-white">{profile.label} <ArrowUpRight className="ml-1 inline h-3 w-3" /></a>)}</div><p className="mt-4 text-xs leading-5 text-stone-400">{socialConnections.data?.some((connection) => connection.platform === "youtube" && connection.status === "connected") ? "YouTube connection available." : "Social publishing connections are managed separately from the storefront."}</p></div></footer>
    </div>
  );
}
