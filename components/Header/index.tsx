"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { SiteConfig } from "@/data/config"

export type HeaderProps = SiteConfig["header"]

export function Header({
  logo,
  tagline,
  navDesktop,
  navMobile,
  menuOpenAria,
  menuCloseAria,
}: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isVisible, setIsVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY

      // Si bajamos (current > last) y pasamos de 50px, escondemos el header
      if (currentScrollY > lastScrollY && currentScrollY > 50) {
        setIsVisible(false)
        setIsMenuOpen(false) // Opcional: cierra el menú mobile si estaba abierto
      } 
      // Si subimos (current < last) o estamos hasta arriba, lo mostramos
      else if (currentScrollY < lastScrollY || currentScrollY <= 0) {
        setIsVisible(true)
      }

      // Actualizamos la última posición
      setLastScrollY(currentScrollY)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [lastScrollY]) // Es importante poner lastScrollY en las dependencias

  return (
    <header 
      // Aquí definimos la altura: h-24 para mobile (96px) y md:h-32 para desktop (128px)
      className={` w-full fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border transition-transform duration-300 h-24 md:h-32 ${
        isVisible ? "translate-y-0" : "-translate-y-full md:translate-y-0"
      }`}
    >
      {/* Agregamos h-full para que el contenedor ocupe todo el alto del header */}
      <div className="container mx-auto md:px-6 h-full w-full">
        {/* Cambiamos las alturas fijas por h-full para que herede la altura del padre */}
        <div className="flex items-center justify-between h-full">
          <Link
            href="/"
            className="flex flex-col md:flex-row items-start md:items-center gap-0"
          >
            <div className="flex items-center h-11 pl-3">
              <Image
                src={logo.src}
                alt={logo.alt}
                width={logo.widthDesktop}
                height={logo.heightDesktop}
                priority
                className="hidden md:block p-1 h-[7rem] w-[7rem] rounded-full border border-gray-400"
              />
              <Image
                src={logo.src}
                alt={logo.alt}
                width={logo.widthMobile}
                height={logo.heightMobile}
                priority
                // Ajusté un poco el margen superior (mt) para que quede mejor centrado con el h-24
                className="md:hidden h-[5rem] w-[5rem] rounded-full border border-gray-400 mt-2"
              />
            </div>
            <span className="text-xs text-muted-foreground tracking-wide md:hidden mt-1">
              {tagline}
            </span>
            <span className="text-muted-foreground tracking-wide hidden md:block">
              {tagline}
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            {navDesktop.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? menuCloseAria : menuOpenAria}
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>

        {isMenuOpen && (
          <nav className="md:hidden pl-3 py-4 w-full border-t border-border bg-background relative">
            <div className="flex flex-col gap-4">
              {navMobile.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </nav>
        )}
      </div>
    </header>
  )
}