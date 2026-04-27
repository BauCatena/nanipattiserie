"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { ArrowLeft, ShoppingBag } from "lucide-react"

import { Header } from "@/components/Header"
import { Card } from "@/components/Card"
import { Button } from "@/components/ui/button"
import { config } from "@/data/config"
import { loadProductsFromConfig } from "@/lib/load-products"
import type { Product } from "@/types/product"

const { catalogo: c } = config

const ALL_FILTER = "Todos"
const normalizeFilter = (value: string | null) => value?.trim().toLowerCase() ?? ""

export default function CatalogoPage() {
  const searchParams = useSearchParams()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  // Leemos los parámetros iniciales de la URL
  const initialCategory = searchParams.get("categoria") || searchParams.get("param1")
  const initialGender = searchParams.get("genero") || searchParams.get("param2")

  // Estados para los botones dinámicos
  const [activeCategory, setActiveCategory] = useState(initialCategory || ALL_FILTER)
  const [activeGender, setActiveGender] = useState(initialGender || ALL_FILTER)

  useEffect(() => {
    let cancelled = false

    ;(async () => {
      try {
        const list = await loadProductsFromConfig()
        if (!cancelled) setProducts(list)
      } catch {
        if (!cancelled) setProducts([])
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()

    return () => {
      cancelled = true
    }
  }, [])

  // Filtros en cascada: El Nivel 2 depende de lo seleccionado en el Nivel 1
  const filterGroups = useMemo(() => {
    // 1. Extraer Nivel 1: Siempre es el total de la base de datos (Ej: Panadería, Pastelería)
    const uniqueCategories = [...new Set(products.map((p) => p.param1))].filter(Boolean)

    // 2. Extraer Nivel 2: Depende de lo que esté activo en el Nivel 1
    let productsForLevel2 = products
    if (activeCategory !== ALL_FILTER) {
      productsForLevel2 = products.filter(p => normalizeFilter(p.param1) === normalizeFilter(activeCategory))
    }
    const uniqueGenders = [...new Set(productsForLevel2.map((p) => p.param2))].filter(Boolean)

    return {
      categoria: uniqueCategories.map((cat) => ({ value: cat })),
      genero: uniqueGenders.map((gen) => ({ value: gen })),
    }
  }, [products, activeCategory])

  // Manejador para el Nivel 1 (Categorías Padre)
  const handlePrimaryFilterClick = (cat: string) => {
    setActiveCategory(cat)
    // Al cambiar la categoría principal, reseteamos el filtro hijo para evitar combinaciones inválidas
    setActiveGender(ALL_FILTER)
  }

  // Filtrado final de los productos
  const filteredProducts = useMemo(() => {
    const normalizedCat = normalizeFilter(activeCategory === ALL_FILTER ? "" : activeCategory)
    const normalizedGen = normalizeFilter(activeGender === ALL_FILTER ? "" : activeGender)

    return products.filter((product) => {
      const productCat = normalizeFilter(product.param1)
      const productGen = normalizeFilter(product.param2)

      const matchesCategory = normalizedCat === "" || productCat === normalizedCat
      const matchesGender = normalizedGen === "" || productGen === normalizedGen

      return matchesCategory && matchesGender
    })
  }, [products, activeCategory, activeGender])

  return (
    <main className="min-h-screen">
      <Header {...config.header} />

      <div className="pt-16 md:pt-20">
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
              <p className="text-sm uppercase tracking-widest text-accent mb-3">{c.heroEyebrow}</p>
              <h1 className="text-3xl md:text-4xl font-light text-foreground">{c.pageTitle}</h1>
              {(activeCategory !== ALL_FILTER || activeGender !== ALL_FILTER) && (
                <p className="mt-3 text-sm text-muted-foreground">
                  {activeCategory !== ALL_FILTER ? `Categoría: ${activeCategory}` : null}
                  {activeCategory !== ALL_FILTER && activeGender !== ALL_FILTER ? " · " : null}
                  {activeGender !== ALL_FILTER ? `Subcategoría: ${activeGender}` : null}
                </p>
              )}
            </div>

            {/* SECCIÓN DE BOTONES INTEGRADA */}
            {!loading && products.length > 0 && (
              <div className="flex flex-col gap-4 justify-center mb-12">
                {/* Nivel 1: Categorías */}
                <div className="flex flex-wrap justify-center gap-2">
                  {[ALL_FILTER, ...filterGroups.categoria.map((option) => option.value)].map((cat) => (
                    <Button
                      key={cat}
                      type="button"
                      size="sm"
                      variant={activeCategory === cat ? "default" : "outline"}
                      onClick={() => handlePrimaryFilterClick(cat)}
                      className={
                        activeCategory === cat ? "bg-primary text-primary-foreground" : ""
                      }
                    >
                      {cat}
                    </Button>
                  ))}
                </div>

                {/* Nivel 2: Subcategorías (Solo se muestra si hay subcategorías disponibles) */}
                {filterGroups.genero.length > 0 && (
                  <>
                    <div className="hidden sm:block h-px w-24 mx-auto bg-border" />
                    <div className="flex flex-wrap justify-center gap-2">
                      {[ALL_FILTER, ...filterGroups.genero.map((option) => option.value)].map((gen) => (
                        <Button
                          key={gen}
                          type="button"
                          size="sm"
                          variant={activeGender === gen ? "default" : "outline"}
                          onClick={() => setActiveGender(gen)}
                          className={
                            activeGender === gen ? "bg-primary text-primary-foreground" : ""
                          }
                        >
                          {gen}
                        </Button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}

            {loading ? (
              <div className="text-center text-muted-foreground">{c.producto.loading}</div>
            ) : filteredProducts.length === 0 ? (
              <div className="max-w-xl mx-auto text-center">
                <p className="text-muted-foreground mb-6">{c.emptyMessage}</p>
                <div className="flex gap-4 justify-center">
                  <Button type="button" variant="outline" onClick={() => handlePrimaryFilterClick(ALL_FILTER)}>
                    Limpiar filtros
                  </Button>
                  <Button asChild variant="default">
                    <Link href="/">{c.backToHome}</Link>
                  </Button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => {
                  const description =
                    product.description?.trim() || `${product.param1} · ${product.param2}`

                  return (
                    <article key={product.id} className="rounded-xl border border-border bg-background">
                      <Card
                        id={product.id}
                        titulo={product.name}
                        descripcion={description}
                        imagen={product.image}
                        precio={`$${product.price.toFixed(2)}`}
                      />
                    </article>
                  )
                })}
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  )
}