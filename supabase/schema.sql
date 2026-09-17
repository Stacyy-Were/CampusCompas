-- Campus Compass — Supabase schema
-- Run this in the Supabase SQL editor (or via `supabase db push`).

create extension if not exists "pgcrypto";

-- Institutions that appear in search/recommendations
create table if not exists institutions (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  type text not null,               -- University | College | TVET | High School
  county text not null,
  location text not null,
  fee_min integer not null default 0,
  fee_max integer not null default 0,
  facilities text[] not null default '{}',
  description text,
  image_url text,
  verified boolean not null default false,
  created_at timestamptz not null default now()
);

-- School registration + verification workflow.
-- Holds the draft institution info until an admin approves it.
create table if not exists schools (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  contact_email text not null,
  type text not null,
  county text not null,
  location text not null,
  fee_min integer not null default 0,
  fee_max integer not null default 0,
  facilities text[] not null default '{}',
  description text,
  license_file_path text,
  fee_structure_file_path text,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  institution_id uuid references institutions(id),
  created_at timestamptz not null default now()
);

-- Role for anyone with an auth account (admin vs school)
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role text not null default 'school' check (role in ('admin', 'school')),
  created_at timestamptz not null default now()
);

-- Row Level Security
alter table institutions enable row level security;
alter table schools enable row level security;
alter table profiles enable row level security;

create policy "Public can view verified institutions"
  on institutions for select
  using (verified = true);

create policy "Admins manage institutions"
  on institutions for all
  using (exists (select 1 from profiles where id = auth.uid() and role = 'admin'));

create policy "Schools can register"
  on schools for insert
  with check (auth.uid() = owner_id);

create policy "Schools can view own registration"
  on schools for select
  using (auth.uid() = owner_id);

create policy "Admins manage schools"
  on schools for all
  using (exists (select 1 from profiles where id = auth.uid() and role = 'admin'));

create policy "Users view own profile"
  on profiles for select
  using (auth.uid() = id);

-- Storage bucket for license documents (private — not publicly readable)
insert into storage.buckets (id, name, public)
values ('licenses', 'licenses', false),
       ('fee-structures', 'fee-structures', false)
on conflict (id) do nothing;

create policy "Schools upload their own license"
  on storage.objects for insert
  with check (bucket_id = 'licenses' and auth.uid()::text = (storage.foldername(name))[1]);

create policy "Schools view their own license"
  on storage.objects for select
  using (bucket_id = 'licenses' and auth.uid()::text = (storage.foldername(name))[1]);

create policy "Schools upload their own fee structure"
  on storage.objects for insert
  with check (bucket_id = 'fee-structures' and auth.uid()::text = (storage.foldername(name))[1]);

create policy "Schools view their own fee structure"
  on storage.objects for select
  using (bucket_id = 'fee-structures' and auth.uid()::text = (storage.foldername(name))[1]);

create policy "Admins view all licenses"
  on storage.objects for select
  using (
    bucket_id in ('licenses', 'fee-structures')
    and exists (select 1 from profiles where id = auth.uid() and role = 'admin')
  );

-- After you sign up your own admin account through /schools (Supabase
-- creates the auth user), promote it:
--   insert into profiles (id, role) values ('<your-auth-user-id>', 'admin');
