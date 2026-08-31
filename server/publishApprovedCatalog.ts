import { HEALTH_BEAUTY_CATALOG } from "../shared/commerce.js";
import { publishProductToChannels, getSocialStatus } from "./socialService.js";

export async function runAutoPublish() {
  const status = getSocialStatus();
  console.log("=================================================================");
  console.log("   BRAND JANRA META PUBLISHING ENGINE");
  console.log(`   Facebook Page: ${status.facebookPageName} (ID: ${status.facebookPageId})`);
  console.log(`   Instagram: ${status.instagramUsername}`);
  console.log(`   Mode: ${status.mode.toUpperCase()}`);
  console.log("=================================================================\n");

  const approvedProducts = HEALTH_BEAUTY_CATALOG.filter((p) => p.approvedForPublishing);
  console.log(`Found ${approvedProducts.length} approved products (Ashwagandha excluded).\n`);

  const results = [];

  for (const product of approvedProducts) {
    console.log(`[Publishing] ${product.name} by ${product.brand}...`);
    const publishRes = await publishProductToChannels({
      productName: `${product.name} (${product.brand})`,
      category: product.category,
      reasonToConsider: `${product.keyBenefit} Merchant: ${product.storeName} (${product.shippingNote}).`,
      productSlug: product.slug,
      affiliate: true,
      platforms: ["facebook", "instagram"],
    });

    results.push({
      product: product.name,
      brand: product.brand,
      affiliateUrl: product.affiliateUrl,
      facebookResult: publishRes.results.find((r) => r.platform === "facebook"),
      instagramResult: publishRes.results.find((r) => r.platform === "instagram"),
    });
  }

  console.log("\n=================================================================");
  console.log("   PUBLISHING COMPLETED SUCCESSFULLY");
  console.log("=================================================================\n");

  return results;
}

if (process.argv[1]?.includes("publishApprovedCatalog")) {
  runAutoPublish().then((results) => {
    console.log(JSON.stringify(results, null, 2));
  });
}
