/**
 * Contenido central de la web. Editar textos, enlaces y secciones desde aquí.
 * El orden de bloques en `MainLayout` define el orden visual en el inicio.
 */

export const iconNameSchema = [
  "userCheck",
  "sparkles",
  "shield",
] as const

export type BenefitIconName = (typeof iconNameSchema)[number]

export type NavItem = {
  label: string
  href: string
}

export type SocialPlatform = "instagram" | "facebook"

export type SocialLink = {
  name: string
  href: string
  platform: SocialPlatform
}

export type FaqItem = {
  question: string
  answer: string
}

export type SiteConfig = {
  meta: {
    title: string
    description: string
  }
  theme: {
    typography: {
      /** Debe existir en el mapa de fuentes de `app/layout.tsx`. */
      googleFont: "Open_Sans" | "Inter"
      fontSansVar: string
      fontMonoVar: string
    }
    colors: {
      light: {
        background: string
        foreground: string
        card: string
        cardForeground: string
        popover: string
        popoverForeground: string
        primary: string
        primaryForeground: string
        secondary: string
        secondaryForeground: string
        muted: string
        mutedForeground: string
        accent: string
        accentForeground: string
        destructive: string
        destructiveForeground: string
        border: string
        input: string
        ring: string
        chart1: string
        chart2: string
        chart3: string
        chart4: string
        chart5: string
        sidebar: string
        sidebarForeground: string
        sidebarPrimary: string
        sidebarPrimaryForeground: string
        sidebarAccent: string
        sidebarAccentForeground: string
        sidebarBorder: string
        sidebarRing: string
      }
      dark: {
        background: string
        foreground: string
        card: string
        cardForeground: string
        popover: string
        popoverForeground: string
        primary: string
        primaryForeground: string
        secondary: string
        secondaryForeground: string
        muted: string
        mutedForeground: string
        accent: string
        accentForeground: string
        destructive: string
        destructiveForeground: string
        border: string
        input: string
        ring: string
        chart1: string
        chart2: string
        chart3: string
        chart4: string
        chart5: string
        sidebar: string
        sidebarForeground: string
        sidebarPrimary: string
        sidebarPrimaryForeground: string
        sidebarAccent: string
        sidebarAccentForeground: string
        sidebarBorder: string
        sidebarRing: string
      }
      radius: string
    }
  }
  header: {
    logo: {
      src: string
      alt: string
      widthDesktop: number
      heightDesktop: number
      widthMobile: number
      heightMobile: number
    }
    tagline: string
    navDesktop: NavItem[]
    navMobile: NavItem[]
    menuOpenAria: string
    menuCloseAria: string
  }
  hero: {
    sectionId: string
    eyebrow: string
    title: string
    lead: string
    benefits: Array<{
      titulo: string
      descripcion: string
      icon: BenefitIconName
    }>
  }
  productList: {
    sectionId: string
    eyebrow: string
    title: string
    productsJsonUrl: string
    categorySubtitleSingular: string
    categorySubtitlePlural: string
    tapToSelect: string
    backSelectStyle: string
    backSingleCta: string
    backButtonDescription: string
    tapToFlipBack: string
  }
  footer: {
    sectionId: string
    brandAriaLabel: string
    brandTagline: string
    contactCta: {
      href: string
      label: string
    }
    quickLinksTitle: string
    quickLinks: NavItem[]
    faqTitle: string
    faqs: FaqItem[]
    copyright: string
    policyLinks: NavItem[]
    social: SocialLink[]
  }
  catalogo: {
    allFilterLabel: string
    backToHome: string
    verCarrito: string
    heroEyebrow: string
    pageTitle: string
    emptyMessage: string
    favoriteAddAria: string
    favoriteRemoveAria: string
    consultButtonLabel: string
    instagramUser: string
    consult: {
      default: string
      byCategory: Record<string, string>
    }
    /** Número WhatsApp en formato E.164 sin +: ej. 54911xxxxxxxx */
    whatsappPhoneE164: string
    producto: {
      backToCatalog: string
      detalleEyebrow: string
      loading: string
      notFoundTitle: string
      notFoundCta: string
      noDescription: string
      addToCart: string
      addedFeedback: string
      consultWhatsApp: string
    }
  }
  carrito: {
    pageTitle: string
    heroEyebrow: string
    backToCatalog: string
    emptyMessage: string
    estimatedLabel: string
    sendWhatsAppLabel: string
    removeLineAria: string
    /** Plantilla del mensaje: use {items} y {total} (total numérico con 2 decimales). */
    whatsappMessageTemplate: string
    tableProduct: string
    tableQty: string
    tableUnit: string
    tableSubtotal: string
  }
}

