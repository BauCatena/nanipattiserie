import type { Tables } from '@/types/supabase';

// Type aliases from Supabase
export type Product = Tables<'productos'>;

const DEFAULT_PARAM_VALUE = 'Sin clasificar';

export type NormalizedProduct = Product & {
  param1: string
  param2: string
}

function getProductAttribute(
  input: Product | Record<string, any>,
  attribute: 'param1' | 'param2'
): string {
  const raw = input as Product & Record<string, any>
  const atributes =
    raw.atributes && typeof raw.atributes === 'object'
      ? (raw.atributes as Record<string, any>)
      : {}

  const value =
    raw[attribute] ??
    atributes[attribute] ??
    atributes[attribute === 'param1' ? 'category' : 'subCategory'] ??
    atributes[attribute === 'param1' ? 'category' : 'subcategory'] ??
    raw[attribute === 'param1' ? 'category' : 'subCategory'] ??
    DEFAULT_PARAM_VALUE

  return String(value ?? DEFAULT_PARAM_VALUE)
}

/**
 * Normalize product data from Supabase or migrated JSON
 */
export function normalizeProduct(input: any): NormalizedProduct {
  return {
    ...input,
    param1: getProductAttribute(input, 'param1'),
    param2: getProductAttribute(input, 'param2'),
  }
}

/**
 * Extract product gallery images
 * Handles both:
 * - Supabase 'images' field (JSON array)
 * - Single 'image' field (fallback)
 */
export function getProductGallery(product: Product): string[] {
  // Try to get images from the images field (JSON)
  if (product.images) {
    try {
      // If images is already an array, use it
      if (Array.isArray(product.images)) {
        const validImages = product.images.filter(
          (img): img is string => typeof img === 'string' && img.length > 0
        )
        if (validImages.length > 0) {
          return validImages
        }
      }
    } catch {
      // If parsing fails, fall through to single image
    }
  }

  // Fallback to single image
  if (product.image) {
    return [product.image]
  }

  // Return empty array if no images
  return []
}
