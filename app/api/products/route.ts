import { NextResponse } from 'next/server'
import { fetchProductsFromSupabase } from '@/lib/sync-products'
import { normalizeProduct } from '@/lib/product-helpers'

export async function GET() {
  try {
    const ownerId = process.env.OWNER_ID || null
    const products = await fetchProductsFromSupabase(ownerId)
    const normalized = products.map(normalizeProduct)
    return NextResponse.json(normalized)
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 })
  }
}
