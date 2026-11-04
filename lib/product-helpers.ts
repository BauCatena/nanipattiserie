import type { Tables } from "@/types/supabase";

// Type aliases from Supabase
export type Product = Tables<"productos">;

const DEFAULT_PARAM_VALUE = "Sin clasificar";

export type NormalizedProduct = Product & {
  param1: string;
  param2: string;
};

function getProductAttribute(
  input: Product | Record<string, any> | null | undefined,
  attribute: "param1" | "param2",
): string {
  if (!input) return DEFAULT_PARAM_VALUE;

  const raw = input as Product & Record<string, any>;

  // Support both 'atributes' and 'attributes' spellings defensively
  const attributesObj =
    (raw.atributes && typeof raw.atributes === "object"
      ? raw.atributes
      : null) ??
    (raw.attributes && typeof raw.attributes === "object"
      ? raw.attributes
      : {});

  const value =
    raw[attribute] ??
    attributesObj[attribute] ??
    attributesObj[attribute === "param1" ? "category" : "subCategory"] ??
    attributesObj[attribute === "param1" ? "category" : "subcategory"] ??
    raw[attribute === "param1" ? "category" : "subCategory"] ??
    DEFAULT_PARAM_VALUE;

  return String(value ?? DEFAULT_PARAM_VALUE);
}

/**
 * Normalize product data from Supabase or migrated JSON safely
 */
export function normalizeProduct(input: any): NormalizedProduct {
  if (!input) {
    return {
      id: "",
      created_at: new Date().toISOString(),
      param1: DEFAULT_PARAM_VALUE,
      param2: DEFAULT_PARAM_VALUE,
    } as NormalizedProduct;
  }

  return {
    ...input,
    param1: getProductAttribute(input, "param1"),
    param2: getProductAttribute(input, "param2"),
  };
}

/**
 * Extract product gallery images safely
 * Handles both:
 * - Supabase 'images' field (JSON array or stringified JSON)
 * - Single 'image' field (fallback)
 */
export function getProductGallery(
  product: Product | null | undefined,
): string[] {
  if (!product) return [];

  // Try to get images from the images field
  if (product.images) {
    try {
      // If images is a stringified JSON array, parse it
      let parsedImages = product.images;
      if (typeof parsedImages === "string") {
        parsedImages = JSON.parse(parsedImages);
      }

      if (Array.isArray(parsedImages)) {
        const validImages = parsedImages.filter(
          (img): img is string =>
            typeof img === "string" && img.trim().length > 0,
        );
        if (validImages.length > 0) {
          return validImages;
        }
      }
    } catch {
      // If parsing fails, fall through to single image fallback
    }
  }

  // Fallback to single image field
  if (
    product.image &&
    typeof product.image === "string" &&
    product.image.trim().length > 0
  ) {
    return [product.image];
  }

  // Return empty array if no valid images found
  return [];
}
