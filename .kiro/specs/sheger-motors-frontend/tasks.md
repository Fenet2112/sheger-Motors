# Implementation Plan: Sheger Motors Frontend

## Overview

Implement the complete Sheger Motors React SPA inside the `client/` directory. All pages exist as stub files — each will be fully replaced. The implementation follows the design document's component hierarchy and MUI theme specification, consuming the existing Express/PostgreSQL backend at `http://localhost:5000/api`.

**Implementation language**: JavaScript (JSX) — React + Vite project, no TypeScript for source files.

---

## Tasks

- [x] 1. Install missing dependency and scaffold utility files
  - Run `npm install @mui/icons-material` inside `client/`
  - Create `client/src/utils/format.js` with the `formatPrice` utility function
  - Create `client/src/utils/filterVehicles.js` with the `filterAndSortVehicles` pure function and `defaultFilters` constant
  - _Requirements: 3.6, 3.7, 3.8, 3.9, 10.1, 10.2, 10.3, 10.4_

- [x] 2. Implement API service (`src/services/api.js`)
  - [x] 2.1 Replace stub with full Axios instance, request interceptor, and all API functions
    - Create single Axios instance with `baseURL: "http://localhost:5000/api"`
    - Add request interceptor: reads `localStorage.getItem("token")` and attaches `Authorization: Bearer <token>` header when token is present; sends request without header when token is absent
    - Export named functions: `getVehicles()`, `getVehicle(id)`, `loginAdmin(credentials)`, `createVehicle(data)`, `updateVehicle(id, data)`, `deleteVehicle(id)`
    - `loginAdmin` must NOT store the token — callers are responsible for storage
    - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5, 9.6, 9.7, 9.8, 9.9, 9.10_

- [x] 3. Implement MUI theme and update `App.jsx`
  - [x] 3.1 Implement MUI theme and wrap application shell
    - Add `createTheme` with Sheger Motors palette: primary `#0A1929`, secondary `#F59E0B`, background `#F8F9FA`, typography Inter/Roboto, borderRadius 12, MuiButton and MuiCard overrides (see design MUI Theme Specification section)
    - Wrap entire tree in `<ThemeProvider theme={theme}>` and `<CssBaseline />`
    - Render `<Navbar />` above `<Routes>` and `<Footer />` below `<Routes>` so they appear on every page
    - Implement `ProtectedRoute` component in `App.jsx` (or `src/components/ProtectedRoute.jsx`): reads `localStorage.getItem("token")`; if null or empty string, returns `<Navigate to="/admin/login" replace />`; otherwise renders children
    - Wrap the `/admin/dashboard` route with `ProtectedRoute`
    - _Requirements: 1.1, 1.9, 1.10, 7.1, 7.2, 7.3_

- [x] 4. Implement Navbar (`src/components/Navbar.jsx`)
  - Replace stub with full responsive Navbar
  - Display "Sheger Motors" brand text logo on the left using MUI `Typography`
  - Desktop nav links: Home (`/`), Vehicles (`/vehicles`), Contact (`/contact`) — use `useLocation()` to detect active route and apply accent colour highlight
  - "Browse Cars" CTA button on the right, styled with secondary (amber) colour
  - Position fixed (sticky) with backdrop blur (`sx={{ backdropFilter: "blur(8px)" }}`)
  - Mobile: hide nav links, show hamburger `<IconButton>` that opens a MUI `<Drawer>` with the nav links listed vertically; close drawer on link click
  - _Requirements: 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 13.3, 13.4, 13.5_

- [x] 5. Implement Footer (`src/components/Footer.jsx`)
  - Create `client/src/components/Footer.jsx`
  - Display brand name "Sheger Motors" and tagline
  - Navigation links: Home, Vehicles, Contact
  - Contact block: phone `PHONE_NUMBER_HERE`, Telegram `TELEGRAM_USERNAME_HERE`, location `Addis Ababa`
  - Copyright line: `© 2026 Sheger Motors`
  - Dark navy background (`#0A1929`) with white text
  - _Requirements: 1.8, 14.2, 14.3_