export const config: SiteConfig = {
  meta: {
    title: "Nani Patisserie",
    description:
      "Productos 100% artesanales",
  },
  theme: {
    typography: {
      googleFont: "Open_Sans",
      fontSansVar: "'Open Sans', sans-serif",
      fontMonoVar: "monospace",
    },
    colors: {
      light: {
        background: "oklch(0.98 0.002 90)",
        foreground: "oklch(0.18 0.01 60)",
        card: "oklch(1 0 0)",
        cardForeground: "oklch(0.18 0.01 60)",
        popover: "oklch(1 0 0)",
        popoverForeground: "oklch(0.18 0.01 60)",
        primary: "oklch(0.25 0.01 60)",
        primaryForeground: "oklch(0.98 0.002 90)",
        secondary: "oklch(0.96 0.03 10)",
        secondaryForeground: "oklch(0.25 0.01 60)",
        muted: "oklch(0.94 0.005 80)",
        mutedForeground: "oklch(0.50 0.01 60)",
        accent: "oklch(0.68 0.12 10)",
        accentForeground: "oklch(0.98 0.002 90)",
        destructive: "oklch(0.577 0.245 27.325)",
        destructiveForeground: "oklch(0.577 0.245 27.325)",
        border: "oklch(0.90 0.005 80)",
        input: "oklch(0.90 0.005 80)",
        ring: "oklch(0.68 0.12 10)",
        chart1: "oklch(0.646 0.222 41.116)",
        chart2: "oklch(0.6 0.118 184.704)",
        chart3: "oklch(0.398 0.07 227.392)",
        chart4: "oklch(0.828 0.189 84.429)",
        chart5: "oklch(0.769 0.188 70.08)",
        sidebar: "oklch(0.985 0 0)",
        sidebarForeground: "oklch(0.145 0 0)",
        sidebarPrimary: "oklch(0.205 0 0)",
        sidebarPrimaryForeground: "oklch(0.985 0 0)",
        sidebarAccent: "oklch(0.98 0.01 10)",
        sidebarAccentForeground: "oklch(0.205 0 0)",
        sidebarBorder: "oklch(0.922 0 0)",
        sidebarRing: "oklch(0.708 0 0)",
      },
      dark: {
        background: "oklch(0.145 0 0)",
        foreground: "oklch(0.985 0 0)",
        card: "oklch(0.145 0 0)",
        cardForeground: "oklch(0.985 0 0)",
        popover: "oklch(0.145 0 0)",
        popoverForeground: "oklch(0.985 0 0)",
        primary: "oklch(0.985 0 0)",
        primaryForeground: "oklch(0.205 0 0)",
        secondary: "oklch(0.34 0.05 10)",
        secondaryForeground: "oklch(0.985 0 0)",
        muted: "oklch(0.269 0 0)",
        mutedForeground: "oklch(0.708 0 0)",
        accent: "oklch(0.48 0.09 10)",
        accentForeground: "oklch(0.985 0 0)",
        destructive: "oklch(0.396 0.141 25.723)",
        destructiveForeground: "oklch(0.637 0.237 25.331)",
        border: "oklch(0.269 0 0)",
        input: "oklch(0.269 0 0)",
        ring: "oklch(0.48 0.09 10)",
        chart1: "oklch(0.488 0.243 264.376)",
        chart2: "oklch(0.696 0.17 162.48)",
        chart3: "oklch(0.769 0.188 70.08)",
        chart4: "oklch(0.627 0.265 303.9)",
        chart5: "oklch(0.645 0.246 16.439)",
        sidebar: "oklch(0.205 0 0)",
        sidebarForeground: "oklch(0.985 0 0)",
        sidebarPrimary: "oklch(0.488 0.243 264.376)",
        sidebarPrimaryForeground: "oklch(0.985 0 0)",
        sidebarAccent: "oklch(0.34 0.05 10)",
        sidebarAccentForeground: "oklch(0.985 0 0)",
        sidebarBorder: "oklch(0.269 0 0)",
        sidebarRing: "oklch(0.439 0 0)",
      },
      radius: "0.5rem",
    },
  },
  header: {
    logo: {
      src: "/logo1.svg",
      alt: "Nani Patisserie",
      widthDesktop: 500,
      heightDesktop: 186,
      widthMobile: 300,
      heightMobile: 150,
    },
    tagline: "",
    navDesktop: [
      { label: "Inicio", href: "/" },
      { label: "Catálogo", href: "/catalogo" },
    ],
    navMobile: [
      { label: "Inicio", href: "/" },
      { label: "Catálogo", href: "/catalogo" },
      {label: "Contacto", href: ""}
    ],
    menuOpenAria: "Abrir menú",
    menuCloseAria: "Cerrar menú",
  },
  hero: {
    sectionId: "newsletter",
    eyebrow: "Tu experiencia en Nombre del negocio",
    title: "Titulo marketing",
    lead: "Descripción de lo que hace el negocio y lo que ofrece",
    benefits: [
      {
        titulo: "Titulo de la ventaja 1",
        descripcion:
          "Descripción de la ventaja 1",
        icon: "userCheck",
      },
      {
        titulo: "Titulo de la ventaja 2",
        descripcion:
          "Descripción de la ventaja 2",
        icon: "sparkles",
      },
      {
        titulo: "Titulo de la ventaja 3",
        descripcion:
          "Descripción de la ventaja 3",
        icon: "shield",
      },
    ],
  },
  productList: {
    sectionId: "Título productos",
    eyebrow: "Productos 100% artesanales",
    title: "Nuestros productos",
    productsJsonUrl: "/products.json",
    categorySubtitleSingular: "{count} producto disponible",
    categorySubtitlePlural: "{count} productos disponibles",
    tapToSelect: "Toca para seleccionar",
    backSelectStyle: "",
    backSingleCta: "Texto de la sección de productos",
    backButtonDescription: "Toca para ver más",
    tapToFlipBack: "Toca para volver",
  },
  footer: {
    sectionId: "contacto",
    brandAriaLabel: "Nombre del negocio",
    brandTagline:
      "Slogan",
    contactCta: {
      href: "https://ig.me/m/nombre_del_negocio",
      label: "Texto de la sección de contacto",
    },
    quickLinksTitle: "Enlaces rápidos",
    quickLinks: [
      { label: "Texto de la sección de quick links 1", href: "#inicio" },
      { label: "Texto de la sección de quick links 2", href: "#categorias" },
      { label: "Texto de la sección de quick links 3", href: "#catalogo" },
      { label: "Texto de la sección de quick links 4", href: "#newsletter" },
    ],
    faqTitle: "Preguntas frecuentes",
    faqs: [
      {
        question: "Texto de la pregunta 1",
        answer:
          "Texto de la respuesta 1",
      },
      {
        question: "Texto de la pregunta 2",
        answer:
          "Texto de la respuesta 2",
      },
      {
        question: "Texto de la pregunta 3",
        answer:
          "Texto de la respuesta 3",
      },
      {
        question: "Texto de la pregunta 4",
        answer:
          "Texto de la respuesta 4",
      },
      {
        question: "Texto de la pregunta 5",
        answer:
          "Texto de la respuesta 5",
      },
      {
        question: "Texto de la pregunta 6",
        answer:
          "Texto de la respuesta 6",
      },
    ],
    copyright: "© {year} Nombre del negocio. Todos los derechos reservados.",
    policyLinks: [
      { label: "Política de Privacidad", href: "#" },
      { label: "Términos y Condiciones", href: "#" },
    ],
    social: [
      {
        name: "Instagram",
        href: "https://instagram.com/nanipatisserie",
        platform: "instagram",
      },
      {
        name: "Facebook",
        href: "https://facebook.com/nombre_del_negocio",
        platform: "facebook",
      },
    ],
  },
  catalogo: {
    allFilterLabel: "Todos",
    backToHome: "Volver al inicio",
    verCarrito: "Ver carrito",
    heroEyebrow: "Productos completamente artesanales",
    pageTitle: "Catálogo de productos",
    emptyMessage: "No se encontraron productos con los filtros seleccionados.",
    favoriteAddAria: "Agregar a favoritos",
    favoriteRemoveAria: "Quitar de favoritos",
    consultButtonLabel: "Consultar por Instagram",
    instagramUser: "nanipatisserie",
    consult: {
      default: "Hola como estás? Te escribo por",
      byCategory: {
        "Tipo de producto 1":
          "Hola como estas? te consulto por",
        "Tipo de producto 2":
          "Texto de la consulta por categoria 2",
        "Tipo de producto 3": "Texto de la consulta por categoria 3",
        "Tipo de producto 4": "Texto de la consulta por categoria 4",
        "Tipo de producto 5":
          "Texto de la consulta por categoria 5",
      },
    },
    whatsappPhoneE164: "5492634256353",
    producto: {
      backToCatalog: "Volver al catálogo",
      detalleEyebrow: "Hechos con dedicación",
      loading: "Cargando…",
      notFoundTitle: "No encontramos este producto",
      notFoundCta: "Ir al catálogo",
      noDescription: "No hay descripción de este producto",
      addToCart: "Agregar al carrito",
      addedFeedback: "Producto agregado al carrito",
      consultWhatsApp: "Consultar por WhatsApp",
    },
  },
  carrito: {
    pageTitle: "Carrito",
    heroEyebrow: "Estos productos has cargado en el carrito",
    backToCatalog: "Seguir comprando",
    emptyMessage: "Todavía no hay productos en el carrito.",
    estimatedLabel: "Total estimado",
    sendWhatsAppLabel: "Enviar pedido por WhatsApp",
    removeLineAria: "Quitar del carrito",
    whatsappMessageTemplate:
      "Texto de la sección de carrito",
    tableProduct: "Producto",
    tableQty: "Cant.",
    tableUnit: "P. unit.",
    tableSubtotal: "Subtotal",
  },
}
