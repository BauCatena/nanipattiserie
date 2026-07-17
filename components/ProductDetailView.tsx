'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Instagram, Phone, ShoppingBag } from 'lucide-react'
import { toast } from 'sonner'

import { ProductGallery } from '@/components/ProductGallery'
import { EditableField } from '@/components/admin/EditableField'
import { EditableAttributes, EditableGallery } from '@/components/admin/AdminEditControls'
import { Button } from '@/components/ui/button'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { config } from '@/data/config'
import {
  buildAttributesUpdate,
  buildProductUpdate,
  getExtraAttributes,
  getProductGallery,
} from '@/lib/admin-product'
import { buildConsultMessage } from '@/lib/build-consult-message'
import { buildInstagramDmUrl, buildWhatsAppUrl } from '@/lib/contact-urls'
import { addToCart } from '@/lib/cart-storage'
import { createBrowserSupabaseClient } from '@/lib/supabase-browser'
import { resolveCanonicalValue } from '@/lib/attribute-options'
import { normalizeProduct, type NormalizedProduct } from '@/lib/product-helpers'
import { useAttributeOptions } from '@/hooks/use-attribute-options'
import type { Tables } from '@/types/supabase'

type Product = Tables<'productos'>

const { catalogo: c } = config

type ProductDetailViewProps = {
  product: NormalizedProduct
  mode?: 'customer' | 'admin'
  userId?: string
  onProductChange?: (product: NormalizedProduct) => void
  backHref?: string
  backLabel?: string
  secondaryHref?: string
  secondaryLabel?: string
}