- [x] 6. Implement reusable UI components
  - [x] 6.1 Implement `Loading.jsx` skeleton component
    - Create `client/src/components/Loading.jsx`
    - Accept `count` prop (default 6)
    - Render `count` MUI `<Skeleton>` cards in a responsive Grid (same column breakpoints as VehicleGrid)
    - _Requirements: 12.1_

  - [x] 6.2 Implement `EmptyState.jsx` component
    - Create `client/src/components/EmptyState.jsx`
    - Accept `message` (string, required), `actionLabel` (string, optional), `onAction` (function, optional)
    - Render centred icon, message text, and optional button labelled `actionLabel` that calls `onAction` on click
    - _Requirements: 12.2, 12.3, 12.4, 12.5_

  - [x] 6.3 Implement `VehicleCard.jsx`
    - Create `client/src/components/VehicleCard.jsx`
    - Accept `vehicle` prop (full vehicle object)
    - Image placeholder: grey `Box` with a car `<Icon>` centred (use `DirectionsCar` from `@mui/icons-material`)
    - Card title: `{vehicle.brand} {vehicle.model}`
    - Chips row: year, mileage (formatted as `{n.toLocaleString()} km`), fuel type, transmission
    - Condition badge: green chip for "New", grey chip for "Used"
    - Price displayed using `formatPrice(vehicle.price)`
    - "View Details" `<Button>` that calls `useNavigate(\`/vehicles/${vehicle.id}\`)`
    - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.5, 11.6_

  - [x] 6.4 Implement `VehicleGrid.jsx`
    - Create `client/src/components/VehicleGrid.jsx`
    - Accept `vehicles` (array) and `loading` (boolean) props
    - When `loading === true`: render `<Loading count={6} />`
    - When `vehicles.length === 0 && !loading`: render `<EmptyState message="No vehicles are currently listed." />`
    - Otherwise: render MUI `<Grid container spacing={3}>` with one `<Grid item xs={12} sm={6} md={4} lg={3}>` per vehicle, each containing a `<VehicleCard vehicle={v} />`
    - _Requirements: 3.3, 12.1, 12.2, 13.2_

- [x] 7. Implement `Hero.jsx`
  - Create `client/src/components/Hero.jsx`
  - Full-viewport-height section with `hero.png` as background image and a dark overlay (`rgba(0,0,0,0.6)`)
  - Headline (e.g. "Find Your Perfect Car in Addis Ababa"), sub-headline, trust tagline "Quality Vehicles • Trusted Service • Addis Ababa"
  - Two CTA buttons: "Browse Vehicles" → `useNavigate("/vehicles")`, "Contact Us" → `useNavigate("/contact")`
  - _Requirements: 2.1, 2.2, 2.3, 2.4_

- [x] 8. Implement `SearchBar.jsx` (Home page quick search)
  - Create `client/src/components/SearchBar.jsx`
  - Fields: brand/model `<TextField>`, condition `<Select>` (All/New/Used), min price `<TextField type="number">`, max price `<TextField type="number">`
  - "Search Cars" button that serialises non-empty values as URL query params and calls `useNavigate("/vehicles?q=...")`
  - _Requirements: 2.5, 2.6_

- [x] 9. Implement `VehicleFilters.jsx`
  - Create `client/src/components/VehicleFilters.jsx`
  - Accept `filters` (object), `onChange((key, value) => void)`, `onReset(() => void)` props
  - Filter fields (all controlled): search text, brand text, condition select, fuel_type select, transmission select, body_type select, year_min number, year_max number, price_min number, price_max number, sort order select
  - "Reset Filters" button that calls `onReset()`
  - On mobile viewports: render as a collapsible/toggle drawer; on desktop: render as a persistent sidebar panel
  - _Requirements: 3.5, 3.10, 13.6_

