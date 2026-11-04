"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { ProductDetailView } from "@/components/ProductDetailView";
import { AdminShell } from "@/layouts/AdminShell";
import { createBrowserSupabaseClient } from "@/lib/supabase-browser";
import {
  normalizeProduct,
  type NormalizedProduct,
} from "@/lib/product-helpers";
import { config } from "@/data/config";

export default function AdminProductEditPage() {
  const params = useParams();
  const router = useRouter();
  const rawId = params?.id;
  const idStr = Array.isArray(rawId) ? rawId[0] : rawId;
  const id = idStr ? Number.parseInt(idStr, 10) : NaN;

  const [product, setProduct] = useState<NormalizedProduct | null | undefined>(
    undefined,
  );
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createBrowserSupabaseClient();
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) {
        router.replace("/admin/login");
        return;
      }
      setUserId(data.user.id);
    });
  }, [router]);

  useEffect(() => {
    if (!userId || !Number.isFinite(id)) return;
    let cancel = false;

    (async () => {
      const supabase = createBrowserSupabaseClient();
      const { data, error } = await supabase
        .from("productos")
        .select("*")
        .eq("id", id)
        .eq("owner", userId)
        .single();

      if (!cancel) {
        if (error || !data) setProduct(null);
        else setProduct(normalizeProduct(data));
      }
    })();

    return () => {
      cancel = true;
    };
  }, [id, userId]);

  if (product === undefined) {
    return (
      <AdminShell>
        <p className="text-center text-muted-foreground">
          {config.catalogo.producto.loading}
        </p>
      </AdminShell>
    );
  }

  if (product === null || !userId) {
    return (
      <AdminShell>
        <p className="text-center text-muted-foreground">
          {config.catalogo.producto.notFoundTitle}
        </p>
      </AdminShell>
    );
  }

  return (
    <ProductDetailView
      product={product}
      mode="admin"
      userId={userId}
      onProductChange={setProduct}
      backHref="/admin"
      backLabel="Volver al panel"
    />
  );
}
