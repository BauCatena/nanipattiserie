import { getProductAttributes } from '@/lib/admin-product'
import { normalizeProduct, type NormalizedProduct } from '@/lib/product-helpers'

export type AttributeOptions = {
  param1: string[]
  param2: string[]
  attributeKeys: string[]
  valuesByKey: Record<string, string[]>
}

function addCanonical(map: Map<string, string>, value: string) {
  const trimmed = value.trim()
  if (!trimmed) return
  const lower = trimmed.toLowerCase()
  if (!map.has(lower)) map.set(lower, trimmed)
}

function sortedValues(map: Map<string, string>): string[] {
  return [...map.values()].sort((a, b) => a.localeCompare(b, 'es'))
}

export function collectAttributeOptions(products: NormalizedProduct[]): AttributeOptions {
  const param1Map = new Map<string, string>()
  const param2Map = new Map<string, string>()
  const keyMap = new Map<string, string>()
  const valuesByKey = new Map<string, Map<string, string>>()

  for (const raw of products) {
    const product = normalizeProduct(raw)
    addCanonical(param1Map, product.param1)
    addCanonical(param2Map, product.param2)

    const attrs = getProductAttributes(product)
    for (const [rawKey, rawValue] of Object.entries(attrs)) {
      if (rawKey.toLowerCase() === 'param1' || rawKey.toLowerCase() === 'param2') continue

      addCanonical(keyMap, rawKey)
      const canonicalKey = keyMap.get(rawKey.trim().toLowerCase()) ?? rawKey.trim()

      if (!valuesByKey.has(canonicalKey)) valuesByKey.set(canonicalKey, new Map())
      addCanonical(valuesByKey.get(canonicalKey)!, rawValue)
    }
  }

  const valuesByKeySorted: Record<string, string[]> = {}
  for (const [key, valueMap] of valuesByKey) {
    valuesByKeySorted[key] = sortedValues(valueMap)
  }

  return {
    param1: sortedValues(param1Map),
    param2: sortedValues(param2Map),
    attributeKeys: sortedValues(keyMap),
    valuesByKey: valuesByKeySorted,
  }
}

/** Match existing option case-insensitively; keep canonical casing if found. */
export function resolveCanonicalValue(value: string, options: string[]): string {
  const trimmed = value.trim()
  if (!trimmed) return trimmed
  return options.find((o) => o.toLowerCase() === trimmed.toLowerCase()) ?? trimmed
}

export function resolveCanonicalKey(key: string, options: string[]): string {
  return resolveCanonicalValue(key, options)
}

export function valuesForKey(key: string, options: AttributeOptions): string[] {
  const trimmed = key.trim()
  if (!trimmed) return []

  const canonicalKey = resolveCanonicalKey(trimmed, options.attributeKeys)
  return options.valuesByKey[canonicalKey] ?? []
}

export function canonicalizeAttributeRows(
  rows: { key: string; value: string }[],
  options: AttributeOptions
): { key: string; value: string }[] {
  return rows
    .filter((r) => r.key.trim() && r.value.trim())
    .map((r) => {
      const key = resolveCanonicalKey(r.key, options.attributeKeys)
      const valueOptions = valuesForKey(key, options)
      const value = resolveCanonicalValue(r.value, valueOptions)
      return { key, value }
    })
}
