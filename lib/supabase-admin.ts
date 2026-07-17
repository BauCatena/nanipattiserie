import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/supabase'

export class AdminConfigError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'AdminConfigError'
  }
}

/** Server-only client with service role — never import in client components. */
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim()

  if (!url) {
    throw new AdminConfigError('Missing NEXT_PUBLIC_SUPABASE_URL')
  }
  if (!key) {
    throw new AdminConfigError('Missing SUPABASE_SERVICE_ROLE_KEY')
  }

  return createClient<Database>(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  })
}

/**
 * Find an auth user by email (paginates through all users).
 */
export async function findUserByEmail(email: string) {
  const admin = createAdminClient()
  const normalized = email.trim().toLowerCase()
  let page = 1
  const perPage = 200

  while (true) {
    const { data, error } = await admin.auth.admin.listUsers({ page, perPage })
    if (error) throw error

    const user = data.users.find((u) => u.email?.trim().toLowerCase() === normalized)
    if (user) return user

    if (data.users.length < perPage) break
    page += 1
  }

  return null
}
