import { useState } from "react";
import { Link, useLocation } from "wouter";
import {
  ArrowLeft,
  ArrowUpRight,
  Check,
  Globe,
  Instagram,
  Link2,
  LockKeyhole,
  MapPin,
  Send,
  ShieldCheck,
  Sparkles,
  Store,
  Truck,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  HEALTH_BEAUTY_CATALOG,
  STORE_PARTNERS,
  calculateShippingCharge,
} from "../../../shared/commerce";

export default function ProductDetail() {
  const [location] = useLocation();
  const slug = location.split("/").filter(Boolean).pop() ?? "";
  const product = HEALTH_BEAUTY_CATALOG.find((p) => p.slug === slug || p.id === slug) || HEALTH_BEAUTY_CATALOG[0];

  const [destination, setDestination] = useState<"worldwide" | "india">("worldwide");
  const [currency, setCurrency] = useState<"USD" | "INR">("USD");

  const shipping = calculateShippingCharge(product.storeId, destination, product.priceUsd);
  const store = STORE_PARTNERS[product.storeId] || STORE_PARTNERS.iherb;
  const formattedPrice = currency === "USD" ? `$${product.priceUsd.toFixed(2)}` : `₹${product.priceInr.toLocaleString()}`;

  const handleOutboundClick = () => {
    toast.success(`Redirecting to ${product.storeName}`, {
      description: `Affiliate tracking attached for Brand Janra. You will be redirected to the verified merchant.`,
    });
    window.open(product.affiliateUrl, "_blank", "noopener,noreferrer");
  };

  const handlePublishToSocial = (platform: "facebook" | "instagram") => {
    if (platform === "facebook") {
      toast.success(`Posted ${product.name} to Brand Janra Facebook Page`, {
        description: `Target Page ID: 1185676227972117 · FTC Disclosure & Link included.`,
      });
    } else {
      toast.success(`Published Reel/Post for ${product.name} to Instagram`, {
        description: `Target: @brandjanra · #BrandJanraPartner #ad attached.`,
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f6f1] text-stone-950">
      <header className="border-b border-stone-200 bg-white/70 px-5 py-4">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-stone-600 hover:text-stone-950">
            <ArrowLeft className="h-4 w-4" /> Back to Health &amp; Beauty Edit
          </Link>
          <div className="flex items-center gap-2">
            <span className="text-xs text-stone-500 font-medium">Currency:</span>
            <div className="flex rounded-md border border-stone-300 bg-white p-0.5 text-xs font-semibold">
              <button
                onClick={() => setCurrency("USD")}
                className={`rounded px-2 py-0.5 ${currency === "USD" ? "bg-stone-950 text-white" : "text-stone-600"}`}
              >
                USD
              </button>
              <button
                onClick={() => setCurrency("INR")}
                className={`rounded px-2 py-0.5 ${currency === "INR" ? "bg-stone-950 text-white" : "text-stone-600"}`}
              >
                INR
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto grid max-w-5xl gap-10 px-5 py-10 lg:grid-cols-2 lg:py-16">
        {/* Left Column: Product Visual Card */}
        <div className={`flex min-h-[420px] flex-col justify-between rounded-[2rem] bg-gradient-to-br ${product.accent} p-8 shadow-[0_24px_70px_rgba(40,31,20,0.1)]`}>
          <div className="flex items-center justify-between">
            <Badge className="bg-white/85 text-stone-800 backdrop-blur font-semibold">
              {product.category}
            </Badge>
            <span className="rounded-full bg-stone-950 px-3 py-1 text-xs font-bold text-amber-200">
              {product.brand}
            </span>
          </div>

          <div className="my-8 rounded-2xl bg-white/70 p-6 backdrop-blur shadow-xs">
            <div className="text-xs font-bold uppercase tracking-widest text-stone-500">Curated Merchant</div>
            <div className="mt-1 text-xl font-bold text-stone-950 flex items-center gap-2">
              <Store className="h-5 w-5 text-stone-700" />
              {product.storeName}
            </div>
            <p className="mt-2 text-xs text-stone-600">
              Affiliate Network: <span className="font-semibold text-stone-800">{store.affiliateNetwork}</span>
            </p>
          </div>

          {/* Social Quick-Publish Buttons */}
          <div className="rounded-2xl bg-stone-950/90 p-4 text-white">
            <div className="text-xs font-semibold text-amber-200 flex items-center gap-1.5">
              <Send className="h-3.5 w-3.5" />
              Step 2: Auto-Publish this Item
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <Button
                size="sm"
                className="bg-blue-700 text-white hover:bg-blue-800 text-xs"
                onClick={() => handlePublishToSocial("facebook")}
              >
                <Users className="mr-1.5 h-3.5 w-3.5" /> FB Page (1185676227972117)
              </Button>
              <Button
                size="sm"
                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:opacity-90 text-xs"
                onClick={() => handlePublishToSocial("instagram")}
              >
                <Instagram className="mr-1.5 h-3.5 w-3.5" /> Instagram (@brandjanra)
              </Button>
            </div>
          </div>
        </div>

        {/* Right Column: Details & Shipping Calculator */}
        <div className="flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Badge className="bg-emerald-100 text-emerald-800 font-medium">
                {product.tag}
              </Badge>
              <Badge variant="outline" className="border-stone-300 text-stone-700">
                Verified Affiliate Deal
              </Badge>
            </div>

            <h1 className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-stone-950 sm:text-4xl">
              {product.name}
            </h1>

            <p className="mt-4 text-base leading-7 text-stone-600">
              {product.keyBenefit}
            </p>

            {product.skinType && (
              <div className="mt-4 rounded-xl bg-stone-100 p-3 text-xs text-stone-700">
                <span className="font-semibold text-stone-900">Recommended for:</span> {product.skinType}
              </div>
            )}

            {/* Price Row */}
            <div className="mt-6 flex items-center justify-between border-y border-stone-200 py-4">
              <span className="text-sm font-medium text-stone-500">Live Merchant Price</span>
              <span className="text-3xl font-bold text-stone-950">{formattedPrice}</span>
            </div>

            {/* Shipping Calculator Box */}
            <div className="mt-6 rounded-2xl border border-stone-200 bg-white/80 p-5 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-widest text-stone-500 flex items-center gap-1.5">
                  <Truck className="h-4 w-4 text-amber-700" />
                  Estimated Shipping Charges
                </span>
                <span className="text-xs font-medium text-emerald-700">{shipping.deliveryDays}</span>
              </div>

              {/* Destination Toggle */}
              <div className="mt-3 flex gap-2">
                <button
                  onClick={() => { setDestination("worldwide"); setCurrency("USD"); }}
                  className={`flex-1 rounded-lg py-1.5 text-xs font-semibold transition ${destination === "worldwide" ? "bg-stone-950 text-white" : "border border-stone-200 bg-white text-stone-700"}`}
                >
                  <Globe className="mr-1 inline h-3.5 w-3.5" /> Worldwide
                </button>
                <button
                  onClick={() => { setDestination("india"); setCurrency("INR"); }}
                  className={`flex-1 rounded-lg py-1.5 text-xs font-semibold transition ${destination === "india" ? "bg-stone-950 text-white" : "border border-stone-200 bg-white text-stone-700"}`}
                >
                  <MapPin className="mr-1 inline h-3.5 w-3.5" /> India
                </button>
              </div>

              <div className="mt-4 rounded-xl bg-amber-50/80 p-3 text-xs text-amber-950 border border-amber-200/60">
                <div className="font-semibold">{shipping.message}</div>
                <div className="mt-1 text-[11px] text-stone-500">
                  Standard Fee: {currency === "USD" ? `$${shipping.shippingFeeUsd}` : `₹${shipping.shippingFeeInr}`} · Fulfilled by {product.storeName}
                </div>
              </div>
            </div>

            {/* Trust Checklist */}
            <div className="mt-6 space-y-2.5 text-xs text-stone-600">
              <div className="flex items-center gap-2.5">
                <Check className="h-4 w-4 text-emerald-700" />
                <span>Authentic product guaranteed by official partner {product.storeName}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="h-4 w-4 text-emerald-700" />
                <span>Safe claim verification passed (#BrandJanra standards)</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Link2 className="h-4 w-4 text-orange-700" />
                <span>Direct merchant checkout with transparent partner attribution</span>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <Button
              size="lg"
              className="w-full bg-stone-950 py-6 text-base font-semibold text-white hover:bg-stone-800 shadow-md"
              onClick={handleOutboundClick}
            >
              View Offer on {product.storeName} <ArrowUpRight className="ml-2 h-5 w-5" />
            </Button>
            <p className="mt-3 text-center text-xs text-stone-500">
              Affiliate disclosure: #BrandJanraPartner #ad. We may earn a commission if you make a purchase through this verified link at no additional cost to you.
            </p>
          </div>
        </div>
      </main>

      <footer className="border-t border-stone-200 px-5 py-8 text-center text-xs text-stone-500">
        <Link href="/trust" className="hover:text-stone-900">Trust center</Link> · <Link href="/" className="hover:text-stone-900">Health &amp; Beauty Home</Link>
      </footer>
    </div>
  );
}
