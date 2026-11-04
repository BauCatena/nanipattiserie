"use client";

import { useEffect, useState } from "react";
import type { AttributeOptions } from "@/lib/attribute-options";

const EMPTY_OPTIONS: AttributeOptions = {
  param1: [],
  param2: [],
  attributeKeys: [],
  valuesByKey: {},
};

export function useAttributeOptions(enabled = true) {
  const [options, setOptions] = useState<AttributeOptions>(EMPTY_OPTIONS);
  const [loading, setLoading] = useState(enabled);

  useEffect(() => {
    if (!enabled) return;

    let cancelled = false;
    (async () => {
      try {
        // Fetch from the normal products endpoint (same as catalog)
        const res = await fetch("/api/products"); // Adjust to your actual public products endpoint if different
        if (!res.ok) throw new Error("fetch failed");
        const products = await res.json();

        // Extract categories exactly like the catalog filter does
        const param1Set = new Set<string>();
        const param2Set = new Set<string>();

        if (Array.isArray(products)) {
          products.forEach((p: any) => {
            if (p.param1) param1Set.add(p.param1.trim());
            if (p.param2) param2Set.add(p.param2.trim());
          });
        }

        if (!cancelled) {
          setOptions({
            param1: Array.from(param1Set).sort(),
            param2: Array.from(param2Set).sort(),
            attributeKeys: [],
            valuesByKey: {},
          });
        }
      } catch (err) {
        console.error("Error loading attribute options from products:", err);
        if (!cancelled) setOptions(EMPTY_OPTIONS);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [enabled]);

  const refresh = async () => {
    try {
      const res = await fetch("/api/products");
      if (res.ok) {
        const products = await res.json();
        const param1Set = new Set<string>();
        const param2Set = new Set<string>();

        if (Array.isArray(products)) {
          products.forEach((p: any) => {
            if (p.param1) param1Set.add(p.param1.trim());
            if (p.param2) param2Set.add(p.param2.trim());
          });
        }

        setOptions({
          param1: Array.from(param1Set).sort(),
          param2: Array.from(param2Set).sort(),
          attributeKeys: [],
          valuesByKey: {},
        });
      }
    } catch (err) {
      console.error("Error refreshing attribute options:", err);
    }
  };

  return { options, loading, refresh };
}
