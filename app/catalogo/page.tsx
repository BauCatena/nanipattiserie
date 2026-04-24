"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { ArrowLeft, ShoppingBag } from "lucide-react"

import { Header } from "@/components/Header"
import { Footer } from "@/components/Footer"
import { Card } from "@/components/Card"
import { Button } from "@/components/ui/button"
import { config } from "@/data/config"
import { loadProductsFromConfig } from "@/lib/load-products"
import type { Product } from "@/types/product"

const { catalogo: c } = config

const normalizeFilter = (value: string | null) => value?.trim().toLowerCase() ?? ""

export default function CatalogoPage() {
  const searchParams = useSearchParams()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  const selectedParam1 = searchParams.get("param1")
  const selectedParam2 = searchParams.get("param2")

  useEffect(() => {
    let cancelled = false

    ;(async () => {
      try {
        const list = await loadProductsFromConfig()
        if (!cancelled) setProducts(list)
      } catch {
        if (!cancelled) setProducts([])
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()

    return () => {
      cancelled = true
    }
  }, [])

  const filteredProducts = useMemo(() => {
    const normalizedParam1 = normalizeFilter(selectedParam1)
    const normalizedParam2 = normalizeFilter(selectedParam2)

    return products.filter((product) => {
      const matchesParam1 =
        normalizedParam1.length === 0 ||
        product.param1.trim().toLowerCase() === normalizedParam1
      const matchesParam2 =
        normalizedParam2.length === 0 ||
        product.param2.trim().toLowerCase() === normalizedParam2
      return matchesParam1 && matchesParam2
    })
  }, [products, selectedParam1, selectedParam2])

  return (
    <main className="min-h-screen">
      <Header {...config.header} />

      <div className="pt-16 md:pt-20">
        <section className="py-20 md:py-32 bg-secondary min-h-screen">
          <div className="container mx-auto px-4 md:px-6">
            <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors w-fit"
              >
                <ArrowLeft className="w-4 h-4" />
                {c.backToHome}
              </Link>
              <Link
                href="/carrito"
                className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors w-fit sm:ml-auto"
              >
                <ShoppingBag className="w-4 h-4" />
                {c.verCarrito}
              </Link>
            </div>

            <div className="mb-10 text-center">
              <p className="text-sm uppercase tracking-widest text-accent mb-3">{c.heroEyebrow}</p>
              <h1 className="text-3xl md:text-4xl font-light text-foreground">{c.pageTitle}</h1>
              {(selectedParam1 || selectedParam2) && (
                <p className="mt-3 text-sm text-muted-foreground">
                  {selectedParam1 ? `Tipo: ${selectedParam1}` : null}
                  {selectedParam1 && selectedParam2 ? " · " : null}
                  {selectedParam2 ? `Categoría: ${selectedParam2}` : null}
                </p>
              )}
            </div>

            {loading ? (
              <div className="text-center text-muted-foreground">{c.producto.loading}</div>
            ) : filteredProducts.length === 0 ? (
              <div className="max-w-xl mx-auto text-center">
                <p className="text-muted-foreground mb-6">{c.emptyMessage}</p>
                <Button asChild variant="outline">
                  <Link href="/">{c.backToHome}</Link>
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => {
                  const description =
                    product.description?.trim() || `${product.param1} · ${product.param2}`

                  return (
                    <article key={product.id} className="rounded-xl border border-border bg-background">
                        <Card
                          id={product.id}
                          titulo={product.name}
                          descripcion={description}
                          imagen={product.image}
                          precio={`$${product.price.toFixed(2)}`}
                        />
                    </article>
                  )
                })}
              </div>
            )}
          </div>
        </section>
        <Footer {...config.footer} />
      </div>
    </main>
  )
}
