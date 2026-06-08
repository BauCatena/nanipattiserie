import { config } from '@/data/config';
import { normalizeProduct, type NormalizedProduct } from '@/lib/product-helpers';

export async function loadProductsFromConfig(): Promise<NormalizedProduct[]> {
  const res = await fetch(config.productList.productsJsonUrl);
  if (!res.ok) {
    throw new Error('No se pudo cargar el catálogo');
  }
  const raw = (await res.json()) as NormalizedProduct[];
  return raw.map(normalizeProduct);
}
