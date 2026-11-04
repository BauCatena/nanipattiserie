"use client";

import { useEffect, useMemo, useState } from "react";
import { SlidersHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { config } from "@/data/config";
import {
  ALL_FILTER,
  type CatalogFilters,
  getFilterGroups,
} from "@/lib/catalog-filters";
import type { Product } from "@/types/product";

const { catalogo: c } = config;
const labels = c?.filters ?? {};

type MobileCatalogFiltersProps = {
  products: Product[];
  appliedFilters: CatalogFilters;
  onApply: (filters: CatalogFilters) => void;
};

function FilterSection({
  title,
  options,
  active,
  onSelect,
}: {
  title: string;
  options: string[];
  active: string;
  onSelect: (value: string) => void;
}) {
  if (options.length === 0) return null;

  return (
    <div className="space-y-2">
      <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
        {title}
      </p>
      <div className="flex flex-wrap gap-2">
        {[ALL_FILTER, ...options].map((option) => (
          <Button
            key={option}
            type="button"
            size="sm"
            variant={active === option ? "default" : "outline"}
            onClick={() => onSelect(option)}
            className={
              active === option ? "bg-primary text-primary-foreground" : ""
            }
          >
            {option === ALL_FILTER ? (c?.allFilterLabel ?? "Todos") : option}
          </Button>
        ))}
      </div>
    </div>
  );
}

export function MobileCatalogFilters({
  products,
  appliedFilters,
  onApply,
}: MobileCatalogFiltersProps) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<CatalogFilters>(appliedFilters);

  useEffect(() => {
    if (open) setDraft(appliedFilters);
  }, [open, appliedFilters]);

  const filterGroups = useMemo(
    () => getFilterGroups(products, draft),
    [products, draft],
  );

  const handleCategorySelect = (category: string) => {
    setDraft((prev) => ({
      ...prev,
      category,
      subcategory: ALL_FILTER,
      param3: ALL_FILTER,
    }));
  };

  const handleSubcategorySelect = (subcategory: string) => {
    setDraft((prev) => ({
      ...prev,
      subcategory,
      param3: ALL_FILTER,
    }));
  };

  const handleApply = () => {
    onApply(draft);
    setOpen(false);
  };

  const handleClear = () => {
    const cleared: CatalogFilters = {
      category: ALL_FILTER,
      subcategory: ALL_FILTER,
      param3: ALL_FILTER,
      soldOut: ALL_FILTER,
    };
    setDraft(cleared);
  };

  const activeCount =
    (appliedFilters.category !== ALL_FILTER ? 1 : 0) +
    (appliedFilters.subcategory !== ALL_FILTER ? 1 : 0) +
    (appliedFilters.param3 !== ALL_FILTER ? 1 : 0) +
    (appliedFilters.soldOut !== ALL_FILTER ? 1 : 0);

  const buttonLabelText = labels.buttonLabel ?? "Filtrar";
  const categoryLabelText = labels.categoryLabel ?? "Categoría";
  const subcategoryLabelText = labels.subcategoryLabel ?? "Subcategoría";
  const param3LabelText = labels.param3Label ?? "Filtro adicional";
  const availabilityLabelText = labels.availabilityLabel ?? "Disponibilidad";
  const clearLabelText = labels.clearLabel ?? "Limpiar";
  const applyLabelText = labels.applyLabel ?? "Aplicar filtros";

  return (
    <>
      <Button
        type="button"
        variant="outline"
        className="w-full sm:hidden gap-2"
        onClick={() => setOpen(true)}
      >
        <SlidersHorizontal className="w-4 h-4" />
        {buttonLabelText}
        {activeCount > 0 ? (
          <span className="ml-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-xs text-primary-foreground">
            {activeCount}
          </span>
        ) : null}
      </Button>

      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerContent className="max-h-[85vh]">
          <DrawerHeader className="text-left">
            <DrawerTitle>{buttonLabelText}</DrawerTitle>
          </DrawerHeader>

          <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-6">
            <FilterSection
              title={categoryLabelText}
              options={filterGroups.categoria}
              active={draft.category}
              onSelect={handleCategorySelect}
            />

            {filterGroups.genero.length > 0 ? (
              <FilterSection
                title={subcategoryLabelText}
                options={filterGroups.genero}
                active={draft.subcategory}
                onSelect={handleSubcategorySelect}
              />
            ) : null}

            {filterGroups.param3.length > 0 ? (
              <FilterSection
                title={param3LabelText}
                options={filterGroups.param3}
                active={draft.param3}
                onSelect={(param3) => setDraft((prev) => ({ ...prev, param3 }))}
              />
            ) : null}

            <div className="space-y-2">
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                {availabilityLabelText}
              </p>
              <div className="flex flex-wrap gap-2">
                {[
                  { label: c?.allFilterLabel ?? "Todos", value: ALL_FILTER },
                  {
                    label: labels.availableLabel ?? "Disponibles",
                    value: "available",
                  },
                  {
                    label: c?.producto?.soldOutLabel ?? "Agotado",
                    value: "soldOut",
                  },
                ].map((option) => (
                  <Button
                    key={option.value}
                    type="button"
                    size="sm"
                    variant={
                      draft.soldOut === option.value ? "default" : "outline"
                    }
                    onClick={() =>
                      setDraft((prev) => ({
                        ...prev,
                        soldOut: option.value as CatalogFilters["soldOut"],
                      }))
                    }
                    className={
                      draft.soldOut === option.value
                        ? "bg-primary text-primary-foreground"
                        : ""
                    }
                  >
                    {option.label}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          <DrawerFooter className="flex-row gap-2 border-t border-border pt-4">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={handleClear}
            >
              {clearLabelText}
            </Button>
            <Button
              type="button"
              className="flex-1 bg-primary text-primary-foreground"
              onClick={handleApply}
            >
              {applyLabelText}
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
}
