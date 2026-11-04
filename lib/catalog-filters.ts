import type { Tables } from "@/types/supabase";

type Product = Tables<"productos"> & {
  param1?: string;
  param2?: string;
  param3?: string;
  soldOut?: boolean;
};

export const ALL_FILTER = "Todos";

export type CatalogFilters = {
  category: string;
  subcategory: string;
  param3: string;
  soldOut: typeof ALL_FILTER | "available" | "soldOut";
};

export type FilterGroups = {
  categoria: string[];
  genero: string[];
  param3: string[];
};

// Helper to safely extract attributes from direct properties or Supabase JSONB `atributes`
function getProductParam(p: any, key: string): string {
  if (p[key] !== undefined && p[key] !== null) return String(p[key]);
  if (p.atributes && typeof p.atributes === "object") {
    const val = p.atributes[key];
    if (val !== undefined && val !== null) return String(val);
  }
  return "";
}

function getProductSoldOut(p: any): boolean {
  if (p.soldOut !== undefined) return Boolean(p.soldOut);
  if (p.sold_out !== undefined) return Boolean(p.sold_out);
  return false;
}

export function normalizeFilter(value: string | null | undefined): string {
  return value?.trim().toLowerCase() ?? "";
}

export function parseFiltersFromSearchParams(
  searchParams: Pick<URLSearchParams, "get">,
): CatalogFilters {
  const category =
    searchParams.get("param1") || searchParams.get("categoria") || ALL_FILTER;
  const subcategory =
    searchParams.get("param2") || searchParams.get("genero") || ALL_FILTER;
  const param3 = searchParams.get("param3") || ALL_FILTER;
  const soldOutParam = searchParams.get("soldOut");

  return {
    category,
    subcategory,
    param3,
    soldOut:
      soldOutParam === "true"
        ? "soldOut"
        : soldOutParam === "false"
          ? "available"
          : ALL_FILTER,
  };
}

export function buildCatalogQueryString(filters: CatalogFilters): string {
  const params = new URLSearchParams();

  if (filters.category !== ALL_FILTER) params.set("param1", filters.category);
  if (filters.subcategory !== ALL_FILTER)
    params.set("param2", filters.subcategory);
  if (filters.param3 !== ALL_FILTER) params.set("param3", filters.param3);
  if (filters.soldOut === "soldOut") params.set("soldOut", "true");
  if (filters.soldOut === "available") params.set("soldOut", "false");

  return params.toString();
}

export function buildCatalogHref(filters: CatalogFilters): string {
  const query = buildCatalogQueryString(filters);
  return query ? `/catalogo?${query}` : "/catalogo";
}

export function getFilterGroups(
  products: Product[],
  filters: Pick<CatalogFilters, "category" | "subcategory">,
): FilterGroups {
  const uniqueCategories = [
    ...new Set(products.map((p) => getProductParam(p, "param1"))),
  ].filter(Boolean);

  let productsForLevel2 = products;
  if (filters.category !== ALL_FILTER) {
    productsForLevel2 = products.filter(
      (p) =>
        normalizeFilter(getProductParam(p, "param1")) ===
        normalizeFilter(filters.category),
    );
  }
  const uniqueGenders = [
    ...new Set(productsForLevel2.map((p) => getProductParam(p, "param2"))),
  ].filter(Boolean);

  let productsForLevel3 = productsForLevel2;
  if (filters.subcategory !== ALL_FILTER) {
    productsForLevel3 = productsForLevel2.filter(
      (p) =>
        normalizeFilter(getProductParam(p, "param2")) ===
        normalizeFilter(filters.subcategory),
    );
  }
  const uniqueParam3Values = [
    ...new Set(productsForLevel3.map((p) => getProductParam(p, "param3"))),
  ].filter(Boolean);

  return {
    categoria: uniqueCategories,
    genero: uniqueGenders,
    param3: uniqueParam3Values,
  };
}

export function filterProducts(
  products: Product[],
  filters: CatalogFilters,
): Product[] {
  const normalizedCat = normalizeFilter(
    filters.category === ALL_FILTER ? "" : filters.category,
  );
  const normalizedGen = normalizeFilter(
    filters.subcategory === ALL_FILTER ? "" : filters.subcategory,
  );
  const normalizedParam3 = normalizeFilter(
    filters.param3 === ALL_FILTER ? "" : filters.param3,
  );

  return products.filter((product) => {
    const productCat = normalizeFilter(getProductParam(product, "param1"));
    const productGen = normalizeFilter(getProductParam(product, "param2"));
    const productParam3 = normalizeFilter(getProductParam(product, "param3"));
    const isSoldOut = getProductSoldOut(product);

    const matchesCategory =
      normalizedCat === "" || productCat === normalizedCat;
    const matchesGender = normalizedGen === "" || productGen === normalizedGen;
    const matchesParam3 =
      normalizedParam3 === "" || productParam3 === normalizedParam3;

    const matchesSoldOut =
      filters.soldOut === ALL_FILTER ||
      (filters.soldOut === "soldOut" && isSoldOut) ||
      (filters.soldOut === "available" && !isSoldOut);

    return matchesCategory && matchesGender && matchesParam3 && matchesSoldOut;
  });
}

export function countActiveFilters(filters: CatalogFilters): number {
  let count = 0;
  if (filters.category !== ALL_FILTER) count++;
  if (filters.subcategory !== ALL_FILTER) count++;
  if (filters.param3 !== ALL_FILTER) count++;
  if (filters.soldOut !== ALL_FILTER) count++;
  return count;
}
