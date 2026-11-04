import { NextResponse, type NextRequest } from "next/server";
import { createAdminClient } from "@/lib/supabase-admin";
import { normalizeProduct } from "@/lib/product-helpers";

type RouteParams = {
  params: Promise<{ id: string }>;
};

// 1. GET: Fetch a single product by ID
export async function GET(request: NextRequest, { params }: RouteParams) {
  const ownerId = process.env.OWNER_ID;
  if (!ownerId) {
    return NextResponse.json({ error: "Missing OWNER_ID" }, { status: 500 });
  }

  try {
    const { id } = await params;
    const queryId = /^\d+$/.test(id) ? Number(id) : id;
    const supabase = createAdminClient();

    const { data, error } = await supabase
      .from("productos")
      .select("*")
      .eq("id", queryId)
      .eq("owner", ownerId)
      .single();

    if (error || !data) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(normalizeProduct(data));
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// 2. PUT: Update a specific product securely
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

    // Fetch existing product and verify ownership
    const { data: existing, error: fetchError } = await supabase
      .from("productos")
      .select("id, owner")
      .eq("id", queryId)
      .single();

    if (fetchError || !existing) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    if (existing.owner !== ownerId) {
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

// Inside DELETE in app/api/admin/products/[id]/route.ts
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  const ownerId = process.env.OWNER_ID;
  if (!ownerId) {
    return NextResponse.json({ error: "Missing OWNER_ID" }, { status: 500 });
  }

  try {
    const { id } = await params;
    const supabase = createAdminClient();

    // Check if the parameter is a UUID or a numeric ID
    const isUuid =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
        id,
      );
    const queryField = isUuid ? "uuid" : "id";
    const queryValue = isUuid ? id : /^\d+$/.test(id) ? Number(id) : id;

    // Verify ownership
    const { data: existing, error: fetchError } = await supabase
      .from("productos")
      .select("uuid, owner")
      .eq(queryField, queryValue)
      .single();

    if (fetchError || !existing) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    if (existing.owner !== ownerId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Perform deletion using admin privileges
    const { error: deleteError } = await supabase
      .from("productos")
      .delete()
      .eq(queryField, queryValue);

    if (deleteError) throw deleteError;

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("[DELETE Product] Error:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
