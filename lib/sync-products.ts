import fs from "fs";
import path from "path";
import { createClient } from "@/lib/supabase-server";
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
  // Use the authenticated server client instead of raw @supabase/supabase-js
  const supabase = await createClient();

  let query = supabase
    .from("productos")
    .select("*")
    .order("created_at", { ascending: false });

  if (ownerId) {
    query = query.eq("owner", ownerId);
  }

  const { data, error } = await query;
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
