# Sheger Motors

Car dealership website for browsing, filtering, and managing vehicle listings in Addis Ababa.

Customers can search the catalogue and view vehicle photos and specs. Admins can add, edit, and delete listings, and upload photos.

## Stack

| Layer | Technology |
| --- | --- |
| Frontend | React, Vite, MUI, Axios, React Router |
| Backend | Node.js, Express |
| Database | PostgreSQL (Supabase) |
| Auth | JWT + bcrypt |
| Images | Supabase Storage |

## Pages

| Route | Description |
| --- | --- |
| `/` | Home and featured vehicles |
| `/vehicles` | Catalogue with filters |
| `/vehicles/:id` | Vehicle details and photos |
| `/contact` | Contact page |
| `/admin/login` | Admin sign in |
| `/admin/dashboard` | Manage listings and upload photos |

## Prerequisites

- Node.js 18 or later
- A [Supabase](https://supabase.com/dashboard) project
- npm

## 1. Create a Supabase project

1. Open the [Supabase dashboard](https://supabase.com/dashboard) and create a project.
2. Copy:
   - **Project URL** — Project Settings → API
   - **service_role** key — Project Settings → API (server only, never put this in the client)
   - **Session pooler URI** — Project Settings → Database, or [Connect](https://supabase.com/dashboard/project/_?showConnect=true)

Use the **session pooler** (port `5432`, host `*.pooler.supabase.com`). Direct `db.*.supabase.co` hosts are IPv6-only and often fail on Windows.

If the database password contains `@` or `#`, URL-encode them (`@` → `%40`, `#` → `%23`).

## 2. Create the storage bucket

Vehicle photos are stored in a public bucket named **`vehicle-images`**. The name must match exactly.

**Create it here:** [Supabase Storage buckets](https://supabase.com/dashboard/project/bkhhbkqcupaidbgvumdg/storage/buckets)

For a different project, open [Storage](https://supabase.com/dashboard/project/_/storage/buckets) after selecting that project.

1. Click **New bucket**.
2. Name: `vehicle-images`
3. Turn **Public bucket** on (the site uses public image URLs).
4. Click **Create bucket**.

Without this bucket, uploads fail with `Bucket not found`.

## 3. Create the database tables

In the Supabase [SQL Editor](https://supabase.com/dashboard/project/bkhhbkqcupaidbgvumdg/sql), paste and run `server/database/schema.sql`.

That creates:

- `users` — admin accounts
- `vehicles` — listings
- `vehicle_images` — photo URLs
- `inquiries` — customer messages

## 4. Configure environment variables

### Server (`server/.env`)

Copy `server/.env.example` to `server/.env` and fill in real values:

```env
PORT=5000
CLIENT_URL=http://localhost:5173

DATABASE_URL="postgresql://postgres.YOUR_PROJECT_REF:YOUR_PASSWORD@aws-1-eu-west-1.pooler.supabase.com:5432/postgres"

JWT_SECRET=a-long-random-string

SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
SUPABASE_SECRET_KEY=your-service-role-key
```

Use the **service_role** key for `SUPABASE_SECRET_KEY`, not the anon key.

### Client (`client/.env`)

Copy `client/.env.example` to `client/.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

## 5. Install and run

Use two terminals.

**API**

```bash
cd server
npm install
npm run dev
```

The API runs at [http://localhost:5000](http://localhost:5000).

**Frontend**

```bash
cd client
npm install
npm run dev
```

The app runs at [http://localhost:5173](http://localhost:5173).

## 6. Create an admin user

From the `server` folder (do not `cd server` again if you are already there):

```bash
node scripts/createAdmin.js
```

Default login:

| Field | Value |
| --- | --- |
| Email | `admin@shegermotors.com` |
| Password | `ChangeThisPassword123!` |

Change this password before using the app in production.

Sign in at [http://localhost:5173/admin/login](http://localhost:5173/admin/login).

## Project structure

```
sheger-Motors/
├── client/                 React + Vite frontend
│   ├── src/pages/          Home, catalogue, details, admin
│   └── src/services/api.js Axios client
└── server/
    ├── database/schema.sql Tables
    ├── scripts/createAdmin.js
    └── src/
        ├── config/         Postgres + Supabase clients
        ├── controllers/
        ├── routes/
        └── services/imageService.js   Uploads to vehicle-images
```

## API overview

| Method | Path | Auth | Description |
| --- | --- | --- | --- |
| `GET` | `/api/vehicles` | Public | List vehicles (includes `images`) |
| `GET` | `/api/vehicles/:id` | Public | One vehicle (includes `images`) |
| `POST` | `/api/vehicles` | Admin | Create listing |
| `PUT` | `/api/vehicles/:id` | Admin | Update listing |
| `DELETE` | `/api/vehicles/:id` | Admin | Delete listing |
| `GET` | `/api/images/:vehicleId` | Public | Images for a vehicle |
| `POST` | `/api/images/:vehicleId` | Admin | Upload a photo |
| `DELETE` | `/api/images/:id` | Admin | Delete a photo |
| `POST` | `/api/auth/login` | Public | Admin login |
| `GET` | `/api/health` | Public | Database health check |

## Troubleshooting

| Problem | Fix |
| --- | --- |
| `password authentication failed for user "postgres"` | `DATABASE_URL` is wrong. Use the session pooler URI from the dashboard. |
| `getaddrinfo ENOTFOUND db....supabase.co` | Do not use the direct DB host. Use `*.pooler.supabase.com` on port `5432`. |
| `getaddrinfo ENOTFOUND base` | `DATABASE_URL` is malformed (duplicate `DATABASE_URL=`, unencoded `@`/`#`, or a placeholder host). |
| `Bucket not found` | Create the public `vehicle-images` bucket: [Storage](https://supabase.com/dashboard/project/bkhhbkqcupaidbgvumdg/storage/buckets). |
| Vehicle cards show a car icon, not a photo | Confirm the bucket is **public**, then refresh. Listings include `images` from `vehicle_images`. |
| `cd server` path not found | You are already in `server`. Run `npm run dev` or `node scripts/createAdmin.js` from there. |
