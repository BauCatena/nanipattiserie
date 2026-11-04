"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { ProductDetailView } from "@/components/ProductDetailView";
import { AdminShell } from "@/layouts/AdminShell";
import { createBrowserSupabaseClient } from "@/lib/supabase-browser";
import type { NormalizedProduct } from "@/lib/product-helpers";
import { config } from "@/data/config";

export default function AdminProductEditPage() {
  const params = useParams();
  const router = useRouter();
  const rawId = params?.id;
  const idStr = Array.isArray(rawId) ? rawId[0] : rawId;

  const [product, setProduct] = useState<NormalizedProduct | null | undefined>(
    undefined,
  );
  const [userId, setUserId] = useState<string | null>(null);

  // 1. Authenticate user session
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

  // 2. Fetch product via the secure admin API route
  useEffect(() => {
    if (!userId || !idStr) return;
    let cancel = false;

    (async () => {
      try {
        const res = await fetch(`/api/admin/products/${idStr}`);
        if (!res.ok) {
          if (!cancel) setProduct(null);
          return;
        }
        const data = await res.json();
        if (!cancel) setProduct(data);
      } catch {
        if (!cancel) setProduct(null);
      }
    })();

    return () => {
      cancel = true;
    };
  }, [idStr, userId]);

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
