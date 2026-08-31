import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";

type CatalogProduct = {
  id?: string;
  title: string;
  currency?: string;
  price?: string | number;
  imageUrl?: string;
  clickUrl?: string;
};

const fallbackImage = "https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?w=900&auto=format&fit=crop&q=85";

export default function Home() {
  const [products, setProducts] = useState<CatalogProduct[]>([]);

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

  return (
    <div className="min-h-screen bg-[#f6f3ed] text-stone-950">
      <header className="sticky top-0 z-20 border-b border-stone-200/80 bg-[#f6f3ed]/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center px-5 py-4 lg:px-10">
          <div className="flex items-center gap-3">
            <img src="/manus-storage/Logo_294c6d62.png" alt="Janra" className="h-11 w-11 rounded-full object-cover shadow-sm" />
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-stone-500">Global health &amp; beauty</p>
              <h1 className="font-display text-2xl font-semibold tracking-tight">Brand Janra</h1>
            </div>
          </div>
        </div>
      </header>

      <main>
        <section className="mx-auto max-w-7xl px-5 pb-10 pt-8 lg:px-10 lg:pt-12">
          <div className="rounded-[2rem] bg-stone-950 px-7 py-12 text-white shadow-2xl sm:px-12 sm:py-16">
            <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-amber-200">Janra showroom</p>
            <h2 className="mt-3 max-w-3xl font-display text-5xl leading-[.98] sm:text-7xl">Thoughtful discoveries for everyday rituals.</h2>
            <p className="mt-6 max-w-xl text-sm leading-6 text-stone-300">Explore the latest beauty, wellness, and lifestyle selections.</p>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-5 pb-24 lg:px-10">
          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-stone-500">Janra selections</p>
              <h3 className="mt-2 font-display text-4xl">Featured discoveries</h3>
            </div>
            <span className="text-right text-sm text-stone-500">Worldwide shipping · USD</span>
          </div>

          {products.length ? (
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {products.map((product, index) => (
                <a key={product.id || `${product.title}-${index}`} href={product.clickUrl || "#"} target="_blank" rel="noreferrer sponsored noopener" className="group block">
                  <Card className="h-full overflow-hidden border-stone-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                    <div className="relative aspect-[4/3] overflow-hidden bg-stone-100">
                      <img
                        src={product.imageUrl || fallbackImage}
                        alt={product.title}
                        className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                        loading="lazy"
                        onError={(event) => {
                          event.currentTarget.src = fallbackImage;
                        }}
                      />
                    </div>
                    <CardContent className="p-2">
                      <h4 className="line-clamp-2 min-h-8 text-xs font-semibold leading-4">{product.title}</h4>
                      <p className="mt-1 text-xs font-bold text-stone-900">{product.price !== undefined && product.price !== "" ? `${product.currency || "USD"} ${product.price}` : "View offer"}</p>
                    </CardContent>
                  </Card>
                </a>
              ))}
            </div>
          ) : (
            <div className="rounded-[1.75rem] border border-stone-200 bg-white px-7 py-12 text-center shadow-sm">
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-stone-500">Janra selections</p>
              <p className="mt-2 text-sm text-stone-600">New discoveries are added as partner links are synchronized.</p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
