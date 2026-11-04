import type { Product } from "@/types/product";

export type CartRow = {
  product: Product;
  quantity: number;
  lineTotal: number;
};

const DEFAULT_WHATSAPP_TEMPLATE = `Hola! Quiero consultar por el siguiente pedido:

{items}

Total estimado: ${"{total}"}

Gracias!`;

export function buildCartWhatsappMessage(
  rows: CartRow[],
  total: number,
  template: string,
): string {
  const itemLines = rows
    .map((row, index) => {
      const unitPrice = row.product.price.toFixed(2);
      const lineTotal = row.lineTotal.toFixed(2);
      return `${index + 1}. ${row.product.name} x${row.quantity} — $${lineTotal} ($${unitPrice} c/u)`;
    })
    .join("\n");

  const effectiveTemplate =
    template.includes("{items}") && template.includes("{total}")
      ? template
      : DEFAULT_WHATSAPP_TEMPLATE;

  return effectiveTemplate
    .replace("{items}", itemLines)
    .replace("{total}", total.toFixed(2));
}
