/**
 * ARCHITECTURE:
 * 1. Server-side (Node.js): Fetches products from Supabase DB and caches to JSON
 * 2. Client-side (React Hook): Fetches products from cached JSON file
 *
 * FILTERING:
 * - Products have an "atributes" field (from Supabase) containing a JSON object
 * - Filters are dynamically built from all unique attribute keys
 * - Example product: { id: 1, name: "...", atributes: { "param1": "Tipo 1", "param2": "Subtipo 1" } }
 * - Example filter: { "param1": "Tipo 1", "param2": "Subtipo 1" }
 *
 * This prevents excessive Supabase queries and improves performance
 */

import { useEffect, useMemo, useState } from 'react';
import { config } from '@/data/config';
import type { Tables } from '@/types/supabase';
import { syncProductsFromSupabase } from '@/lib/sync-products';

type Product = Tables<'productos'>;

// ============================================================================
// SERVER-SIDE: sync on startup
// ============================================================================

const ownerID = process.env.OWNER_ID || null;

if (typeof window === 'undefined') {
  syncProductsFromSupabase(ownerID).catch(console.error);
}

type FilterOption = {
  value: string;
  count: number;
};

/**
 * Dynamic filter groups based on product attributes
 * Structure: { attributeKey: [{ value: "...", count: N }, ...] }
 */
type FilterGroups = Record<string, FilterOption[]>;

/**
 * Active filters state
 * Structure: { attributeKey: selectedValue }
 */
type ActiveFilters = Record<string, string>;

const ALL_FILTER = config.catalogo.allFilterLabel;
const PRODUCTS_URL = config.productList.productsJsonUrl;

/**
 * Extracts all unique attribute keys from products
 * Uses the 'atributes' field from Supabase (note: typo in Supabase schema)
 * @example ["param1", "param2", "size", "color"]
 */
const getAttributeKeys = (products: Product[]): string[] => {
  const keysSet = new Set<string>();

  products.forEach((product) => {
    if (product.atributes && typeof product.atributes === 'object') {
      Object.keys(product.atributes).forEach((key) => {
        keysSet.add(key);
      });
    }
  });

  return Array.from(keysSet).sort();
};

/**
 * Builds filter options with counts from attribute values
 */
const buildFilterGroup = (values: (string | undefined)[]): FilterOption[] => {
  // Filter out undefined/null values
  const validValues = values.filter(
    (v): v is string => v !== undefined && v !== null && v !== ''
  );

  const counts = validValues.reduce<Record<string, number>>((acc, value) => {
    acc[value] = (acc[value] ?? 0) + 1;
    return acc;
  }, {});

  return Object.entries(counts)
    .map(([value, count]) => ({ value, count }))
    .sort((a, b) => a.value.localeCompare(b.value));
};

/**
 * Extracts all unique attribute values for a specific key
 * Uses the 'atributes' field from Supabase
 */
const getAttributeValuesForKey = (
  products: Product[],
  attributeKey: string
): (string | undefined)[] => {
  return products.map((product) => {
    if (product.atributes && typeof product.atributes === 'object') {
      return (product.atributes as Record<string, any>)[attributeKey];
    }
    return undefined;
  });
};

/**
 * Checks if a product matches all active filters
 * Uses the 'atributes' field from Supabase
 */
const matchesFilters = (
  product: Product,
  activeFilters: ActiveFilters
): boolean => {
  // If no filters are active, product matches
  const hasActiveFilters = Object.values(activeFilters).some(
    (value) => value !== ALL_FILTER
  );

  if (!hasActiveFilters) return true;

  // Check each active filter
  return Object.entries(activeFilters).every(([attributeKey, filterValue]) => {
    // If filter is set to "All", match everything
    if (filterValue === ALL_FILTER) return true;

    // Get the product's attribute value
    if (product.atributes && typeof product.atributes === 'object') {
      const productValue = (product.atributes as Record<string, any>)[
        attributeKey
      ];
      return productValue === filterValue;
    }

    return false;
  });
};

/**
 * useProducts Hook
 * Fetches products from CACHED JSON file (not from Supabase)
 * Manages dynamic filtering based on product attributes and loading state
 *
 * @returns {Object} products, filterGroups, activeFilters, updateFilter, clearFilters, loading
 */
export function useProducts() {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [activeFilters, setActiveFilters] = useState<ActiveFilters>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        // Fetch from cached JSON file (not from Supabase)
        const res = await fetch(PRODUCTS_URL);
        if (!res.ok) throw new Error(`Failed to fetch: ${res.status}`);

        const data = (await res.json()) as Product[];
        setAllProducts(data);

        // Initialize activeFilters with all attribute keys set to ALL_FILTER
        const keys = getAttributeKeys(data);
        const initialFilters: ActiveFilters = {};
        keys.forEach((key) => {
          initialFilters[key] = ALL_FILTER;
        });
        setActiveFilters(initialFilters);
      } catch (error) {
        console.error('Error loading products from cache:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  // Build filter groups from all products' attributes
  const filterGroups = useMemo<FilterGroups>(() => {
    const attributeKeys = getAttributeKeys(allProducts);
    const groups: FilterGroups = {};

    attributeKeys.forEach((key) => {
      const values = getAttributeValuesForKey(allProducts, key);
      groups[key] = buildFilterGroup(values);
    });

    return groups;
  }, [allProducts]);

  // Filter products based on active filters
  const filteredProducts = allProducts.filter((product) =>
    matchesFilters(product, activeFilters)
  );

  /**
   * Update a specific filter value
   */
  const updateFilter = (attributeKey: string, value: string) => {
    setActiveFilters((prev) => ({
      ...prev,
      [attributeKey]: value,
    }));
  };

  /**
   * Clear all filters
   */
  const clearFilters = () => {
    const keysSet = new Set<string>();
    Object.keys(filterGroups).forEach((key) => {
      keysSet.add(key);
    });

    const clearedFilters: ActiveFilters = {};
    keysSet.forEach((key) => {
      clearedFilters[key] = ALL_FILTER;
    });
    setActiveFilters(clearedFilters);
  };

  return {
    products: filteredProducts,
    filterGroups,
    activeFilters,
    updateFilter,
    clearFilters,
    loading,
  };
}

// ============================================================================
// EXPORTS: Server functions for external use
// ============================================================================

/**
 * Export for API routes or server-side operations
 * Allows manual sync of products from Supabase to JSON cache
 */
export { syncProductsFromSupabase } from '@/lib/sync-products';
