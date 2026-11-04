"use client";

import { useId, useState } from "react";
import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { resolveCanonicalValue } from "@/lib/attribute-options";

type EditableFieldProps = {
  label: string;
  value: string;
  onSave: (value: string) => Promise<void>;
  multiline?: boolean;
  type?: "text" | "number";
  suggestions?: string[];
};

export function EditableField({
  label,
  value,
  onSave,
  multiline = false,
  type = "text",
  suggestions = [],
}: EditableFieldProps) {
  const listId = useId();
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState(value);
  const [saving, setSaving] = useState(false);

  const handleOpen = () => {
    setDraft(value);
    setOpen(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const resolved =
        type === "number" ? draft : resolveCanonicalValue(draft, suggestions);
      await onSave(resolved);
      setOpen(false);
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={handleOpen}
        className="inline-flex items-center gap-1.5 rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
        title={`Editar ${label}`}
      >
        <Pencil className="size-3.5" />
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Editar {label}</DialogTitle>
            <DialogDescription>Modificá el valor del campo.</DialogDescription>
          </DialogHeader>

          <div className="space-y-3">
            <Label htmlFor="edit-field">{label}</Label>
            {multiline ? (
              <Textarea
                id="edit-field"
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                rows={4}
              />
            ) : (
              <>
                <Input
                  id="edit-field"
                  type={type}
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  list={suggestions.length > 0 ? listId : undefined}
                />
                {suggestions.length > 0 ? (
                  <datalist id={listId}>
                    {suggestions.map((s) => (
                      <option key={s} value={s} />
                    ))}
                  </datalist>
                ) : null}
              </>
            )}

            {/* Simple, flat suggestion chips matching the catalog's direct mapping */}
            {type !== "number" && suggestions.length > 0 ? (
              <div className="flex flex-wrap gap-1.5 pt-1 max-h-40 overflow-y-auto">
                {suggestions.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setDraft(s)}
                    className="text-xs px-2.5 py-1 rounded-full border border-border bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                  >
                    {s}
                  </button>
                ))}
              </div>
            ) : null}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={saving}
            >
              Cancelar
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? "Guardando…" : "Guardar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
