"use client"

import Image from "next/image"
import { Phone, Shield, Sparkles, UserCheck, type LucideIcon } from "lucide-react"
import { config } from "@/data/config"
import type { Product } from "@/types/product"
import { buildConsultMessage } from "@/lib/build-consult-message"
import { buildWhatsAppUrl } from "@/lib/contact-urls"
import { addToCart } from "@/lib/cart-storage"
import { useState } from "react"
import Link from "next/link"

import type { BenefitIconName } from "@/data/config"
import { Button } from "./ui/button"
const { catalogo: c } = config

const iconMap: Record<BenefitIconName, LucideIcon> = {
  userCheck: UserCheck,
  sparkles: Sparkles,
  shield: Shield,
}
const onConsultWhatsApp = (p: Product) => {
  const text = buildConsultMessage(p, c.consult)
  window.open(
    buildWhatsAppUrl(c.whatsappPhoneE164, text),
    "_blank",
    "noopener,noreferrer"
  )
}

export type CardProps = {
  id: number
  titulo: string
  descripcion: string
  /** Presente en cards tipo beneficio (Hero). */
  icon?: BenefitIconName
  /** Si se define, se muestra variante con imagen (p. ej. producto). */
  imagen?: string
  /** Texto de precio u otra cifra, opcional. */
  precio?: string
}

export function Card({id, titulo, descripcion, icon, imagen, precio }: CardProps) {
  const [justAdded, setJustAdded] = useState(false)
  const onAddToCart = (p: Product) => {
    addToCart(p.id, 1)
    setJustAdded(true)
    window.setTimeout(() => setJustAdded(false), 2000)
  }
  if (imagen) {
    return (
      <div className="h-full rounded-lg border border-border bg-card overflow-hidden flex flex-col">
        <Link href={`/catalogo/${id}`} className="block">
          <div className="relative aspect-[4/3] w-full bg-muted">
            <Image
              src={imagen}
              alt={titulo}
              fill
              className="object-cover"
              sizes="(min-width: 768px) 33vw, 100vw"
            />
          </div>
        </Link>
        <div className="p-6 flex flex-col gap-2 flex-1">
          <h3 className="text-lg font-medium text-foreground">{titulo}</h3>
          <p className="text-sm text-muted-foreground flex-1">{descripcion}</p>
          {precio ? (
            <p className="text-base font-semibold text-foreground">{precio}</p>
          ) : null}
        </div>
        <div className="w-full flex flex-col items-center justify-center gap-3 pb-2">
  
          {/* BOTÓN WHATSAPP */}
          <div className="w-full flex items-center justify-center">
            <Button
              type="button"
              variant="outline"
              className="w-85 justify-center gap-2"
              onClick={() =>
                onConsultWhatsApp({
                  id,
                  name: titulo,
                  description: descripcion,
                } as Product)
              }
            >
              <Phone className="w-4 h-4" />
              {c.producto.consultWhatsApp}
            </Button>
          </div>

          {/* BOTÓN CARRITO */}
          <div className="w-full flex justify-center">
            <div className="w-full items-center max-w-xs p-2 pt-3 border-t border-border/60 flex flex-col items-center gap-2">
              
              <Button
                type="button"
                className="w-85 justify-center"
                onClick={() =>
                  onAddToCart({
                    id,
                    name: titulo,
                    description: descripcion,
                  } as Product)
                }
              >
                {c.producto.addToCart}
              </Button>

              {justAdded ? (
                <p className="text-xs text-accent text-center" aria-live="polite">
                  {c.producto.addedFeedback}
                </p>
              ) : null}

            </div>
          </div>

</div>
      </div>
    )
  }

  const Icon = icon ? iconMap[icon] : null

  return (
    <div className="h-full rounded-lg border border-border bg-card p-6 flex flex-col gap-3">
      {Icon ? (
        <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center mb-1">
          <Icon className="w-5 h-5 text-accent" />
        </div>
      ) : null}
      <h3 className="text-lg font-medium text-foreground">{titulo}</h3>
      <p className="text-sm text-muted-foreground">{descripcion}</p>
      {precio ? (
        <p className="text-base font-semibold text-foreground">{precio}</p>
      ) : null}
    </div>
  )
}
