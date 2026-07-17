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
  adminLink,
  menuOpenAria,
  menuCloseAria,
}: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const navItemClass =
    "inline-flex items-center justify-center h-8 px-3 rounded-md border border-border bg-background text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"

  const allDesktopItems = [...navDesktop, adminLink]

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

          <nav className="hidden md:flex items-center gap-3">
            {allDesktopItems.map((item) => (
              <Link key={item.href} href={item.href} className={navItemClass}>
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2 md:hidden">
            <Link href={adminLink.href} className={navItemClass}>
              {adminLink.label}
            </Link>
            <Button
              variant="outline"
              size="icon"
              className="size-8 shrink-0"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label={isMenuOpen ? menuCloseAria : menuOpenAria}
            >
              {isMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {isMenuOpen && (
          <nav className="md:hidden py-4 border-t border-border">
            <div className="flex flex-col gap-3">
              {navMobile.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`${navItemClass} w-full`}
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
