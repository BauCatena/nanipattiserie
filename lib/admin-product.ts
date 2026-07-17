import type { Json, Tables, TablesUpdate } from '@/types/supabase'
import { getProductGallery } from '@/lib/product-helpers'

type Product = Tables<'productos'>

export function getProductAttributes(product: Product): Record<string, string> {
  if (!product.atributes || typeof product.atributes !== 'object' || Array.isArray(product.atributes)) {
    return {}
  }
  const raw = product.atributes as Record<string, unknown>
  const result: Record<string, string> = {}
  for (const [key, value] of Object.entries(raw)) {
    if (value != null && value !== '') {
      result[key] = String(value)
    }
  }
  return result
}

export function buildAttributesUpdate(
  current: Product,
  changes: Partial<{ param1: string; param2: string }> & {
    extra?: Record<string, string>
    replaceExtra?: boolean
  }
): Json {
  const attrs = getProductAttributes(current)
  if (changes.param1 !== undefined) attrs.param1 = changes.param1
  if (changes.param2 !== undefined) attrs.param2 = changes.param2
  if (changes.extra) {
    if (changes.replaceExtra) {
      const { param1, param2 } = attrs
      const fresh: Record<string, string> = {}
      if (param1) fresh.param1 = param1
      if (param2) fresh.param2 = param2
      for (const [key, value] of Object.entries(changes.extra)) {
        if (value.trim()) fresh[key] = value.trim()
      }
      return fresh as Json
    }
    for (const [key, value] of Object.entries(changes.extra)) {
      if (value.trim()) {
        attrs[key] = value.trim()
      } else {
        delete attrs[key]
      }
    }
  }
  return attrs as Json
}

export function buildProductUpdate(
  product: Product,
  field: string,
  value: string | string[] | boolean
): TablesUpdate<'productos'> {
  switch (field) {
    case 'name':
      return { name: String(value) }
    case 'price':
      return { price: Number.parseFloat(String(value)) || 0 }
    case 'description':
      return { description: String(value) || null }
    case 'sold_out':
      return { sold_out: Boolean(value) }
    case 'param1':
      return { atributes: buildAttributesUpdate(product, { param1: String(value) }) }
    case 'param2':
      return { atributes: buildAttributesUpdate(product, { param2: String(value) }) }
    case 'images': {
      const urls = Array.isArray(value) ? value : []
      const primary = urls[0] ?? product.image
      return { images: urls as Json, image: primary }
    }
    default:
      if (field.startsWith('attr:')) {
        const key = field.slice(5)
        const extra = { ...getProductAttributes(product) }
        const strVal = String(value).trim()
        if (strVal) extra[key] = strVal
        else delete extra[key]
        return { atributes: extra as Json }
      }
      return {}
  }
}

export function getExtraAttributes(product: Product): { key: string; value: string }[] {
  const attrs = getProductAttributes(product)
  return Object.entries(attrs)
    .filter(([key]) => key !== 'param1' && key !== 'param2')
    .map(([key, value]) => ({ key, value }))
}

export { getProductGallery }
