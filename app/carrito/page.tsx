"use client"

import { useCallback, useEffect, useState } from "react"
import Link from "next/link"
import { ArrowLeft, Phone, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Header } from "@/components/Header"
import { config } from "@/data/config"
import { loadProductsFromConfig } from "@/lib/load-products"
import {
  CART_STORAGE_EVENT,
  CART_STORAGE_KEY,
  getCartLines,
  removeFromCart,
  buildCartWhatsappMessage,
} from "@/lib/cart-storage"
import { buildWhatsAppUrl } from "@/lib/contact-urls"
import type { Product } from "@/types/product"

const { carrito, catalogo, header, meta: siteMeta } = config

export default function CarritoPage() {
  const [rows, setRows] = useState<
    { product: Product; quantity: number; lineTotal: number }[]
  >([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(() => {
    const lines = getCartLines()
    if (lines.length === 0) {
      setRows([])
      setTotal(0)
      setLoading(false)
      return
    }
    ;(async () => {
      try {
        const all = await loadProductsFromConfig()
        const byId = new Map(all.map((p) => [p.id, p]))
        const next: { product: Product; quantity: number; lineTotal: number }[] =
          []
        let sum = 0
        for (const line of lines) {
          const p = byId.get(line.productId)
          if (!p) continue
          const lineTotal = p.price * line.quantity
          sum += lineTotal
          next.push({ product: p, quantity: line.quantity, lineTotal })
        }
        setRows(next)
        setTotal(sum)
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  useEffect(() => {
    document.title = `${carrito.pageTitle} | ${siteMeta.title}`
  }, [carrito.pageTitle, siteMeta.title])

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === CART_STORAGE_KEY || e.key === null) refresh()
    }
    const onLocal = () => refresh()
    window.addEventListener("storage", onStorage)
    window.addEventListener(CART_STORAGE_EVENT, onLocal)
    return () => {
      window.removeEventListener("storage", onStorage)
      window.removeEventListener(CART_STORAGE_EVENT, onLocal)
    }
  }, [refresh])

  const message = buildCartWhatsappMessage(rows, total, carrito.whatsappMessageTemplate)
  const wa = buildWhatsAppUrl(catalogo.whatsappPhoneE164, message)

  return (
    <main className="min-h-screen">
      <Header {...header} />

      <div className="pt-16 md:pt-20">
        <section className="py-20 md:py-32 bg-secondary min-h-screen">
          <div className="container mx-auto px-4 md:px-6 max-w-3xl">
            <div className="mb-8">
              <Link
                href="/catalogo"
                className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                {carrito.backToCatalog}
              </Link>
            </div>

            <div className="text-center mb-10">
              <p className="text-sm uppercase tracking-widest text-accent mb-4">
                {carrito.heroEyebrow}
              </p>
              <h1 className="text-3xl md:text-4xl font-light text-foreground text-balance">
                {carrito.pageTitle}
              </h1>
            </div>

            {loading ? (
              <p className="text-center text-muted-foreground">
                {catalogo.producto.loading}
              </p>
            ) : rows.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                {carrito.emptyMessage}
              </p>
            ) : (
              <div className="space-y-6">
                <div className="rounded-lg border border-border bg-card overflow-hidden">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border bg-muted/50 text-left text-muted-foreground">
                        <th className="p-3 font-medium">{carrito.tableProduct}</th>
                        <th className="p-3 font-medium w-16 text-center">
                          {carrito.tableQty}
                        </th>
                        <th className="p-3 font-medium w-24 text-right">
                          {carrito.tableUnit}
                        </th>
                        <th className="p-3 font-medium w-24 text-right">
                          {carrito.tableSubtotal}
                        </th>
                        <th className="p-2 w-12" />
                      </tr>
                    </thead>
                    <tbody>
                      {rows.map((row) => (
                        <tr
                          key={row.product.id}
                          className="border-b border-border last:border-0"
                        >
                          <td className="p-3 text-foreground">
                            <Link
                              href={`/catalogo/${row.product.id}`}
                              className="hover:underline"
                            >
                              {row.product.name}
                            </Link>
                          </td>
                          <td className="p-3 text-center text-muted-foreground">
                            {row.quantity}
                          </td>
                          <td className="p-3 text-right text-muted-foreground">
                            ${row.product.price.toFixed(2)}
                          </td>
                          <td className="p-3 text-right font-medium text-foreground">
                            ${row.lineTotal.toFixed(2)}
                          </td>
                          <td className="p-2">
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-destructive hover:text-destructive"
                              aria-label={carrito.removeLineAria}
                              onClick={() => removeFromCart(row.product.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 rounded-lg border border-border bg-card">
                  <p className="text-lg text-foreground">
                    <span className="text-muted-foreground text-sm block sm:inline sm:mr-2">
                      {carrito.estimatedLabel}
                    </span>
                    <span className="font-semibold">${total.toFixed(2)}</span>
                  </p>
                  <Button
                    type="button"
                    className="w-full sm:w-auto gap-2"
                    onClick={() =>
                      window.open(wa, "_blank", "noopener,noreferrer")
                    }
                  >
                    <Phone className="h-4 w-4" />
                    {carrito.sendWhatsAppLabel}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  )
}
