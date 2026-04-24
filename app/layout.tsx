import React from "react"
import type { Metadata } from "next"
import { Inter, Open_Sans } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { config } from "@/data/config"
import "./globals.css"

const openSans = Open_Sans({ 
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});
const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
})

const fontClassByKey = {
  Open_Sans: openSans.className,
  Inter: inter.className,
} as const

export const metadata: Metadata = {
  title: config.meta.title,
  description: config.meta.description,
  generator: "v0.app",
  icons: {
    icon: [
      {
        url: '/logo2.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const { theme } = config
  const rootStyle = {
    "--app-font-sans": theme.typography.fontSansVar,
    "--app-font-mono": theme.typography.fontMonoVar,
    "--app-background": theme.colors.light.background,
    "--app-foreground": theme.colors.light.foreground,
    "--app-card": theme.colors.light.card,
    "--app-card-foreground": theme.colors.light.cardForeground,
    "--app-popover": theme.colors.light.popover,
    "--app-popover-foreground": theme.colors.light.popoverForeground,
    "--app-primary": theme.colors.light.primary,
    "--app-primary-foreground": theme.colors.light.primaryForeground,
    "--app-secondary": theme.colors.light.secondary,
    "--app-secondary-foreground": theme.colors.light.secondaryForeground,
    "--app-muted": theme.colors.light.muted,
    "--app-muted-foreground": theme.colors.light.mutedForeground,
    "--app-accent": theme.colors.light.accent,
    "--app-accent-foreground": theme.colors.light.accentForeground,
    "--app-destructive": theme.colors.light.destructive,
    "--app-destructive-foreground": theme.colors.light.destructiveForeground,
    "--app-border": theme.colors.light.border,
    "--app-input": theme.colors.light.input,
    "--app-ring": theme.colors.light.ring,
    "--app-chart-1": theme.colors.light.chart1,
    "--app-chart-2": theme.colors.light.chart2,
    "--app-chart-3": theme.colors.light.chart3,
    "--app-chart-4": theme.colors.light.chart4,
    "--app-chart-5": theme.colors.light.chart5,
    "--app-radius": theme.colors.radius,
    "--app-sidebar": theme.colors.light.sidebar,
    "--app-sidebar-foreground": theme.colors.light.sidebarForeground,
    "--app-sidebar-primary": theme.colors.light.sidebarPrimary,
    "--app-sidebar-primary-foreground": theme.colors.light.sidebarPrimaryForeground,
    "--app-sidebar-accent": theme.colors.light.sidebarAccent,
    "--app-sidebar-accent-foreground": theme.colors.light.sidebarAccentForeground,
    "--app-sidebar-border": theme.colors.light.sidebarBorder,
    "--app-sidebar-ring": theme.colors.light.sidebarRing,
    "--app-dark-background": theme.colors.dark.background,
    "--app-dark-foreground": theme.colors.dark.foreground,
    "--app-dark-card": theme.colors.dark.card,
    "--app-dark-card-foreground": theme.colors.dark.cardForeground,
    "--app-dark-popover": theme.colors.dark.popover,
    "--app-dark-popover-foreground": theme.colors.dark.popoverForeground,
    "--app-dark-primary": theme.colors.dark.primary,
    "--app-dark-primary-foreground": theme.colors.dark.primaryForeground,
    "--app-dark-secondary": theme.colors.dark.secondary,
    "--app-dark-secondary-foreground": theme.colors.dark.secondaryForeground,
    "--app-dark-muted": theme.colors.dark.muted,
    "--app-dark-muted-foreground": theme.colors.dark.mutedForeground,
    "--app-dark-accent": theme.colors.dark.accent,
    "--app-dark-accent-foreground": theme.colors.dark.accentForeground,
    "--app-dark-destructive": theme.colors.dark.destructive,
    "--app-dark-destructive-foreground": theme.colors.dark.destructiveForeground,
    "--app-dark-border": theme.colors.dark.border,
    "--app-dark-input": theme.colors.dark.input,
    "--app-dark-ring": theme.colors.dark.ring,
    "--app-dark-chart-1": theme.colors.dark.chart1,
    "--app-dark-chart-2": theme.colors.dark.chart2,
    "--app-dark-chart-3": theme.colors.dark.chart3,
    "--app-dark-chart-4": theme.colors.dark.chart4,
    "--app-dark-chart-5": theme.colors.dark.chart5,
    "--app-dark-sidebar": theme.colors.dark.sidebar,
    "--app-dark-sidebar-foreground": theme.colors.dark.sidebarForeground,
    "--app-dark-sidebar-primary": theme.colors.dark.sidebarPrimary,
    "--app-dark-sidebar-primary-foreground": theme.colors.dark.sidebarPrimaryForeground,
    "--app-dark-sidebar-accent": theme.colors.dark.sidebarAccent,
    "--app-dark-sidebar-accent-foreground": theme.colors.dark.sidebarAccentForeground,
    "--app-dark-sidebar-border": theme.colors.dark.sidebarBorder,
    "--app-dark-sidebar-ring": theme.colors.dark.sidebarRing,
  } as React.CSSProperties

  return (
    <html lang="en" style={rootStyle}>
      <body className={`${fontClassByKey[theme.typography.googleFont]} antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
