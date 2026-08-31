import { ArrowUpRight, ChevronRight } from "lucide-react";
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
          <span className="text-sm text-stone-500">Official Storefront</span>
        </div>
      </header>

      <main>
        <section className="mx-auto max-w-5xl px-5 pt-6 lg:px-10 lg:pt-8" aria-label="Brand Janra promotion">
          <div className="overflow-hidden rounded-[1.5rem] bg-stone-950 shadow-xl ring-1 ring-stone-900/10">
            <video className="aspect-video w-full object-cover" controls muted autoPlay loop playsInline preload="metadata" aria-label="Brand Janra promotion video">
              <source src="/Main_PromotionVideo.mp4" type="video/mp4" />
              Your browser does not support the promotion video.
            </video>
          </div>
        </section>
        <section className="mx-auto max-w-7xl px-5 pb-12 pt-8 lg:px-10 lg:pt-12"><div className="rounded-[2rem] bg-stone-950 px-7 py-12 text-white shadow-2xl sm:px-12 sm:py-16"><p className="text-[10px] font-bold uppercase tracking-[0.28em] text-amber-200">Janra showroom</p><h2 className="mt-3 max-w-3xl font-display text-5xl leading-[.98] sm:text-7xl">Thoughtful discoveries for everyday rituals.</h2><p className="mt-6 max-w-xl text-sm leading-6 text-stone-300">Explore the latest beauty, wellness, and lifestyle selections.</p></div></section>
        <section className="mx-auto max-w-7xl px-5 pb-24 lg:px-10">
          <div className="mb-7 flex items-end justify-between"><div><p className="text-xs font-bold uppercase tracking-[0.22em] text-stone-500">Janra selections</p><h3 className="mt-2 font-display text-4xl">Featured discoveries</h3></div><span className="text-sm text-stone-500">Verified partner offers only</span></div>
          {affiliateProductsQuery.isLoading && <p className="py-12 text-sm text-stone-500">Loading verified partner offers…</p>}
          {!affiliateProductsQuery.isLoading && products.length === 0 && <div className="rounded-2xl border border-dashed border-stone-300 bg-white px-7 py-12 text-center"><p className="font-semibold">No verified partner offers yet</p><p className="mt-2 text-sm text-stone-600">Products appear here only after a configured CJ or Awin feed returns validated records.</p></div>}
          {products.length > 0 && <div className="grid gap-5 md:grid-cols-3">{products.map((product) => <Card key={`${product.advertiserName}-${product.id}`} className="overflow-hidden border-stone-200 bg-white shadow-sm"><div className="relative h-56 overflow-hidden bg-stone-100"><img src={product.imageUrl} alt={product.title} className="h-full w-full object-cover" loading="lazy" onError={(event) => { event.currentTarget.style.display = "none"; }} /><div className="absolute inset-0 bg-gradient-to-t from-stone-950/45 to-transparent" /><div className="absolute bottom-4 left-5"><span className="rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-stone-700">Verified partner feed</span></div></div><CardContent className="p-5"><div className="flex items-start justify-between gap-4"><div><p className="text-xs uppercase tracking-wider text-stone-500">{product.advertiserName}</p><h4 className="mt-1 text-lg font-semibold">{product.title}</h4><p className="mt-2 text-sm text-stone-500">Affiliate partner product</p></div><p className="font-semibold">{product.currency ? `${product.currency} ` : ""}{product.price}</p></div><p className="mt-3 line-clamp-3 text-sm leading-6 text-stone-600">{product.description}</p><a href={product.clickUrl} target="_blank" rel="noreferrer sponsored noopener" className="mt-5 block"><Button variant="outline" className="w-full border-stone-300">View offer <ChevronRight className="ml-auto h-4 w-4" /></Button></a></CardContent></Card>)}</div>}
        </section>

      </main>

      <footer className="mx-auto max-w-7xl px-5 pb-16 lg:px-10"><div className="rounded-2xl bg-stone-950 p-6 text-white"><p className="text-xs font-bold uppercase tracking-[0.22em] text-amber-200">Brand Janra channels</p><div className="mt-4 flex flex-wrap gap-3">{socialProfiles.map((profile) => <a key={profile.url} href={profile.url} target="_blank" rel="noreferrer noopener" className="text-sm text-stone-300 hover:text-white">{profile.label} <ArrowUpRight className="ml-1 inline h-3 w-3" /></a>)}</div><p className="mt-4 text-xs leading-5 text-stone-400">{socialConnections.data?.some((connection) => connection.platform === "youtube" && connection.status === "connected") ? "YouTube connection available." : "Social publishing connections are managed separately from the storefront."}</p></div></footer>
    </div>
  );
}
