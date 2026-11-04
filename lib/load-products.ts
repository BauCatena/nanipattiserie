import { config } from "@/data/config";
import {
  normalizeProduct,
  type NormalizedProduct,
} from "@/lib/product-helpers";

export async function loadProductsFromConfig(): Promise<NormalizedProduct[]> {
  try {
    // Fetch from our secure server-side API route
    const res = await fetch("/api/products", { cache: "no-store" });
    if (res.ok) {
      const raw = (await res.json()) as NormalizedProduct[];
      return raw.map(normalizeProduct);
    }
  } catch (err) {
    console.error("Error fetching from internal API, trying fallback:", err);
  }

  // Fallback to static JSON if API fails
  try {
    const res = await fetch(config.productList.productsJsonUrl);
    if (res.ok) {
      const raw = (await res.json()) as NormalizedProduct[];
      return raw.map(normalizeProduct);
    }
  } catch {
    // Ignore fallback error
  }

  return [];
}