export function ProductDetailView({
  product,
  mode = 'customer',
  userId,
  onProductChange,
  backHref = '/catalogo',
  backLabel = c.producto.backToCatalog,
  secondaryHref = '/carrito',
  secondaryLabel = c.verCarrito,
}: ProductDetailViewProps) {
  const isAdmin = mode === 'admin'
  const [justAdded, setJustAdded] = useState(false)
  const { options: attributeOptions, refresh: refreshAttributeOptions } = useAttributeOptions(isAdmin)

  useEffect(() => {
    if (isAdmin) {
      toast.info('Modo administrador — hacé clic en el lápiz para editar', {
        duration: 5000,
      })
    }
  }, [isAdmin])

  const gallery = getProductGallery(product)
  const description = product.description?.trim() || c.producto.noDescription
  const extraAttrs = getExtraAttributes(product)

  const syncCache = async () => {
    await fetch('/api/admin/sync', { method: 'POST' })
  }

  const updateField = async (field: string, value: string | string[]) => {
    const supabase = createBrowserSupabaseClient()
    const update = buildProductUpdate(product, field, value)
    const { data, error } = await supabase
      .from('productos')
      .update(update)
      .eq('uuid', product.uuid)
      .select()
      .single()

    if (error) {
      toast.error('Error al guardar')
      throw error
    }

    const updated = normalizeProduct({ ...product, ...data })
    onProductChange?.(updated)
    await syncCache()
    await refreshAttributeOptions()
    toast.success('Guardado')
  }

  const updateParam = async (field: 'param1' | 'param2', value: string) => {
    const suggestions = field === 'param1' ? attributeOptions.param1 : attributeOptions.param2
    const canonical = resolveCanonicalValue(value, suggestions)
    await updateField(field, canonical)
  }

  const updateExtraAttributes = async (attrs: { key: string; value: string }[]) => {
    const extra: Record<string, string> = {}
    for (const { key, value } of attrs) {
      extra[key] = value
    }
    const supabase = createBrowserSupabaseClient()
    const merged = buildAttributesUpdate(product, { extra, replaceExtra: true })
    const { data, error } = await supabase
      .from('productos')
      .update({ atributes: merged })
      .eq('uuid', product.uuid)
      .select()
      .single()

    if (error) {
      toast.error('Error al guardar')
      throw error
    }

    const updated = normalizeProduct({ ...product, ...data })
    onProductChange?.(updated)
    await syncCache()
    await refreshAttributeOptions()
    toast.success('Guardado')
  }

  const onConsultInstagram = (p: Product) => {
    const text = buildConsultMessage(p, c.consult)
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(text).catch(() => {})
    }
    window.open(buildInstagramDmUrl(c.instagramUser), '_blank', 'noopener,noreferrer')
  }

  const onConsultWhatsApp = (p: Product) => {
    const text = buildConsultMessage(p, c.consult)
    window.open(buildWhatsAppUrl(c.whatsappPhoneE164, text), '_blank', 'noopener,noreferrer')
  }

  const onAddToCart = (p: Product) => {
    addToCart(p.id, 1)
    setJustAdded(true)
    window.setTimeout(() => setJustAdded(false), 2000)
  }

  return (
    <main className="min-h-screen">
      <Header {...config.header} />

      <div className="pt-16 md:pt-20">
        <section className="py-20 md:py-32 bg-secondary min-h-screen">
          <div className="container mx-auto px-4 md:px-6">
            <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <Link
                href={backHref}
                className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors w-fit"
              >
                <ArrowLeft className="w-4 h-4" />
                {backLabel}
              </Link>
              {!isAdmin && (
                <Link
                  href={secondaryHref}
                  className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors w-fit sm:ml-auto"
                >
                  <ShoppingBag className="w-4 h-4" />
                  {secondaryLabel}
                </Link>
              )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12 max-w-5xl mx-auto">
              {isAdmin && userId ? (
                <EditableGallery
                  images={gallery}
                  alt={product.name}
                  userId={userId}
                  onSave={(urls) => updateField('images', urls)}
                />
              ) : (
                <ProductGallery images={gallery} alt={product.name} />
              )}

              <div className="flex flex-col gap-4">
                <p className="text-sm uppercase tracking-widest text-accent">
                  {isAdmin ? 'Administración' : c.producto.detalleEyebrow}
                </p>

                <div className="flex items-start gap-2">
                  <h1 className="text-3xl md:text-4xl font-light text-foreground text-balance flex-1">
                    {product.name}
                  </h1>
                  {isAdmin && (
                    <EditableField
                      label="nombre"
                      value={product.name}
                      onSave={(v) => updateField('name', v)}
                    />
                  )}
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs px-2 py-1 rounded-full bg-background border border-border text-muted-foreground inline-flex items-center gap-1">
                    {product.param1}
                    {isAdmin && (
                      <EditableField
                        label="param1"
                        value={product.param1}
                        suggestions={attributeOptions.param1}
                        onSave={(v) => updateParam('param1', v)}
                      />
                    )}
                  </span>
                  <span className="text-xs px-2 py-1 rounded-full bg-background border border-border text-muted-foreground inline-flex items-center gap-1">
                    {product.param2}
                    {isAdmin && (
                      <EditableField
                        label="param2"
                        value={product.param2}
                        suggestions={attributeOptions.param2}
                        onSave={(v) => updateParam('param2', v)}
                      />
                    )}
                  </span>
                </div>

                {isAdmin && (
                  <EditableAttributes
                    attributes={extraAttrs}
                    onSave={updateExtraAttributes}
                    attributeOptions={attributeOptions}
                  />
                )}

                <div className="flex items-center gap-2">
                  <p className="text-2xl font-semibold text-foreground">
                    ${product.price.toFixed(2)}
                  </p>
                  {isAdmin && (
                    <EditableField
                      label="precio"
                      value={String(product.price)}
                      type="number"
                      onSave={(v) => updateField('price', v)}
                    />
                  )}
                </div>

                <div className="flex items-start gap-2">
                  <p className="text-sm md:text-base text-muted-foreground text-pretty flex-1">
                    {description}
                  </p>
                  {isAdmin && (
                    <EditableField
                      label="descripción"
                      value={product.description ?? ''}
                      multiline
                      onSave={(v) => updateField('description', v)}
                    />
                  )}
                </div>

                {!isAdmin && (
                  <>
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
                      <p className="text-xs text-muted-foreground text-center mt-2">
                        {c.producto.addToCartHint}
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </section>

        <Footer {...config.footer} />
      </div>
    </main>
  )
}