- [x] 10. Implement Home page (`src/pages/Home.jsx`)
  - Replace stub with full Home page
  - Section 1 (Hero): `<Hero />`
  - Section 2 (Quick Search): `<SearchBar />` with a heading like "Search Our Inventory"
  - Section 3 (Featured Vehicles): `<VehicleGrid vehicles={vehicles} loading={loading} />` — fetch vehicles via `getVehicles()` in `useEffect`, show up to 8 featured (e.g. latest 8 by id)
  - Section 4 (Why Choose Us): static grid of 3–4 benefit cards (Quality Assured, Trusted Seller, Addis Ababa Based, Easy Contact)
  - Section 5 (How It Works): static 3-step flow (Browse → Contact → Inspect & Buy)
  - Section 6 (CTA): full-width banner with "Ready to Find Your Car?" and "Browse Vehicles" button
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7, 2.8_

- [x] 11. Implement Vehicles page (`src/pages/Vehicles.jsx` — note: file is `vehicles.jsx`, rename to `Vehicles.jsx` matches import)
  - Replace stub with full Vehicles page
  - On mount: call `getVehicles()`, set `vehicles` state; read URL query params (`useSearchParams`) and pre-populate filter state
  - `defaultFilters` constant imported from `src/utils/filterVehicles.js`
  - `filteredVehicles` computed with `useMemo(() => filterAndSortVehicles(vehicles, filters), [vehicles, filters])`
  - Layout: sidebar `<VehicleFilters>` (desktop) / drawer `<VehicleFilters>` (mobile) + main area with result count (`"{n} vehicles found"`) and `<VehicleGrid vehicles={filteredVehicles} loading={loading} />`
  - On API error: show MUI `<Alert severity="error">` with "Try Again" button that re-triggers the fetch
  - When filtered list is empty: `<EmptyState message="No vehicles match your filters." actionLabel="Clear Filters" onAction={handleReset} />`
  - When API returns empty array: `<EmptyState message="No vehicles are currently listed." />`
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 3.8, 3.9, 3.10, 3.11, 3.12, 3.13, 3.14_

- [x] 12. Implement Vehicle Details page (`src/pages/VehicleDetails.jsx`)
  - Replace stub with full Vehicle Details page
  - Read `id` from `useParams()`; on mount call `getVehicle(id)`
  - Display all fields: brand, model, year, price (via `formatPrice`), mileage (`{n.toLocaleString()} km`), fuel type, transmission, engine, colour, body type, condition, description, location, status
  - Image placeholder: full-width grey `Box` with centred `DirectionsCar` icon
  - "Call Seller" button: `<Button component="a" href="tel:PHONE_NUMBER_HERE">Call Seller</Button>`
  - "Contact on Telegram" button: `<Button component="a" href="https://t.me/TELEGRAM_USERNAME_HERE" target="_blank">Contact on Telegram</Button>`
  - On 404: `<EmptyState message="Vehicle not found." actionLabel="Back to Vehicles" onAction={() => navigate('/vehicles')} />`
  - On other error: `<Alert severity="error">` with message
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7, 4.8, 14.2, 14.3, 14.4_

- [x] 13. Implement Contact page (`src/pages/Contact.jsx`)
  - Replace stub with full Contact page
  - Display phone placeholder: `PHONE_NUMBER_HERE`
  - Display Telegram placeholder: `TELEGRAM_USERNAME_HERE`
  - Display location: `Addis Ababa, Ethiopia`
  - Explain that purchases are arranged in person after contacting the seller (e.g. "Visit us in Addis Ababa or reach out by phone or Telegram to arrange an inspection.")
  - No cart, checkout, payment, or order management elements
  - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 14.1, 14.2, 14.3, 14.4_

- [x] 14. Implement Admin Login page (`src/pages/AdminLogin.jsx`)
  - Replace stub with full login form
  - Controlled `email` and `password` fields; submit button
  - On submit: call `loginAdmin({ email, password })`, store returned token in `localStorage.setItem("token", token)`, then `navigate("/admin/dashboard")`
  - On 401 response: inline `<Alert severity="error">Invalid email or password.</Alert>`
  - On non-401 error: inline `<Alert severity="error">An error occurred. Please try again.</Alert>`
  - While request is in-flight: show loading spinner and disable submit button
  - Do not navigate until token is stored
  - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6, 6.7_

