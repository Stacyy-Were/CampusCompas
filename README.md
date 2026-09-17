# Campus Compass

A recommendation system that helps students and parents find the
institution that fits them — by location, type, fees, and facilities.
Schools can register and upload a license for verification before they
appear in the system.

**Stack:** React + Vite + TypeScript + Tailwind + [motion](https://motion.dev) + React Router + Supabase (auth, database, storage). Deploys to Vercel.

## Project structure

```
src/
  main.tsx              # React entry point
  App.tsx               # Route definitions
  index.css             # Tailwind entry
  lib/
    supabase.ts          # Supabase client
    types.ts             # Institution / School types
  components/
    Navbar.tsx
    InstitutionCard.tsx
    ProtectedRoute.tsx    # Guards /admin — requires an authenticated admin
  pages/
    Home.tsx              # /
    FindInstitution.tsx    # /find — preference-based search
    Institutions.tsx       # /institutions — browse all verified institutions
    AboutUs.tsx             # /about
    ForSchools.tsx          # /schools — registration + license upload
    Login.tsx               # /login
    AdminPanel.tsx           # /admin — approve/reject pending schools
supabase/
  schema.sql              # Tables, RLS policies, storage bucket
```

## 1. Install

```bash
npm install
```

## 2. Set up Supabase

1. Create a project at [supabase.com](https://supabase.com).
2. In the SQL editor, paste and run `supabase/schema.sql`. It creates:
   - `institutions` — verified, publicly searchable records
   - `schools` — a school's registration draft (info + license file path)
     until an admin approves it
   - `profiles` — each auth user's role (`admin` or `school`)
   - a private `licenses` storage bucket with RLS so a school can only
     access its own uploaded file, and admins can read all of them
3. Copy `.env.example` to `.env` and fill in your project URL and anon key
   (Project Settings → API).

## 3. Add your background image

Drop your homepage image into `public/` and make sure the filename matches
what `src/pages/Home.tsx` references (or edit that file to point at your
own filename).

## 4. Run locally

```bash
npm run dev
```

## 5. Create your first admin account

1. Go to `/schools` and register (any placeholder details are fine) — this
   creates a real Supabase auth user.
2. In the SQL editor, promote that user:
   ```sql
   insert into profiles (id, role) values ('<their-auth-user-id>', 'admin');
   ```
   (Find the id under Authentication → Users in the Supabase dashboard.)
3. Log in at `/login` — you'll land on `/admin` and can approve or reject
   pending schools. Approving copies a school's draft info into
   `institutions` with `verified = true`, which makes it show up on
   `/find` and `/institutions`.

## How it fits together

- **Public visitors** never need an account — `/find` and `/institutions`
  only read `verified = true` rows.
- **Schools** sign up on `/schools`, submit their info, and upload a
  license (PDF or image) to the private `licenses` bucket. This creates a
  `pending` row — nothing public yet.
- **Admins** log in at `/login`, land on `/admin`, and see every pending
  school with its uploaded license path. Approving creates the matching
  `institutions` row; rejecting marks it `rejected`.

## Deploying

**Vercel:** import the repo, framework preset "Vite" (auto-detected), add
the two `VITE_SUPABASE_*` env vars in the project settings, deploy.

**Replacing your existing GitHub repo:** delete everything in the repo
except `.git/`, copy the contents of this folder into the repo root,
then:

```bash
git add -A
git commit -m "Rebuild as a Vite + React SPA"
git push
```

## Still to build

- Editing/deleting existing institutions from `/admin` (currently
  approve/reject is the only write action there)
- Email notifications on approval/rejection
- A status page for schools to check on their own pending application
