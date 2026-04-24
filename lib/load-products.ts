import { config } from "@/data/config"
import type { Product, ProductInput } from "@/types/product"
import { normalizeProduct } from "@/lib/product-helpers"

export async function loadProductsFromConfig(): Promise<Product[]> {
  const res = await fetch(config.productList.productsJsonUrl)
  if (!res.ok) {
    throw new Error("No se pudo cargar el catálogo")
  }
  const raw = (await res.json()) as ProductInput[]
  return raw.map(normalizeProduct)
}
