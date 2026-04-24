import type { Product } from "@/types/product"

export const CART_STORAGE_KEY = "optik-cart-v1"
export const CART_STORAGE_EVENT = "optik-cart-updated"

function notifyCartChanged() {
  if (typeof window === "undefined") return
  window.dispatchEvent(new Event(CART_STORAGE_EVENT))
}

export type CartLine = {
  productId: number
  quantity: number
}

function readRaw(): string | null {
  if (typeof window === "undefined") return null
  try {
    return window.localStorage.getItem(CART_STORAGE_KEY)
  } catch {
    return null
  }
}

function writeRaw(json: string) {
  if (typeof window === "undefined") return
  try {
    window.localStorage.setItem(CART_STORAGE_KEY, json)
  } catch {
    /* almacenamiento lleno o privado */
  }
}

export function getCartLines(): CartLine[] {
  const raw = readRaw()
  if (!raw) return []
  try {
    const parsed = JSON.parse(raw) as unknown
    if (!Array.isArray(parsed)) return []
    return parsed.filter(
      (row): row is CartLine =>
        row &&
        typeof row === "object" &&
        "productId" in row &&
        "quantity" in row &&
        typeof (row as CartLine).productId === "number" &&
        typeof (row as CartLine).quantity === "number" &&
        (row as CartLine).quantity > 0
    )
  } catch {
    return []
  }
}

function saveLines(lines: CartLine[]) {
  writeRaw(JSON.stringify(lines))
  notifyCartChanged()
}

export function setCartLines(lines: CartLine[]) {
  saveLines(
    lines.filter((l) => l.quantity > 0)
  )
}

export function addToCart(productId: number, quantity = 1) {
  if (quantity <= 0) return
  const current = getCartLines()
  const i = current.findIndex((l) => l.productId === productId)
  if (i === -1) {
    current.push({ productId, quantity })
  } else {
    const next = [...current]
    next[i] = { productId, quantity: next[i].quantity + quantity }
    saveLines(next)
    return
  }
  saveLines(current)
}

export function removeFromCart(productId: number) {
  saveLines(getCartLines().filter((l) => l.productId !== productId))
}

export function updateLineQuantity(productId: number, quantity: number) {
  if (quantity <= 0) {
    removeFromCart(productId)
    return
  }
  const lines = getCartLines().map((l) =>
    l.productId === productId ? { ...l, quantity } : l
  )
  setCartLines(lines)
}

export function buildCartWhatsappMessage(
  lines: { product: Product; quantity: number; lineTotal: number }[],
  total: number,
  template: string
): string {
  const itemLines = lines
    .map(
      (row) =>
        `• ${row.product.name} x${row.quantity} — $${row.lineTotal.toFixed(2)}`
    )
    .join("\n")
  return template
    .replace("{items}", itemLines)
    .replace("{total}", total.toFixed(2))
}
