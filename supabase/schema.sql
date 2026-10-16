-- Executa este ficheiro no SQL Editor do projeto Supabase.
-- Cria primeiro o utilizador administrador em Authentication > Users.
-- Depois substitui o UUID abaixo pelo User UID desse utilizador e executa o INSERT.

create extension if not exists pgcrypto;

create table if not exists public.store_admins (
  user_id uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 1 and 100),
  category text not null check (category in ('Motor', 'Travagem', 'Suspensão', 'Carroçaria', 'Elétrica', 'Interior', 'Outros')),
  condition text not null check (condition in ('Usada', 'Nova', 'Recondicionada')),
  price numeric(10, 2) not null check (price >= 0),
  reference text not null default '' check (char_length(reference) <= 60),
  description text not null check (char_length(description) between 1 and 1200),
  seo_title text not null check (char_length(seo_title) between 1 and 65),
  seo_description text not null check (char_length(seo_description) between 1 and 160),
  negotiable boolean not null default false,
  image_path text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists products_created_at_idx on public.products (created_at desc);
create index if not exists products_category_idx on public.products (category);

alter table public.store_admins enable row level security;
alter table public.products enable row level security;

grant usage on schema public to anon, authenticated;
grant select on public.store_admins to authenticated;
grant select on public.products to anon, authenticated;
grant insert, update, delete on public.products to authenticated;

drop policy if exists "Admins can read their own admin record" on public.store_admins;
create policy "Admins can read their own admin record"
  on public.store_admins for select to authenticated
  using (user_id = (select auth.uid()));

drop policy if exists "Products are readable by everyone" on public.products;
create policy "Products are readable by everyone"
  on public.products for select to anon, authenticated
  using (true);

drop policy if exists "Admins can add products" on public.products;
create policy "Admins can add products"
  on public.products for insert to authenticated
  with check (exists (
    select 1 from public.store_admins
    where user_id = (select auth.uid())
  ));

drop policy if exists "Admins can edit products" on public.products;
create policy "Admins can edit products"
  on public.products for update to authenticated
  using (exists (
    select 1 from public.store_admins
    where user_id = (select auth.uid())
  ))
  with check (exists (
    select 1 from public.store_admins
    where user_id = (select auth.uid())
  ));

drop policy if exists "Admins can delete products" on public.products;
create policy "Admins can delete products"
  on public.products for delete to authenticated
  using (exists (
    select 1 from public.store_admins
    where user_id = (select auth.uid())
  ));

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('product-images', 'product-images', true, 15728640, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do update
set public = excluded.public,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Product images are public" on storage.objects;
create policy "Product images are public"
  on storage.objects for select to anon, authenticated
  using (bucket_id = 'product-images');

drop policy if exists "Admins can upload product images" on storage.objects;
create policy "Admins can upload product images"
  on storage.objects for insert to authenticated
  with check (
    bucket_id = 'product-images'
    and exists (select 1 from public.store_admins where user_id = (select auth.uid()))
  );

drop policy if exists "Admins can update product images" on storage.objects;
create policy "Admins can update product images"
  on storage.objects for update to authenticated
  using (
    bucket_id = 'product-images'
    and exists (select 1 from public.store_admins where user_id = (select auth.uid()))
  )
  with check (
    bucket_id = 'product-images'
    and exists (select 1 from public.store_admins where user_id = (select auth.uid()))
  );

drop policy if exists "Admins can delete product images" on storage.objects;
create policy "Admins can delete product images"
  on storage.objects for delete to authenticated
  using (
    bucket_id = 'product-images'
    and exists (select 1 from public.store_admins where user_id = (select auth.uid()))
  );

-- O utilizador administrador já criado em Authentication > Users:
insert into public.store_admins (user_id)
values ('b4112f43-cc7a-4ee4-b8a7-24293e971c14')
on conflict (user_id) do nothing;