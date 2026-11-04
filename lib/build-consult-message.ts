import type { SiteConfig } from "@/data/config";

type ProductLike = {
  name: string;
  param1?: string;
};

export function buildConsultMessage(
  product: ProductLike,
  consult: SiteConfig["catalogo"]["consult"],
): string {
  const categoryKey = product.param1?.trim();
  const template =
    categoryKey && consult.byCategory[categoryKey]
      ? consult.byCategory[categoryKey]
      : consult.default;

  if (template.includes("{name}")) {
    return template.split("{name}").join(product.name);
  }

  return `${template.trim()} ${product.name}`.trim();
}
