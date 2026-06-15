import type { SiteConfig } from "@/data/config"

type ProductLike = {
  name: string
  param1: string
}

export function buildConsultMessage(
  product: ProductLike,
  consult: SiteConfig["catalogo"]["consult"]
): string {
  const template = consult.byCategory[product.param1] ?? consult.default
  return template.split("{name}").join(product.name)
}
