import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";
import { collectAttributeOptions } from "@/lib/attribute-options";
import { normalizeProduct } from "@/lib/product-helpers";

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data, error } = await supabase
      .from("productos")
      .select("*")
      .eq("owner", user.id);

    if (error) {
      return NextResponse.json(
        { error: "Failed to fetch products" },
        { status: 500 },
      );
    }

    const products = (data ?? []).map(normalizeProduct);
    return NextResponse.json(collectAttributeOptions(products));
  } catch (error) {
    console.error("attribute-options:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
