"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { ArrowLeft, Instagram, Phone, ShoppingBag } from "lucide-react"

import { ProductGallery } from "@/components/ProductGallery"
import { Button } from "@/components/ui/button"
import { Header } from "@/components/Header"
import { config } from "@/data/config"
import { loadProductsFromConfig } from "@/lib/load-products"
import { getProductGallery } from "@/lib/product-helpers"
import { buildConsultMessage } from "@/lib/build-consult-message"
import { buildInstagramDmUrl, buildWhatsAppUrl } from "@/lib/contact-urls"
import { addToCart } from "@/lib/cart-storage"
import type { Product } from "@/types/product"

const { catalogo: c } = config

export default function ProductoDetallePage() {
  const params = useParams()
  const rawId = params?.id
  const idStr = Array.isArray(rawId) ? rawId[0] : rawId
  const id = idStr ? Number.parseInt(idStr, 10) : NaN

  const [product, setProduct] = useState<Product | null | undefined>(undefined)
  const [justAdded, setJustAdded] = useState(false)

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

  const onConsultInstagram = (p: Product) => {
    const text = buildConsultMessage(p, c.consult)
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(text).catch(() => {})
    }
    window.open(
      buildInstagramDmUrl(c.instagramUser),
      "_blank",
      "noopener,noreferrer"
    )
  }

  const onConsultWhatsApp = (p: Product) => {
    const text = buildConsultMessage(p, c.consult)
    window.open(
      buildWhatsAppUrl(c.whatsappPhoneE164, text),
      "_blank",
      "noopener,noreferrer"
    )
  }

  const onAddToCart = (p: Product) => {
    addToCart(p.id, 1)
    setJustAdded(true)
    window.setTimeout(() => setJustAdded(false), 2000)
  }

  if (product === undefined) {
    return (
      <main className="min-h-screen">
        <Header {...config.header} />
        <div className="pt-16 md:pt-20 min-h-[50vh] flex items-center justify-center text-muted-foreground">
          {c.producto.loading}
        </div>
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
              <Button asChild variant="outline">
                <Link href="/catalogo">{c.producto.notFoundCta}</Link>
              </Button>
            </div>
          </section>
        </div>
      </main>
    )
  }

  const gallery = getProductGallery(product)
  const description = product.description?.trim() || c.producto.noDescription

  return (
    <main className="min-h-screen">
      <Header {...config.header} />

      <div className="pt-16 md:pt-20">
        <section className="py-20 md:py-32 bg-secondary min-h-screen">
          <div className="container mx-auto px-4 md:px-6">
            <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <Link
                href="/catalogo"
                className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors w-fit"
              >
                <ArrowLeft className="w-4 h-4" />
                {c.producto.backToCatalog}
              </Link>
              <Link
                href="/carrito"
                className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors w-fit sm:ml-auto"
              >
                <ShoppingBag className="w-4 h-4" />
                {c.verCarrito}
              </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12 max-w-5xl mx-auto">
              <ProductGallery images={gallery} alt={product.name} />

              <div className="flex flex-col gap-4">
                <p className="text-sm uppercase tracking-widest text-accent">
                  {c.producto.detalleEyebrow}
                </p>
                <h1 className="text-3xl md:text-4xl font-light text-foreground text-balance">
                  {product.name}
                </h1>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs px-2 py-1 rounded-full bg-background border border-border text-muted-foreground">
                    {product.param1}
                  </span>
                  <span className="text-xs px-2 py-1 rounded-full bg-background border border-border text-muted-foreground">
                    {product.param2}
                  </span>
                </div>
                <p className="text-2xl font-semibold text-foreground">
                  ${product.price.toFixed(2)}
                </p>
                <p className="text-sm md:text-base text-muted-foreground text-pretty">
                  {description}
                </p>

                <div className="flex flex-col sm:flex-row gap-3 mt-2">
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full sm:flex-1 justify-center gap-2"
                    onClick={() => onConsultInstagram(product)}
                  >
                    <Instagram className="w-4 h-4" />
                    {c.consultButtonLabel}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full sm:flex-1 justify-center gap-2"
                    onClick={() => onConsultWhatsApp(product)}
                  >
                    <Phone className="w-4 h-4" />
                    {c.producto.consultWhatsApp}
                  </Button>
                </div>

                <div className="pt-2 border-t border-border/60">
                  <Button
                    type="button"
                    className="w-full justify-center"
                    onClick={() => onAddToCart(product)}
                  >
                    {c.producto.addToCart}
                  </Button>
                  {justAdded ? (
                    <p className="text-xs text-accent text-center mt-2" aria-live="polite">
                      {c.producto.addedFeedback}
                    </p>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}
