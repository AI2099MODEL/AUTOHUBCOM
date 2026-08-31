import { useEffect, useState } from "react";
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

type CatalogProduct = {
  id?: string;
  title: string;
  advertiserName?: string;
  currency?: string;
  price?: string | number;
  imageUrl?: string;
  description?: string;
  clickUrl?: string;
};

const fallbackImage = "https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?w=900&auto=format&fit=crop&q=85";

export default function Home() {
  const [products, setProducts] = useState<CatalogProduct[]>([]);

  useEffect(() => {
    fetch("/api/awin-sync")
      .then(async (response) => {
        if (!response.ok) return;
        const data = await response.json();
        if (data.ok && Array.isArray(data.products)) setProducts(data.products);
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
        <section className="mx-auto max-w-7xl px-5 pb-12 pt-8 lg:px-10 lg:pt-12">
          <div className="rounded-[2rem] bg-stone-950 px-7 py-12 text-white shadow-2xl sm:px-12 sm:py-16">
            <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-amber-200">Janra showroom</p>
            <h2 className="mt-3 max-w-3xl font-display text-5xl leading-[.98] sm:text-7xl">Thoughtful discoveries for everyday rituals.</h2>
            <p className="mt-6 max-w-xl text-sm leading-6 text-stone-300">Explore the latest beauty, wellness, and lifestyle selections.</p>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-5 pb-24 lg:px-10">
          <div className="mb-7 flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-stone-500">Janra selections</p>
              <h3 className="mt-2 font-display text-4xl">Featured discoveries</h3>
            </div>
            <span className="text-right text-sm text-stone-500">Worldwide shipping · USD</span>
          </div>

          {products.length ? (
            <div className="grid gap-5 md:grid-cols-3">
              {products.map((product, index) => (
                <Card key={product.id || `${product.title}-${index}`} className="overflow-hidden border-stone-200 bg-white shadow-sm">
                  <div className="relative h-56 overflow-hidden bg-stone-100">
                    <img
                      src={product.imageUrl || fallbackImage}
                      alt={product.title}
                      className="h-full w-full object-cover"
                      loading="lazy"
                      onError={(event) => {
                        event.currentTarget.src = fallbackImage;
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-stone-950/45 to-transparent" />
                  </div>
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-xs uppercase tracking-wider text-stone-500">{product.advertiserName || "Partner discovery"}</p>
                        <h4 className="mt-1 text-lg font-semibold">{product.title}</h4>
                        <p className="mt-2 text-sm text-stone-500">Partner product</p>
                      </div>
                      {product.price !== undefined && <p className="whitespace-nowrap font-semibold">{product.currency || "USD"} {product.price}</p>}
                    </div>
                    {product.description && <p className="mt-3 line-clamp-3 text-sm leading-6 text-stone-600">{product.description}</p>}
                    <a href={product.clickUrl || "#"} target="_blank" rel="noreferrer sponsored noopener" className="mt-5 block">
                      <Button variant="outline" className="w-full border-stone-300" disabled={!product.clickUrl}>
                        View offer <ChevronRight className="ml-auto h-4 w-4" />
                      </Button>
                    </a>
                  </CardContent>
                </Card>
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
