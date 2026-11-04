import fs from "fs";
import path from "path";
import { createAdminClient } from "@/lib/supabase-admin";
import type { Tables } from "@/types/supabase";

type Product = Tables<"productos">;

const CACHE_FILE_PATH = path.join(process.cwd(), "public", "products.json");

export function cacheProductsToFile(products: Product[]): void {
  try {
    const jsonString = JSON.stringify(products, null, 2);
    fs.writeFileSync(CACHE_FILE_PATH, jsonString, "utf-8");
  } catch {
    // File write may fail on serverless — non-fatal
  }
}

export async function fetchProductsFromSupabase(
  ownerId?: string | null,
): Promise<Product[]> {
  // Use the admin client to securely bypass strict public RLS on the server side
  const supabase = createAdminClient();

  // Enforce deployment's OWNER_ID if not explicitly passed as an argument
  const targetOwnerId = ownerId ?? process.env.OWNER_ID;

  if (!targetOwnerId) {
    throw new Error(
      "Configuration Error: OWNER_ID is missing from environment variables.",
    );
  }

  const { data, error } = await supabase
    .from("productos")
    .select("*")
    .eq("owner", targetOwnerId) // Strict multi-tenant isolation filter
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data ?? []) as Product[];
}

export async function syncProductsFromSupabase(
  ownerId?: string | null,
): Promise<Product[]> {
  const products = await fetchProductsFromSupabase(ownerId);
  cacheProductsToFile(products);
  return products;
}
