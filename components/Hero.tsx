import { Card } from "@/components/Card"
import type { SiteConfig } from "@/data/config"

export type HeroProps = SiteConfig["hero"]

export function Hero({ sectionId, eyebrow, title, lead, benefits }: HeroProps) {
  return (
    <section id={sectionId} className="py-20 md:py-32 bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <p className="text-sm uppercase tracking-widest text-accent mb-4">
            {eyebrow}
          </p>
          <h2 className="text-3xl md:text-4xl font-light text-foreground mb-4 text-balance">
            {title}
          </h2>
          <p className="text-muted-foreground text-sm md:text-base">{lead}</p>
        </div>

        <div className="grid gap-6 md:gap-8 md:grid-cols-3 max-w-5xl mx-auto">
          {benefits.map((item) => (
            <Card
              key={item.titulo}
              titulo={item.titulo}
              descripcion={item.descripcion}
              icon={item.icon}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
