"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"

import { ProductDetailView } from "@/components/ProductDetailView"
import { Header } from "@/components/Header"
import { Footer } from "@/components/Footer"
import { config } from "@/data/config"
import { loadProductsFromConfig } from "@/lib/load-products"
import type { NormalizedProduct } from "@/lib/product-helpers"

const { catalogo: c } = config

export default function ProductoDetallePage() {
  const params = useParams()
  const rawId = params?.id
  const idStr = Array.isArray(rawId) ? rawId[0] : rawId
  const id = idStr ? Number.parseInt(idStr, 10) : NaN

  const [product, setProduct] = useState<NormalizedProduct | null | undefined>(undefined)

  useEffect(() => {
    let cancel = false
    ;(async () => {
      if (!Number.isFinite(id) || id < 1) {
        if (!cancel) setProduct(null)
        return
      }
      try {
        const list = await loadProductsFromConfig()
        const found = list.find((p) => p.id === id) ?? null
        if (!cancel) setProduct(found)
      } catch {
        if (!cancel) setProduct(null)
      }
    })()
    return () => {
      cancel = true
    }
  }, [id])

  if (product === undefined) {
    return (
      <main className="min-h-screen">
        <Header {...config.header} />
        <div className="pt-16 md:pt-20 min-h-[50vh] flex items-center justify-center text-muted-foreground">
          {c.producto.loading}
        </div>
        <Footer {...config.footer} />
      </main>
    )
  }

  if (product === null) {
    return (
      <main className="min-h-screen">
        <Header {...config.header} />
        <div className="pt-16 md:pt-20">
          <section className="py-20 md:py-32 bg-secondary min-h-screen">
            <div className="container mx-auto px-4 md:px-6 text-center">
              <h1 className="text-2xl font-light text-foreground mb-4">
                {c.producto.notFoundTitle}
              </h1>
              <a
                href="/catalogo"
                className="inline-flex items-center justify-center rounded-md border border-border px-4 py-2 text-sm hover:bg-muted transition-colors"
              >
                {c.producto.notFoundCta}
              </a>
            </div>
          </section>
        </div>
        <Footer {...config.footer} />
      </main>
    )
  }

  return <ProductDetailView product={product} mode="customer" />
}
