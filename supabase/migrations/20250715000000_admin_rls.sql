-- Admin panel schema: Hardened RLS policies + image storage
-- Run this in the Supabase SQL editor or via `supabase db push`

-- ---------------------------------------------------------------------------
-- productos: row-level security (Hardened)
-- ---------------------------------------------------------------------------

alter table public.productos enable row level security;

-- Restricted read: Owners can only view their own products (Replaced public read)
drop policy if exists "productos_select_public" on public.productos;
drop policy if exists "productos_select_owner" on public.productos;
create policy "productos_select_owner"
  on public.productos for select
  using (auth.uid() = owner);

-- Owners manage their own products
drop policy if exists "productos_insert_owner" on public.productos;
create policy "productos_insert_owner"
  on public.productos for insert
  with check (auth.uid() = owner);

drop policy if exists "productos_update_owner" on public.productos;
create policy "productos_update_owner"
  on public.productos for update
  using (auth.uid() = owner)
  with check (auth.uid() = owner);

drop policy if exists "productos_delete_owner" on public.productos;
create policy "productos_delete_owner"
  on public.productos for delete
  using (auth.uid() = owner);

-- Auto-set owner on insert when not provided
create or replace function public.set_product_owner()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.owner is null then
    new.owner := auth.uid();
  end if;
  return new;
end;
$$;

drop trigger if exists productos_set_owner on public.productos;
create trigger productos_set_owner
  before insert on public.productos
  for each row
  execute function public.set_product_owner();

-- ---------------------------------------------------------------------------
-- Storage bucket for product images
-- ---------------------------------------------------------------------------

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'product-images',
  'product-images',
  true,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
on conflict (id) do nothing;

drop policy if exists "product_images_select" on storage.objects;
create policy "product_images_select"
  on storage.objects for select
  using (bucket_id = 'product-images');

drop policy if exists "product_images_insert" on storage.objects;
create policy "product_images_insert"
  on storage.objects for insert
  with check (
    bucket_id = 'product-images'
    and auth.role() = 'authenticated'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "product_images_update" on storage.objects;
drop policy if exists "product_images_update" on storage.objects;
create policy "product_images_update"
  on storage.objects for update
  using (
    bucket_id = 'product-images'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

drop policy if exists "product_images_delete" on storage.objects;
create policy "product_images_delete"
  on storage.objects for delete
  using (
    bucket_id = 'product-images'
    and auth.uid()::text = (storage.foldername(name))[1]
  );
