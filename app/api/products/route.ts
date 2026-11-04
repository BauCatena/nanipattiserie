import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase-admin";
import { normalizeProduct } from "@/lib/product-helpers";

export async function GET() {
  const ownerId = process.env.OWNER_ID;

  if (!ownerId) {
    return NextResponse.json(
      { error: "Configuration Error: OWNER_ID is missing" },
      { status: 500 },
    );
  }

  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("productos")
      .select("*")
      .eq("owner", ownerId) // Strict multi-tenant isolation
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const normalized = (data || []).map(normalizeProduct);
    return NextResponse.json(normalized);
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Server error" },
      { status: 500 },
    );
  }
}
