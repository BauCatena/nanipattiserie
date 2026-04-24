"use client"

import { useState } from "react"
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

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between h-20 md:h-32">
          <Link
            href="/"
            className="flex flex-col md:flex-row items-start md:items-center gap-0"
          >
            <div className="flex items-center h-11">
              <Image
                src={logo.src}
                alt={logo.alt}
                width={logo.widthDesktop}
                height={logo.heightDesktop}
                priority
                className="hidden md:block h-[12rem] w-[19rem]"
              />
              <Image
                src={logo.src}
                alt={logo.alt}
                width={logo.widthMobile}
                height={logo.heightMobile}
                priority
                className="md:hidden h-[4.5rem] w-[9.2rem]"
              />
            </div>
            <span className="text-xs text-muted-foreground tracking-wide md:hidden">
              {tagline}
            </span>
            <span className=" text-muted-foreground tracking-wide hidden md:block">
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
          <nav className="md:hidden py-4 border-t border-border">
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
