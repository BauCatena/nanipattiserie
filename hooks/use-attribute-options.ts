'use client'

import { useEffect, useState } from 'react'
import type { AttributeOptions } from '@/lib/attribute-options'

const EMPTY_OPTIONS: AttributeOptions = {
  param1: [],
  param2: [],
  attributeKeys: [],
  valuesByKey: {},
}

export function useAttributeOptions(enabled = true) {
  const [options, setOptions] = useState<AttributeOptions>(EMPTY_OPTIONS)
  const [loading, setLoading] = useState(enabled)

  useEffect(() => {
    if (!enabled) return

    let cancelled = false
    ;(async () => {
      try {
        const res = await fetch('/api/admin/attribute-options')
        if (!res.ok) throw new Error('fetch failed')
        const data = (await res.json()) as AttributeOptions
        if (!cancelled) setOptions(data)
      } catch {
        if (!cancelled) setOptions(EMPTY_OPTIONS)
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()

    return () => {
      cancelled = true
    }
  }, [enabled])

  const refresh = async () => {
    const res = await fetch('/api/admin/attribute-options')
    if (res.ok) setOptions((await res.json()) as AttributeOptions)
  }

  return { options, loading, refresh }
}
