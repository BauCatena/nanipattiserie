import { NextResponse, type NextRequest } from "next/server";
import { createAdminClient } from "@/lib/supabase-admin";
import { normalizeProduct } from "@/lib/product-helpers";

type RouteParams = {
  params: Promise<{ id: string }>;
};

export async function GET() {
  const ownerId = process.env.OWNER_ID;
  if (!ownerId) {
    console.error("[GET Products] Missing OWNER_ID env variable");
    return NextResponse.json({ error: "Missing OWNER_ID" }, { status: 500 });
  }

  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("productos")
      .select("*")
      .eq("owner", ownerId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("[GET Products] Supabase error:", error);
      throw error;
    }

    return NextResponse.json((data || []).map(normalizeProduct));
  } catch (err: any) {
    console.error("[GET Products] Crash error:", err.message || err);
    return NextResponse.json(
      { error: err.message || "Internal Server Error" },
      { status: 500 },
    );
  }
}
export async function POST(request: NextRequest) {
  const ownerId = process.env.OWNER_ID;
  if (!ownerId) {
    console.error("[POST Products] Missing OWNER_ID env variable");
    return NextResponse.json({ error: "Missing OWNER_ID" }, { status: 500 });
  }

  try {
    const body = await request.json().catch(() => ({}));
    const supabase = createAdminClient();

    // Attach the owner ID to the incoming product payload
    const productPayload = {
      ...body,
      owner: ownerId,
    };

    const { data, error } = await supabase
      .from("productos")
      .insert([productPayload])
      .select()
      .single();

    if (error) {
      console.error("[POST Products] Supabase error:", error);
      throw error;
    }

    return NextResponse.json(normalizeProduct(data), { status: 201 });
  } catch (err: any) {
    console.error("[POST Products] Error:", err.message || err);
    return NextResponse.json(
      { error: err.message || "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  const ownerId = process.env.OWNER_ID;
  if (!ownerId) {
    return NextResponse.json({ error: "Missing OWNER_ID" }, { status: 500 });
  }

  try {
    const { id } = await params;
    const body = await request.json().catch(() => ({}));
    const supabase = createAdminClient();

    const queryId = /^\d+$/.test(id) ? Number(id) : id;

    // Fetch existing product
    const { data: existing, error: fetchError } = await supabase
      .from("productos")
      .select("id, owner")
      .eq("id", queryId)
      .single();

    if (fetchError || !existing) {
      console.error(
        "[PUT Product] Fetch failed or not found:",
        fetchError,
        "ID tried:",
        queryId,
      );
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    if (existing.owner !== ownerId) {
      console.error(
        "[PUT Product] Owner mismatch! DB Owner:",
        existing.owner,
        "Env Owner:",
        ownerId,
      );
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Perform the update
    const { data, error } = await supabase
      .from("productos")
      .update(body)
      .eq("id", queryId)
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(normalizeProduct(data));
  } catch (err: any) {
    console.error("[PUT Product] Error:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
