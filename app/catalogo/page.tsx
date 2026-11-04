"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, ShoppingBag } from "lucide-react";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/Card";
import { MobileCatalogFilters } from "@/components/MobileCatalogFilters";
import { Button } from "@/components/ui/button";
import { config } from "@/data/config";
import {
  ALL_FILTER,
  buildCatalogQueryString,
  filterProducts,
  getFilterGroups,
  parseFiltersFromSearchParams,
  type CatalogFilters,
} from "@/lib/catalog-filters";
import { loadProductsFromConfig } from "@/lib/load-products";
import type { Tables } from "@/types/supabase";

type Product = Tables<"productos">;

const { catalogo: c } = config;

export default function CatalogoPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<CatalogFilters>(() =>
    parseFiltersFromSearchParams(searchParams),
  );

  useEffect(() => {
    setFilters(parseFiltersFromSearchParams(searchParams));
  }, [searchParams]);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const list = await loadProductsFromConfig();
        if (!cancelled) setProducts(list);
      } catch {
        if (!cancelled) setProducts([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const applyFilters = useCallback(
    (next: CatalogFilters) => {
      setFilters(next);
      const query = buildCatalogQueryString(next);
      router.replace(query ? `/catalogo?${query}` : "/catalogo", {
        scroll: false,
      });
    },
    [router],
  );

  const filterGroups = useMemo(
    () => getFilterGroups(products, filters),
    [products, filters],
  );

  const handleCategorySelect = (category: string) => {
    applyFilters({
      ...filters,
      category,
      subcategory: ALL_FILTER,
      param3: ALL_FILTER,
    });
  };

  const handleSubcategorySelect = (subcategory: string) => {
    applyFilters({
      ...filters,
      subcategory,
      param3: ALL_FILTER,
    });
  };

  const filteredProducts = useMemo(
    () => filterProducts(products, filters),
    [products, filters],
  );

  const catalogQuery = buildCatalogQueryString(filters);

  return (
    <main className="min-h-screen flex flex-col justify-between">
      <Header {...config.header} />

      <div className="pt-16 md:pt-20 flex-grow">
        <section className="py-20 md:py-32 bg-secondary min-h-screen">
          <div className="container mx-auto px-4 md:px-6">
            <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors w-fit"
              >
                <ArrowLeft className="w-4 h-4" />
                {c.backToHome}
              </Link>
              <Link
                href="/carrito"
                className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors w-fit sm:ml-auto"
              >
                <ShoppingBag className="w-4 h-4" />
                {c.verCarrito}
              </Link>
            </div>

            <div className="mb-10 text-center">
              <p className="text-sm uppercase tracking-widest text-accent mb-3">
                {c.heroEyebrow}
              </p>
              <h1 className="text-3xl md:text-4xl font-light text-foreground">
                {c.pageTitle}
              </h1>
              {(filters.category !== ALL_FILTER ||
                filters.subcategory !== ALL_FILTER) && (
                <p className="mt-3 text-sm text-muted-foreground">
                  {filters.category !== ALL_FILTER
                    ? `${c.filters?.categoryLabel ?? "Categoría"}: ${filters.category}`
                    : null}
                  {filters.category !== ALL_FILTER &&
                  filters.subcategory !== ALL_FILTER
                    ? " · "
                    : null}
                  {filters.subcategory !== ALL_FILTER
                    ? `${c.filters?.subcategoryLabel ?? "Subcategoría"}: ${filters.subcategory}`
                    : null}
                </p>
              )}
            </div>

            {!loading && products.length > 0 && (
              <>
                <div className="mb-6 sm:hidden">
                  <MobileCatalogFilters
                    products={products}
                    appliedFilters={filters}
                    onApply={applyFilters}
                  />
                </div>

                <div className="hidden sm:flex flex-col gap-4 justify-center mb-12">
                  <div className="flex flex-wrap justify-center gap-2">
                    {[ALL_FILTER, ...filterGroups.categoria].map((cat) => (
                      <Button
                        key={cat}
                        type="button"
                        size="sm"
                        variant={
                          filters.category === cat ? "default" : "outline"
                        }
                        onClick={() => handleCategorySelect(cat)}
                        className={
                          filters.category === cat
                            ? "bg-primary text-primary-foreground"
                            : ""
                        }
                      >
                        {cat === ALL_FILTER ? c.allFilterLabel : cat}
                      </Button>
                    ))}
                  </div>

                  {filterGroups.genero.length > 0 && (
                    <>
                      <div className="h-px w-24 mx-auto bg-border" />
                      <div className="flex flex-wrap justify-center gap-2">
                        {[ALL_FILTER, ...filterGroups.genero].map((gen) => (
                          <Button
                            key={gen}
                            type="button"
                            size="sm"
                            variant={
                              filters.subcategory === gen
                                ? "default"
                                : "outline"
                            }
                            onClick={() => handleSubcategorySelect(gen)}
                            className={
                              filters.subcategory === gen
                                ? "bg-primary text-primary-foreground"
                                : ""
                            }
                          >
                            {gen === ALL_FILTER ? c.allFilterLabel : gen}
                          </Button>
                        ))}
                      </div>
                    </>
                  )}

                  {filterGroups.param3.length > 0 && (
                    <>
                      <div className="h-px w-24 mx-auto bg-border" />
                      <div className="flex flex-wrap justify-center gap-2">
                        {[ALL_FILTER, ...filterGroups.param3].map((value) => (
                          <Button
                            key={value}
                            type="button"
                            size="sm"
                            variant={
                              filters.param3 === value ? "default" : "outline"
                            }
                            onClick={() =>
                              applyFilters({ ...filters, param3: value })
                            }
                            className={
                              filters.param3 === value
                                ? "bg-primary text-primary-foreground"
                                : ""
                            }
                          >
                            {value === ALL_FILTER ? c.allFilterLabel : value}
                          </Button>
                        ))}
                      </div>
                    </>
                  )}

                  <div className="h-px w-24 mx-auto bg-border" />
                  <div className="flex flex-wrap justify-center gap-2">
                    {[
                      { label: c.allFilterLabel ?? "Todos", value: ALL_FILTER },
                      {
                        label: c.filters?.availableLabel ?? "Disponibles",
                        value: "available",
                      },
                      {
                        label:
                          c.filters?.soldOutLabel ??
                          c.producto?.soldOutLabel ??
                          "Agotado",
                        value: "soldOut",
                      },
                    ].map((option) => (
                      <Button
                        key={option.value}
                        type="button"
                        size="sm"
                        variant={
                          filters.soldOut === option.value
                            ? "default"
                            : "outline"
                        }
                        onClick={() =>
                          applyFilters({
                            ...filters,
                            soldOut: option.value as CatalogFilters["soldOut"],
                          })
                        }
                        className={
                          filters.soldOut === option.value
                            ? "bg-primary text-primary-foreground"
                            : ""
                        }
                      >
                        {option.label}
                      </Button>
                    ))}
                  </div>
                </div>
              </>
            )}

            {loading ? (
              <div className="text-center text-muted-foreground">
                {c.producto.loading}
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="max-w-xl mx-auto text-center">
                <p className="text-muted-foreground mb-6">{c.emptyMessage}</p>
                <div className="flex gap-4 justify-center">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() =>
                      applyFilters({
                        category: ALL_FILTER,
                        subcategory: ALL_FILTER,
                        param3: ALL_FILTER,
                        soldOut: ALL_FILTER,
                      })
                    }
                  >
                    {c.filters?.clearLabel ?? "Limpiar filtros"}
                  </Button>{" "}
                  <Button asChild variant="default">
                    <Link href="/">{c.backToHome ?? "Volver al inicio"}</Link>
                  </Button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => {
                  const attrs =
                    (product.atributes as Record<string, any>) || {};
                  const fallbackDesc =
                    product.description?.trim() ||
                    [attrs.param1, attrs.param2].filter(Boolean).join(" · ") ||
                    product.name;

                  return (
                    <article
                      key={product.uuid}
                      className="rounded-xl border border-border bg-background"
                    >
                      <Card
                        id={product.uuid}
                        titulo={product.name}
                        descripcion={fallbackDesc}
                        imagen={product.image}
                        precio={`$${Number(product.price).toFixed(2)}`}
                        soldOut={product.sold_out ?? false}
                        catalogQuery={catalogQuery}
                        param1={attrs.param1}
                      />
                    </article>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      </div>

      <Footer {...config.footer} />
    </main>
  );
}
