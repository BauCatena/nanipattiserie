import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'
import { syncProductsFromSupabase } from '@/lib/sync-products'

export async function POST() {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const products = await syncProductsFromSupabase(user.id)
    return NextResponse.json({ synced: products.length })
  } catch (error) {
    console.error('Sync error:', error)
    return NextResponse.json({ error: 'Sync failed' }, { status: 500 })
  }
}
