'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { AdminShell } from '@/layouts/AdminShell'
import { createBrowserSupabaseClient } from '@/lib/supabase-browser'

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const supabase = createBrowserSupabaseClient()
    const trimmedEmail = email.trim()

    // 1. Normal login (returning admin with password already set)
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: trimmedEmail,
      password,
    })

    if (!signInError) {
      router.replace('/admin')
      router.refresh()
      return
    }

    // 2. First-time setup: admin pre-created the email, user picks a password now
    let setupRes: Response
    try {
      setupRes = await fetch('/api/admin/setup-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: trimmedEmail, password }),
      })
    } catch {
      toast.error('No se pudo conectar con el servidor. Revisá la configuración.')
      setLoading(false)
      return
    }

    if (!setupRes.ok) {
      const body = (await setupRes.json().catch(() => ({}))) as { error?: string }
      toast.error(body.error ?? 'Email o contraseña incorrectos')
      setLoading(false)
      return
    }

    // 3. Sign in with the password just set
    const { error: retryError } = await supabase.auth.signInWithPassword({
      email: trimmedEmail,
      password,
    })

    if (retryError) {
      toast.error('Contraseña guardada, pero no se pudo iniciar sesión. Intentá de nuevo.')
      setLoading(false)
      return
    }

    toast.success('Contraseña configurada')
    router.replace('/admin')
    router.refresh()
  }

  return (
    <AdminShell>
      <div className="mb-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors w-fit"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver a la tienda
        </Link>
      </div>

      <div className="max-w-sm mx-auto">
        <div className="mb-8 text-center">
          <p className="text-sm uppercase tracking-widest text-accent mb-3">Administración</p>
          <h1 className="text-3xl md:text-4xl font-light text-foreground">Ingresar</h1>
          <p className="text-sm text-muted-foreground mt-3">
            Primera vez: ingresá tu email y elegí una contraseña.
            <br />
            Después, usá siempre la misma.
          </p>
        </div>

        <div className="rounded-xl border border-border bg-background p-8">
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@ejemplo.com"
                required
                autoComplete="email"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                minLength={6}
                autoComplete="new-password"
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Ingresando…' : 'Ingresar'}
            </Button>
          </form>
        </div>
      </div>
    </AdminShell>
  )
}
