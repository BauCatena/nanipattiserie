'use client'

import { useId, useRef, useState } from 'react'
import { ImagePlus, Pencil, Trash2, X } from 'lucide-react'
import { toast } from 'sonner'

import { ProductGallery } from '@/components/ProductGallery'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createBrowserSupabaseClient } from '@/lib/supabase-browser'
import {
  canonicalizeAttributeRows,
  valuesForKey,
  type AttributeOptions,
} from '@/lib/attribute-options'

type EditableGalleryProps = {
  images: string[]
  alt: string
  onSave: (urls: string[]) => Promise<void>
  userId: string
}

export function EditableGallery({ images, alt, onSave, userId }: EditableGalleryProps) {
  const [open, setOpen] = useState(false)
  const [draft, setDraft] = useState<string[]>(images)
  const [newUrl, setNewUrl] = useState('')
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const handleOpen = () => {
    setDraft(images.length > 0 ? images : [''])
    setNewUrl('')
    setOpen(true)
  }

  const addUrl = () => {
    const trimmed = newUrl.trim()
    if (!trimmed) return
    setDraft((prev) => [...prev.filter(Boolean), trimmed])
    setNewUrl('')
  }

  const removeUrl = (index: number) => {
    setDraft((prev) => prev.filter((_, i) => i !== index))
  }

  const handleUpload = async (file: File) => {
    setUploading(true)
    try {
      const supabase = createBrowserSupabaseClient()
      const ext = file.name.split('.').pop() ?? 'jpg'
      const path = `${userId}/${Date.now()}.${ext}`
      const { error } = await supabase.storage.from('product-images').upload(path, file)
      if (error) throw error
      const { data } = supabase.storage.from('product-images').getPublicUrl(path)
      setDraft((prev) => [...prev.filter(Boolean), data.publicUrl])
      toast.success('Imagen subida')
    } catch {
      toast.error('Error al subir imagen')
    } finally {
      setUploading(false)
    }
  }

  const handleSave = async () => {
    const valid = draft.filter((u) => u.trim())
    if (valid.length === 0) {
      toast.error('Agregá al menos una imagen')
      return
    }
    setSaving(true)
    try {
      await onSave(valid)
      setOpen(false)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="relative">
      <ProductGallery images={images} alt={alt} />
      <button
        type="button"
        onClick={handleOpen}
        className="absolute top-3 right-3 inline-flex items-center gap-1.5 rounded-full bg-background/90 border border-border px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground shadow-sm transition-colors"
      >
        <Pencil className="size-3.5" />
        Editar imágenes
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Imágenes del producto</DialogTitle>
          </DialogHeader>

          <div className="space-y-3 max-h-60 overflow-y-auto">
            {draft.filter(Boolean).map((url, i) => (
              <div key={`${url}-${i}`} className="flex items-center gap-2">
                <Input value={url} readOnly className="text-xs" />
                <Button type="button" variant="ghost" size="icon" onClick={() => removeUrl(i)}>
                  <X className="size-4" />
                </Button>
              </div>
            ))}
          </div>

          <div className="space-y-2">
            <Label>Agregar URL</Label>
            <div className="flex gap-2">
              <Input
                placeholder="https://..."
                value={newUrl}
                onChange={(e) => setNewUrl(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addUrl()}
              />
              <Button type="button" variant="outline" onClick={addUrl}>
                Agregar
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label>O subir archivo</Label>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) handleUpload(file)
                e.target.value = ''
              }}
            />
            <Button
              type="button"
              variant="outline"
              className="w-full gap-2"
              disabled={uploading}
              onClick={() => fileRef.current?.click()}
            >
              <ImagePlus className="size-4" />
              {uploading ? 'Subiendo…' : 'Subir imagen'}
            </Button>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)} disabled={saving}>
              Cancelar
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? 'Guardando…' : 'Guardar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

type EditableAttributesProps = {
  attributes: { key: string; value: string }[]
  onSave: (attrs: { key: string; value: string }[]) => Promise<void>
  attributeOptions: AttributeOptions
}

function SuggestionChips({
  suggestions,
  onSelect,
}: {
  suggestions: string[]
  onSelect: (value: string) => void
}) {
  if (suggestions.length === 0) return null
  return (
    <div className="flex flex-wrap gap-1">
      {suggestions.map((s) => (
        <button
          key={s}
          type="button"
          onClick={() => onSelect(s)}
          className="text-xs px-2 py-0.5 rounded-full border border-border bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          {s}
        </button>
      ))}
    </div>
  )
}

