import { HEALTH_BEAUTY_CATALOG } from "../shared/commerce";
import { executeScheduledPost, getSchedulerQueue } from "./socialScheduler";

async function main() {
  console.log("🚀 Testing connectivity by publishing 2 products to Facebook Page (1185676227972117) and Instagram (@brandjanra)...");
  
  const queue = getSchedulerQueue();
  console.log(`📋 Total items in scheduler queue: ${queue.length}`);
  
  // Pick the Flipkart product and one international product (e.g. COSRX / CeraVe)
  const targetProducts = queue.filter(p => 
    p.productSlug === "derma-co-salicylic-acid-serum" || 
    p.productSlug === "cosrx-snail-mucin-essence"
  );

  for (const item of targetProducts) {
    console.log(`\n--------------------------------------------------`);
    console.log(`📤 Publishing: ${item.productName} (${item.brand})`);
    console.log(`📦 Target Channels: ${item.platforms.join(", ")}`);
    console.log(`🔗 Tracking / Destination: ${item.generatedPayloads.facebook?.link || item.productSlug}`);
    
    const result = await executeScheduledPost(item.id);
    console.log(`✅ Result: ${result.success ? "SUCCESS" : "FAILED"}`);
    result.results.forEach(r => {
      console.log(`   - [${r.platform.toUpperCase()}] Post ID: ${r.postId} | Status: ${r.success ? 'Published' : 'Failed'}`);
      console.log(`     Link: ${r.postUrl}`);
    });
  }

  console.log(`\n🎉 Connectivity test completed successfully!`);
}

main().catch(err => {
  console.error("❌ Error running connectivity test:", err);
  process.exit(1);
});
