"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, LogOut, Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { AdminShell } from "@/layouts/AdminShell";
import { createBrowserSupabaseClient } from "@/lib/supabase-browser";
import type { NormalizedProduct } from "@/lib/product-helpers";
import type { User } from "@supabase/supabase-js";

export default function AdminDashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [products, setProducts] = useState<NormalizedProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createBrowserSupabaseClient();
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) {
        router.replace("/admin/login");
        return;
      }
      setUser(data.user);
      loadProducts();
    });
  }, [router]);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/products");
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setProducts(data);
    } catch {
      toast.error("Error al cargar productos");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    const supabase = createBrowserSupabaseClient();
    await supabase.auth.signOut();
    router.replace("/admin/login");
  };

  const handleCreate = async () => {
    if (!user) return;
    try {
      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "Nuevo producto",
          price: 0,
          image:
            "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800",
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || "Error al crear producto");
      }
      const data = await res.json();

      toast.success("Producto creado");
      router.push(`/admin/catalogo/${data.id}`);
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Error al crear producto");
    }
  };

  const handleDelete = async (uuid: string) => {
    if (!confirm("¿Eliminar este producto?")) return;
    try {
      const res = await fetch(`/api/admin/products/${uuid}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || "Error al eliminar producto");
      }

      toast.success("Producto eliminado");
      loadProducts();
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Error al eliminar");
    }
  };
  return (
    <AdminShell>
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors w-fit"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver a la tienda
        </Link>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleLogout}
          className="gap-2 w-fit sm:ml-auto"
        >
          <LogOut className="size-4" />
          Salir
        </Button>
      </div>

      <div className="mb-10 text-center">
        <p className="text-sm uppercase tracking-widest text-accent mb-3">
          Administración
        </p>
        <h1 className="text-3xl md:text-4xl font-light text-foreground">
          Panel de productos
        </h1>
        {user?.email ? (
          <p className="mt-3 text-sm text-muted-foreground">{user.email}</p>
        ) : null}
      </div>

      <div className="flex items-center justify-center mb-8">
        <Button onClick={handleCreate} className="gap-2">
          <Plus className="size-4" />
          Nuevo producto
        </Button>
      </div>

      {loading ? (
        <p className="text-center text-muted-foreground">Cargando…</p>
      ) : products.length === 0 ? (
        <div className="max-w-xl mx-auto text-center">
          <p className="text-muted-foreground mb-6">
            No hay productos todavía.
          </p>
          <Button onClick={handleCreate} variant="outline" className="gap-2">
            <Plus className="size-4" />
            Crear el primero
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {products.map((product) => (
            <article
              key={product.uuid}
              className="rounded-xl border border-border bg-background overflow-hidden flex flex-col"
            >
              <div
                className="aspect-[4/3] bg-muted bg-cover bg-center"
                style={{ backgroundImage: `url(${product.image})` }}
              />
              <div className="p-6 flex flex-col gap-2 flex-1">
                <h3 className="text-lg font-medium text-foreground truncate">
                  {product.name}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {product.param1} · {product.param2}
                </p>
                <p className="text-base font-semibold text-foreground">
                  ${product.price.toFixed(2)}
                </p>
              </div>
              <div className="px-6 pb-6 flex items-center gap-2">
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="flex-1 gap-1.5"
                >
                  <Link href={`/admin/catalogo/${product.id}`}>
                    <Pencil className="size-3.5" />
                    Editar
                  </Link>
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(product.uuid)}
                  className="text-destructive hover:text-destructive shrink-0"
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
            </article>
          ))}
        </div>
      )}
    </AdminShell>
  );
}