- [x] 15. Implement Admin Dashboard (`src/pages/AdminDashboard.jsx`)
  - [x] 15.1 Vehicle table and data loading
    - Replace stub; on mount call `getVehicles()` and render results in a MUI `<Table>`
    - Table columns: Brand, Model, Year, Price (formatted), Condition, Status, Edit button, Delete button
    - "Add Vehicle" button above the table
    - Logout button: calls `localStorage.removeItem("token")` then `navigate("/admin/login")`
    - _Requirements: 8.1, 8.2, 7.4_

  - [x] 15.2 Add / Edit vehicle dialog
    - MUI `<Dialog>` that opens with empty `emptyForm` state when "Add Vehicle" is clicked, or pre-filled vehicle data when "Edit" is clicked
    - Form fields: brand, model, year, price, mileage, fuel_type (select), transmission (select), engine, color, body_type (select), condition (select), description (multiline), location, status (select)
    - On submit (Add): call `createVehicle(formData)`, on success append returned vehicle to list
    - On submit (Edit): call `updateVehicle(editingId, formData)`, on success replace the matching row in the list
    - _Requirements: 8.3, 8.4, 8.5, 8.6, 8.7, 8.13_

  - [x] 15.3 Delete confirmation dialog and snackbar feedback
    - On "Delete" click: open a `<Dialog>` confirmation ("Are you sure you want to delete this vehicle?")
    - On confirm: call `deleteVehicle(id)`, on success filter the deleted id out of the list
    - On any CRUD success: show `<Snackbar>` with success message; do NOT mutate list on error
    - On any CRUD error: show `<Snackbar>` with error message; leave list unchanged
    - _Requirements: 8.8, 8.9, 8.10, 8.11, 8.12_

- [x] 16. Checkpoint — Wire everything together and verify routing
  - Confirm `client/src/app.jsx` imports Footer correctly (currently missing Footer render)
  - Confirm `client/src/pages/vehicles.jsx` file name casing matches the import in `app.jsx` (import is `Vehicles`, file is `vehicles.jsx` — update file name to `Vehicles.jsx` or adjust import)
  - Confirm all new component files are imported in the pages that use them
  - Run `npm run build` inside `client/` to check for import errors and TypeScript/JSX issues; fix any reported errors
  - Ensure all tests pass, ask the user if questions arise.
  - _Requirements: 1.1, 1.9, 1.10_

- [x] 17. Responsive polish and final verification
  - Verify Navbar hamburger drawer works at 375px viewport width and closes on link click
  - Verify VehicleGrid column breakpoints (1 / 2 / 3 / 4) render correctly across xs/sm/md/lg
  - Verify VehicleFilters collapses to a toggle-drawer on mobile and renders as a sidebar on desktop
  - Verify `mt` / `pt` spacing on pages accounts for fixed Navbar height so content is not hidden behind it
  - Add `marginTop` offset to main content area (e.g. `mt: "64px"`) to clear the fixed Navbar
  - _Requirements: 13.1, 13.2, 13.3, 13.4, 13.5, 13.6_

- [x] 18. Final checkpoint — Build passes with no errors
  - Run `npm run build` inside `client/` and confirm zero errors
  - Ensure all tests pass, ask the user if questions arise.

---

## Notes

- Tasks marked with `*` are optional and can be skipped for a faster MVP (none in this plan — all tasks are core implementation)
- Each task references specific requirements for full traceability
- The design uses pseudocode, but implementation language is **JavaScript (JSX)**
- `client/src/pages/vehicles.jsx` should be renamed to `Vehicles.jsx` to match the casing convention used in `app.jsx`; update the import in `app.jsx` accordingly
- The design has a Correctness Properties section, but all properties (filter idempotency, price formatting, auth guard) are pure-function logic most efficiently verified manually during build rather than via automated test infrastructure that does not yet exist in this project
- Contact placeholders (`PHONE_NUMBER_HERE`, `TELEGRAM_USERNAME_HERE`) are intentional — do not replace with real values
- Image upload (Supabase) is explicitly deferred; use grey placeholder boxes with car icons throughout
- The `@mui/icons-material` package must be installed (Task 1) before any component that imports icons can compile
