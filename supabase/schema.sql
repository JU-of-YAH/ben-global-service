create extension if not exists "pgcrypto";
create table if not exists public.cars (
 id uuid primary key default gen_random_uuid(), slug text unique not null, marque text not null, modele text not null,
 annee integer, prix numeric, kilometrage integer, carburant text, boite text, carrosserie text, places integer,
 couleur text, ville text default 'Abidjan', description text, images text[] default '{}', equipements text[] default '{}',
 disponible boolean default true, created_at timestamptz default now(), updated_at timestamptz default now()
);
create table if not exists public.leads (
 id uuid primary key default gen_random_uuid(), type text not null check(type in ('contact','test_drive','sell')),
 name text not null, phone text not null, email text, message text, car_slug text, created_at timestamptz default now()
);
alter table public.cars enable row level security;
alter table public.leads enable row level security;
create policy "public can read available cars" on public.cars for select using (disponible=true);
