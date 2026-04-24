import type { Product, ProductInput } from "@/types/product"

const DEFAULT_PARAM_VALUE = "Sin clasificar"

export function normalizeProduct(input: ProductInput): Product {
  return {
    id: input.id,
    name: input.name,
    // Prioriza modelo nuevo, luego compatibilidad legacy.
    param1: input.param1 ?? input.category ?? DEFAULT_PARAM_VALUE,
    param2: input.param2 ?? input.subCategory ?? DEFAULT_PARAM_VALUE,
    price: input.price,
    image: input.image,
    images: input.images,
    description: input.description,
  }
}

export function getProductGallery(product: Product): string[] {
  if (product.images && product.images.length > 0) {
    return product.images
  }
  return [product.image]
}
