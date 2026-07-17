import React from 'react'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { config } from '@/data/config'

type AdminShellProps = {
  children: React.ReactNode
  showFooter?: boolean
}

export function AdminShell({ children, showFooter = true }: AdminShellProps) {
  return (
    <main className="min-h-screen">
      <Header {...config.header} />
      <div className="pt-16 md:pt-20">
        <section className="py-20 md:py-32 bg-secondary min-h-screen">
          <div className="container mx-auto px-4 md:px-6">{children}</div>
        </section>
        {showFooter ? <Footer {...config.footer} /> : null}
      </div>
    </main>
  )
}