function AttributeRow({
  row,
  index,
  attributeOptions,
  onUpdate,
  onRemove,
}: {
  row: { key: string; value: string }
  index: number
  attributeOptions: AttributeOptions
  onUpdate: (index: number, field: 'key' | 'value', val: string) => void
  onRemove: (index: number) => void
}) {
  const keyListId = useId()
  const valueListId = useId()
  const valueSuggestions = valuesForKey(row.key, attributeOptions)

  return (
    <div className="space-y-1.5 rounded-lg border border-border/60 p-3">
      <div className="flex gap-2 items-start">
        <div className="flex-1 space-y-1">
          <Label className="text-xs text-muted-foreground">Clave</Label>
          <Input
            placeholder="color"
            value={row.key}
            onChange={(e) => onUpdate(index, 'key', e.target.value)}
            list={attributeOptions.attributeKeys.length > 0 ? keyListId : undefined}
          />
          {attributeOptions.attributeKeys.length > 0 ? (
            <datalist id={keyListId}>
              {attributeOptions.attributeKeys.map((k) => (
                <option key={k} value={k} />
              ))}
            </datalist>
          ) : null}
          <SuggestionChips
            suggestions={attributeOptions.attributeKeys}
            onSelect={(k) => onUpdate(index, 'key', k)}
          />
        </div>
        <div className="flex-1 space-y-1">
          <Label className="text-xs text-muted-foreground">Valor</Label>
          <Input
            placeholder="rojo"
            value={row.value}
            onChange={(e) => onUpdate(index, 'value', e.target.value)}
            list={valueSuggestions.length > 0 ? valueListId : undefined}
          />
          {valueSuggestions.length > 0 ? (
            <datalist id={valueListId}>
              {valueSuggestions.map((v) => (
                <option key={v} value={v} />
              ))}
            </datalist>
          ) : null}
          <SuggestionChips
            suggestions={valueSuggestions}
            onSelect={(v) => onUpdate(index, 'value', v)}
          />
        </div>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="mt-6 shrink-0"
          onClick={() => onRemove(index)}
        >
          <Trash2 className="size-4" />
        </Button>
      </div>
    </div>
  )
}

export function EditableAttributes({
  attributes,
  onSave,
  attributeOptions,
}: EditableAttributesProps) {
  const [open, setOpen] = useState(false)
  const [draft, setDraft] = useState(attributes)
  const [saving, setSaving] = useState(false)

  const handleOpen = () => {
    setDraft(attributes.length > 0 ? [...attributes] : [{ key: '', value: '' }])
    setOpen(true)
  }

  const updateRow = (index: number, field: 'key' | 'value', val: string) => {
    setDraft((prev) => prev.map((row, i) => (i === index ? { ...row, [field]: val } : row)))
  }

  const addRow = () => setDraft((prev) => [...prev, { key: '', value: '' }])

  const removeRow = (index: number) => {
    setDraft((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSave = async () => {
    const canonical = canonicalizeAttributeRows(draft, attributeOptions)
    setSaving(true)
    try {
      await onSave(canonical)
      setOpen(false)
    } finally {
      setSaving(false)
    }
  }

  if (attributes.length === 0 && !open) {
    return (
      <button
        type="button"
        onClick={handleOpen}
        className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground"
      >
        <Pencil className="size-3" />
        Agregar filtros avanzados
      </button>
    )
  }

  return (
    <>
      <div className="flex flex-wrap gap-2 items-center">
        {attributes.map((attr) => (
          <span
            key={attr.key}
            className="text-xs px-2 py-1 rounded-full bg-background border border-border text-muted-foreground"
          >
            {attr.key}: {attr.value}
          </span>
        ))}
        <button
          type="button"
          onClick={handleOpen}
          className="inline-flex items-center gap-1 rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          <Pencil className="size-3.5" />
        </button>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Filtros avanzados</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Elegí claves y valores existentes para evitar duplicados (ej: color ≠ Color).
          </p>

          <div className="space-y-2 max-h-72 overflow-y-auto">
            {draft.map((row, i) => (
              <AttributeRow
                key={i}
                row={row}
                index={i}
                attributeOptions={attributeOptions}
                onUpdate={updateRow}
                onRemove={removeRow}
              />
            ))}
          </div>

          <Button type="button" variant="outline" size="sm" onClick={addRow}>
            + Atributo
          </Button>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)} disabled={saving}>
              Cancelar
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? 'Guardando…' : 'Guardar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
