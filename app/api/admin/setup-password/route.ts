import { NextResponse } from 'next/server'
import { AdminConfigError, createAdminClient, findUserByEmail } from '@/lib/supabase-admin'

export async function POST(request: Request) {
  try {
    const { email, password } = (await request.json()) as {
      email?: string
      password?: string
    }

    const normalizedEmail = email?.trim().toLowerCase()
    if (!normalizedEmail || !password || password.length < 6) {
      return NextResponse.json(
        { error: 'Email y contraseña requeridos (mínimo 6 caracteres)' },
        { status: 400 }
      )
    }

    const user = await findUserByEmail(normalizedEmail)

    if (!user) {
      return NextResponse.json({ error: 'Email no autorizado' }, { status: 403 })
    }

    if (user.last_sign_in_at) {
      return NextResponse.json(
        { error: 'Este usuario ya tiene contraseña. Usá la que configuraste.' },
        { status: 403 }
      )
    }

    const admin = createAdminClient()
    const { error: updateError } = await admin.auth.admin.updateUserById(user.id, {
      password,
    })

    if (updateError) {
      console.error('setup-password updateUserById:', updateError.message)
      return NextResponse.json({ error: 'No se pudo guardar la contraseña' }, { status: 500 })
    }

    return NextResponse.json({ ok: true })
  } catch (error) {
    if (error instanceof AdminConfigError) {
      console.error('setup-password config:', error.message)
      return NextResponse.json({ error: error.message }, { status: 503 })
    }

    console.error('setup-password:', error)
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}
