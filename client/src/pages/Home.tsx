import { useEffect, useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";

type CatalogProduct = {
  id?: string;
  title: string;
  advertiserName?: string;
  currency?: string;
  price?: string | number;
  imageUrl?: string;
  clickUrl?: string;
  network?: string;
};

const fallbackImage = "https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?w=900&auto=format&fit=crop&q=85";

function categoryFor(product: CatalogProduct) {
  const text = `${product.title} ${product.advertiserName || ""}`.toLowerCase();
  if (/fish|rod|reel|tackle|bait|spool|lure/.test(text)) return "Outdoor";
  if (/power|battery|charger|station|rv|bluetti/.test(text)) return "Tech & Power";
  if (/beauty|skin|hair|wellness|health/.test(text)) return "Beauty & Wellness";
  return "Lifestyle";
}

export default function Home() {
  const [products, setProducts] = useState<CatalogProduct[]>([]);
  const [activeCategory, setActiveCategory] = useState("All");

  useEffect(() => {
    fetch("/api/trpc/catalog.affiliateProducts", { cache: "no-store" })
      .then(async (response) => {
        if (!response.ok) return;
        const payload = await response.json();
        const data = payload?.result?.data?.json ?? payload?.result?.data;
        if (Array.isArray(data)) setProducts(data);
      })
      .catch(() => undefined);
  }, []);

  const categories = useMemo(() => ["All", ...Array.from(new Set(products.map(categoryFor)))], [products]);
  const visibleProducts = useMemo(
    () => activeCategory === "All" ? products : products.filter((product) => categoryFor(product) === activeCategory),
    [activeCategory, products],
  );

  return (
    <div className="min-h-screen overflow-hidden bg-[#f4f1ea] text-stone-950">
      <div className="pointer-events-none fixed inset-0 -z-0 overflow-hidden">
        <div className="absolute -left-32 top-40 h-80 w-80 rounded-full bg-amber-200/30 blur-3xl" />
        <div className="absolute -right-24 top-[35rem] h-96 w-96 rounded-full bg-cyan-200/20 blur-3xl" />
      </div>

      <header className="sticky top-0 z-30 border-b border-stone-200/70 bg-[#f4f1ea]/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1600px] items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2.5">
            <img src="/manus-storage/Logo_294c6d62.png" alt="Janra" className="h-9 w-9 rounded-full object-cover shadow-md" />
            <div>
              <p className="text-[9px] font-bold uppercase tracking-[0.24em] text-stone-500">Global health &amp; beauty</p>
              <h1 className="font-display text-xl font-semibold tracking-tight">Brand Janra</h1>
            </div>
          </div>
          <p className="hidden text-[10px] font-bold uppercase tracking-[0.2em] text-stone-500 sm:block">Curated essentials · worldwide</p>
        </div>
      </header>

      <main className="relative z-10">
        <section className="mx-auto max-w-[1600px] px-4 pb-8 pt-5 sm:px-6 lg:px-8 lg:pt-8">
          <div className="relative isolate min-h-[360px] overflow-hidden rounded-[1.75rem] bg-stone-950 shadow-[0_28px_70px_-24px_rgba(28,25,23,.7)] [transform:perspective(1200px)_rotateX(1deg)] sm:min-h-[430px]">
            <video className="absolute inset-0 h-full w-full object-cover opacity-55" autoPlay muted loop playsInline preload="metadata">
              <source src="/media/main-promotion-video.mp4" type="video/mp4" />
            </video>
            <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(12,10,9,.9),rgba(12,10,9,.4),rgba(12,10,9,.15))]" />
            <div className="relative flex min-h-[360px] max-w-2xl flex-col justify-end px-6 py-9 text-white sm:min-h-[430px] sm:px-12 sm:py-12">
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-amber-200">The Janra edit</p>
              <h2 className="mt-3 max-w-xl font-display text-4xl leading-[.96] sm:text-6xl">Beautiful finds.<br />Better everyday rituals.</h2>
              <p className="mt-5 max-w-md text-sm leading-6 text-stone-300">Shop a moving collection of useful, beautiful, and well-priced discoveries.</p>
            </div>
            <div className="absolute right-5 top-5 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-white/80 backdrop-blur">Now showing</div>
          </div>
        </section>

        <section className="mx-auto max-w-[1600px] px-4 pb-20 sm:px-6 lg:px-8">
          <div className="mb-5 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.26em] text-stone-500">Shop by mood</p>
              <h3 className="mt-1 font-display text-3xl sm:text-4xl">Featured discoveries</h3>
            </div>
            <div className="flex flex-wrap gap-2" aria-label="Product categories">
              {categories.map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => setActiveCategory(category)}
                  className={`rounded-full border px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.14em] transition ${activeCategory === category ? "border-stone-950 bg-stone-950 text-white shadow-md" : "border-stone-300 bg-white/60 text-stone-600 hover:border-stone-950 hover:text-stone-950"}`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {visibleProducts.length ? (
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 2xl:grid-cols-8">
              {visibleProducts.map((product, index) => (
                <a key={product.id || `${product.title}-${index}`} href={product.clickUrl || "#"} target="_blank" rel="noreferrer sponsored noopener" className="group block [transform-style:preserve-3d]">
                  <Card className="h-full overflow-hidden rounded-xl border-stone-200/80 bg-white/90 shadow-[0_8px_20px_-12px_rgba(28,25,23,.45)] backdrop-blur transition duration-300 group-hover:[transform:perspective(800px)_rotateX(2deg)_rotateY(-2deg)_translateY(-4px)] group-hover:shadow-[0_18px_30px_-14px_rgba(28,25,23,.55)]">
                    <div className="relative aspect-[4/3] overflow-hidden bg-stone-100">
                      <img src={product.imageUrl || fallbackImage} alt={product.title} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" loading="lazy" onError={(event) => { event.currentTarget.src = fallbackImage; }} />
                    </div>
                    <CardContent className="p-2">
                      <h4 className="line-clamp-2 min-h-8 text-[11px] font-semibold leading-4">{product.title}</h4>
                      <p className="mt-1 text-[11px] font-bold text-stone-900">{product.price !== undefined && product.price !== "" ? `${product.currency || "USD"} ${product.price}` : "View offer"}</p>
                    </CardContent>
                  </Card>
                </a>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-stone-200 bg-white/80 px-7 py-12 text-center shadow-sm">
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-stone-500">Janra selections</p>
              <p className="mt-2 text-sm text-stone-600">New discoveries are added as partner links are synchronized.</p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
