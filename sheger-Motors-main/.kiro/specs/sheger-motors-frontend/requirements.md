# Requirements Document

## Introduction

Sheger Motors Frontend is a professional car-dealership single-page application (SPA) for a small car seller based in Addis Ababa, Ethiopia. The application is built with React + Vite, Material UI (MUI v6), React Router v7, and Axios. It consumes an existing Express/PostgreSQL backend REST API at `http://localhost:5000/api`.

The system serves two audiences:

1. **Public visitors** — browse available vehicles, view full specifications, and contact the seller by phone or Telegram to arrange an in-person inspection and purchase. There is no e-commerce flow (no cart, checkout, or payment).
2. **Administrators** — authenticate via a protected login page and manage the vehicle catalogue (create, read, update, delete) through a protected dashboard.

The frontend lives entirely in the `client/` directory and implements all pages described in the design document while preserving existing file names, route structure, `vite.config.js`, and `package.json` configuration.

---

## Glossary

- **Application**: The Sheger Motors React SPA running in the browser.
- **API_Service**: The Axios instance defined in `src/services/api.js` that communicates with the backend.
- **Backend**: The existing Express/PostgreSQL REST API at `http://localhost:5000/api` (read-only from the frontend's perspective).
- **Filter_Engine**: The `filterAndSortVehicles` pure function that applies filter and sort state to a local vehicle array.
- **Home_Page**: The React component rendered at route `/`.
- **Vehicles_Page**: The React component rendered at route `/vehicles`.
- **Vehicle_Details_Page**: The React component rendered at route `/vehicles/:id`.
- **Contact_Page**: The React component rendered at route `/contact`.
- **Admin_Login_Page**: The React component rendered at route `/admin/login`.
- **Admin_Dashboard**: The React component rendered at route `/admin/dashboard`.
- **Navbar**: The top navigation bar component rendered on every page.
- **Footer**: The site-wide footer component rendered on every page.
- **VehicleCard**: The reusable card component representing a single vehicle.
- **VehicleGrid**: The responsive grid wrapper that renders a list of VehicleCard components.
- **VehicleFilters**: The filter panel component on the Vehicles page.
- **ProtectedRoute**: The route guard component that redirects unauthenticated users to `/admin/login`.
- **Price_Formatter**: The `formatPrice` utility function.
- **JWT**: JSON Web Token used for admin authentication, stored in `localStorage` under the key `"token"`.
- **ETB**: Ethiopian Birr, the currency unit displayed for vehicle prices.
- **CRUD**: Create, Read, Update, Delete operations on vehicle records.
- **Snackbar**: A MUI `<Snackbar>` notification component used for transient feedback.

---

## Requirements

### Requirement 1: Application Shell and Navigation

**User Story:** As a visitor, I want a consistent navigation bar and footer on every page, so that I can easily move between sections of the site and find contact information.

#### Acceptance Criteria

1. THE Application SHALL render the Navbar and Footer on every page regardless of the active route.
2. THE Navbar SHALL display the brand name "Sheger Motors" as a text logo on the left side.
3. THE Navbar SHALL display navigation links for Home, Vehicles, and Contact on desktop viewports.
4. THE Navbar SHALL display a "Browse Cars" call-to-action button styled with the accent colour on the right side.
5. WHEN the active route changes, THE Navbar SHALL highlight the corresponding navigation link.
6. WHEN the viewport width is mobile-sized, THE Navbar SHALL collapse navigation links into a drawer triggered by a hamburger icon button.
7. THE Navbar SHALL be sticky with position fixed and a backdrop blur effect.
8. THE Footer SHALL display the brand name, tagline, navigation links, a phone placeholder ("PHONE_NUMBER_HERE"), a Telegram placeholder ("TELEGRAM_USERNAME_HERE"), a location ("Addis Ababa"), and the copyright line "© 2026 Sheger Motors".
9. THE Application SHALL apply the Sheger Motors MUI theme with primary colour `#0A1929` (deep navy), secondary colour `#F59E0B` (amber), and background colour `#F8F9FA` (off-white) to all components.
10. THE Application SHALL wrap all routes in `<ThemeProvider>` and `<CssBaseline>`.

---

### Requirement 2: Home Page

**User Story:** As a visitor, I want an engaging home page that introduces the dealership and lets me quickly search for vehicles, so that I can understand the business and start browsing efficiently.

#### Acceptance Criteria

1. WHEN the user navigates to `/`, THE Home_Page SHALL display a hero section with a background image, headline, sub-headline, and two CTA buttons labelled "Browse Vehicles" and "Contact Us".
2. WHEN the user clicks "Browse Vehicles" on the hero, THE Application SHALL navigate to `/vehicles`.
3. WHEN the user clicks "Contact Us" on the hero, THE Application SHALL navigate to `/contact`.
4. THE Home_Page SHALL display a trust tagline "Quality Vehicles • Trusted Service • Addis Ababa" in the hero section.
5. THE Home_Page SHALL display a quick-search bar with fields for brand/model text, condition (All/New/Used), minimum price, and maximum price.
6. WHEN the user submits the quick-search form, THE Application SHALL navigate to `/vehicles` with the search parameters serialised as URL query parameters.
7. THE Home_Page SHALL display a featured vehicles section that renders available vehicles using the VehicleGrid component.
8. THE Home_Page SHALL display static informational sections including "Why Choose Us" and "How It Works".

---

### Requirement 3: Vehicle Listing Page

**User Story:** As a visitor, I want to browse all available vehicles with filtering and sorting options, so that I can find cars that match my needs and budget.

#### Acceptance Criteria

1. WHEN the user navigates to `/vehicles`, THE Vehicles_Page SHALL call `API_Service.getVehicles()` to fetch all vehicles from the backend.
2. WHILE vehicles are loading, THE Vehicles_Page SHALL display skeleton loading cards in place of actual vehicle cards.
3. WHEN vehicles have loaded, THE Vehicles_Page SHALL display vehicle cards in a responsive MUI Grid with 1 column on xs breakpoint, 2 columns on sm breakpoint, 3 columns on md breakpoint, and 4 columns on lg breakpoint.
4. WHEN the Vehicles_Page mounts with URL query parameters from the quick-search bar, THE Vehicles_Page SHALL pre-populate the filter state from those query parameters.
5. THE Vehicles_Page SHALL display a VehicleFilters panel with fields for search text, brand, condition, fuel type, transmission, body type, year range (min/max), price range (min/max), and sort order.
6. WHEN the user changes any filter or sort value, THE Filter_Engine SHALL re-filter and re-sort the vehicle list in memory without making a new API request.
7. WHEN all filter fields are at their default values, THE Filter_Engine SHALL return all fetched vehicles sorted by newest (descending id).
8. WHEN a non-default filter is active, THE Filter_Engine SHALL return only vehicles that satisfy every active filter condition simultaneously.
9. WHEN the Filter_Engine applies any active filter, THE Filter_Engine SHALL return a result set whose length is less than or equal to the unfiltered list length.
10. WHEN the user clicks the reset button on VehicleFilters, THE Vehicles_Page SHALL restore all filter fields to their default values.
11. WHEN no vehicles match the current filter state, THE Vehicles_Page SHALL display an EmptyState component with message "No vehicles match your filters." and a "Clear Filters" action button.
12. WHEN the API call fails, THE Vehicles_Page SHALL display a MUI Alert with severity "error" and a "Try Again" button that re-triggers the fetch.
13. THE Filter_Engine SHALL perform text search case-insensitively against the vehicle's brand and model fields combined.
14. THE Vehicles_Page SHALL use `React.useMemo` to memoize the filtered and sorted vehicle list to avoid unnecessary recomputation.

---

### Requirement 4: Vehicle Details Page

**User Story:** As a visitor, I want to view the full specification of a vehicle and contact the seller directly, so that I can assess the car and arrange an in-person inspection.

#### Acceptance Criteria

1. WHEN the user navigates to `/vehicles/:id`, THE Vehicle_Details_Page SHALL call `API_Service.getVehicle(id)` to fetch the vehicle.
2. WHEN the vehicle has loaded, THE Vehicle_Details_Page SHALL display all vehicle fields: brand, model, year, price (formatted in ETB), mileage (in km), fuel type, transmission, engine, colour, body type, condition, description, location, and status.
3. WHEN the vehicle price is displayed, THE Price_Formatter SHALL format it as a locale-formatted number followed by " ETB" (e.g., "2,600,000 ETB").
4. THE Vehicle_Details_Page SHALL display a "Call Seller" button that opens a `tel:PHONE_NUMBER_HERE` link.
5. THE Vehicle_Details_Page SHALL display a "Contact on Telegram" button that opens a `https://t.me/TELEGRAM_USERNAME_HERE` link.
6. THE Vehicle_Details_Page SHALL display an image placeholder area with a grey background and a car icon, indicating that Supabase image integration is deferred.
7. IF the backend returns a 404 response for the requested vehicle id, THEN THE Vehicle_Details_Page SHALL display an EmptyState component with message "Vehicle not found." and an action button "Back to Vehicles" that navigates to `/vehicles`.
8. IF the backend returns any non-404 error, THEN THE Vehicle_Details_Page SHALL display a MUI Alert with severity "error".

---

### Requirement 5: Contact Page

**User Story:** As a visitor, I want a dedicated contact page with the seller's phone, Telegram handle, and location, so that I know how to reach Sheger Motors to inquire about a vehicle.

#### Acceptance Criteria

1. WHEN the user navigates to `/contact`, THE Contact_Page SHALL display the seller's phone placeholder "PHONE_NUMBER_HERE".
2. THE Contact_Page SHALL display the seller's Telegram username placeholder "TELEGRAM_USERNAME_HERE".
3. THE Contact_Page SHALL display the business location "Addis Ababa, Ethiopia".
4. THE Contact_Page SHALL not contain any e-commerce elements such as a cart, checkout form, or payment section.
5. THE Contact_Page SHALL display instructions informing the visitor that purchases are arranged in person after contacting the seller.

---

### Requirement 6: Admin Authentication

**User Story:** As an administrator, I want to log in with my email and password, so that I can access the protected vehicle management dashboard.

#### Acceptance Criteria

1. WHEN the admin navigates to `/admin/login`, THE Admin_Login_Page SHALL display a login form with email and password fields and a submit button.
2. WHEN the admin submits a valid email and password, THE API_Service SHALL call `POST /api/auth/login` with the credentials.
3. WHEN the backend returns a JWT token on successful login, THE Admin_Login_Page SHALL store the token in `localStorage` under the key `"token"` and navigate to `/admin/dashboard`.
4. IF the backend returns a 401 response, THEN THE Admin_Login_Page SHALL display an inline MUI Alert with severity "error" and message "Invalid email or password."
5. IF the backend returns any non-401 error during login, THEN THE Admin_Login_Page SHALL display an inline MUI Alert with severity "error" and message "An error occurred. Please try again."
6. WHILE a login request is in flight, THE Admin_Login_Page SHALL display a loading indicator and disable the submit button to prevent duplicate submissions.
7. THE Admin_Login_Page SHALL not render or navigate to the dashboard before the JWT token is stored in localStorage.

---

### Requirement 7: Authentication Guard

**User Story:** As an administrator, I want protected routes to redirect unauthenticated users to the login page, so that the dashboard cannot be accessed without valid credentials.

#### Acceptance Criteria

1. WHEN a user attempts to access `/admin/dashboard` without a token in localStorage, THE ProtectedRoute SHALL redirect the user to `/admin/login`.
2. WHEN a user has a valid token in localStorage, THE ProtectedRoute SHALL render the protected page component.
3. THE ProtectedRoute SHALL never render its children when `localStorage.getItem("token")` returns `null` or an empty string.
4. WHEN the admin logs out, THE Admin_Dashboard SHALL remove the token from localStorage and navigate to `/admin/login`.

---

### Requirement 8: Admin Dashboard — Vehicle Management

**User Story:** As an administrator, I want a full CRUD interface for vehicles, so that I can keep the vehicle catalogue up to date.

#### Acceptance Criteria

1. WHEN the admin navigates to `/admin/dashboard`, THE Admin_Dashboard SHALL call `API_Service.getVehicles()` and display the results in a data table.
2. THE Admin_Dashboard vehicle table SHALL display at minimum: brand, model, year, price, condition, status, and action buttons for Edit and Delete.
3. WHEN the admin clicks "Add Vehicle", THE Admin_Dashboard SHALL open a dialog containing an empty vehicle form with all required fields (brand, model, year, price, mileage, fuel type, transmission, engine, colour, body type, condition, description, location, status).
4. WHEN the admin submits a valid Add Vehicle form, THE Admin_Dashboard SHALL call `API_Service.createVehicle(data)` and, on success, add the returned vehicle object to the displayed list.
5. WHEN a vehicle is successfully created, THE Admin_Dashboard SHALL display the new vehicle exactly once in the vehicle table.
6. WHEN the admin clicks "Edit" on a vehicle row, THE Admin_Dashboard SHALL open the vehicle form dialog pre-filled with that vehicle's current data.
7. WHEN the admin submits a valid Edit form, THE Admin_Dashboard SHALL call `API_Service.updateVehicle(id, data)` and, on success, replace the updated row in the table with the returned vehicle object.
8. WHEN the admin clicks "Delete" on a vehicle row, THE Admin_Dashboard SHALL display a confirmation dialog before making any API call.
9. WHEN the admin confirms the deletion, THE Admin_Dashboard SHALL call `API_Service.deleteVehicle(id)` and, on success, remove the vehicle with that id from the table.
10. WHEN a vehicle is successfully deleted, THE Admin_Dashboard SHALL contain no row with the deleted vehicle's id.
11. IF any CRUD API call fails, THEN THE Admin_Dashboard SHALL display a MUI Snackbar with an error message and SHALL NOT mutate the vehicle list.
12. WHEN a CRUD operation succeeds, THE Admin_Dashboard SHALL display a MUI Snackbar with a success message.
13. THE Admin_Dashboard SHALL not include any image upload interface (Supabase image integration is deferred).

---

### Requirement 9: API Service

**User Story:** As a developer, I want a centralised Axios service with JWT injection and error handling, so that all API calls are consistent and authenticated requests are handled automatically.

#### Acceptance Criteria

1. THE API_Service SHALL create a single Axios instance with `baseURL` set to `http://localhost:5000/api`.
2. THE API_Service SHALL implement a request interceptor that reads `localStorage.getItem("token")` and attaches an `Authorization: Bearer <token>` header to every outgoing request when a token is present.
3. WHEN no token is present in localStorage, THE API_Service SHALL send the request without an Authorization header.
4. THE API_Service SHALL expose the following functions: `getVehicles()`, `getVehicle(id)`, `loginAdmin(credentials)`, `createVehicle(data)`, `updateVehicle(id, data)`, `deleteVehicle(id)`.
5. WHEN `getVehicles()` is called, THE API_Service SHALL make a `GET /api/vehicles` request and return the Axios response promise.
6. WHEN `getVehicle(id)` is called with a valid id, THE API_Service SHALL make a `GET /api/vehicles/:id` request and return the Axios response promise.
7. WHEN `loginAdmin(credentials)` is called, THE API_Service SHALL make a `POST /api/auth/login` request with the credentials in the request body and SHALL NOT store the token (the caller is responsible for storage).
8. WHEN `createVehicle(data)` is called, THE API_Service SHALL make a `POST /api/vehicles` request with the vehicle data in the request body.
9. WHEN `updateVehicle(id, data)` is called, THE API_Service SHALL make a `PUT /api/vehicles/:id` request with the updated data in the request body.
10. WHEN `deleteVehicle(id)` is called, THE API_Service SHALL make a `DELETE /api/vehicles/:id` request.

---

### Requirement 10: Price Formatting

**User Story:** As a visitor, I want vehicle prices displayed in a clear, locale-formatted format with the currency unit, so that I can understand the price without ambiguity.

#### Acceptance Criteria

1. WHEN a valid numeric price value is passed to the Price_Formatter, THE Price_Formatter SHALL return a string formatted as a locale number followed by " ETB" (e.g., `"2,600,000 ETB"`).
2. WHEN a price value that cannot be parsed as a finite number is passed, THE Price_Formatter SHALL return the string `"Price N/A"`.
3. THE Price_Formatter SHALL accept both `string` and `number` types as input.
4. THE Price_Formatter SHALL always return a non-empty string for any input value.

---

### Requirement 11: Vehicle Card Display

**User Story:** As a visitor, I want each vehicle card to show key information at a glance, so that I can quickly compare vehicles in the grid.

#### Acceptance Criteria

1. THE VehicleCard SHALL display an image placeholder area (grey background with a car icon) in place of a real image, since Supabase image integration is deferred.
2. THE VehicleCard SHALL display the vehicle brand and model as the card title.
3. THE VehicleCard SHALL display the vehicle year, mileage, fuel type, and transmission as chips or badges.
4. THE VehicleCard SHALL display the vehicle price formatted using the Price_Formatter (e.g., "2,600,000 ETB").
5. THE VehicleCard SHALL display a condition badge indicating "New" or "Used".
6. THE VehicleCard SHALL display a "View Details" button that navigates to `/vehicles/:id` for that vehicle.

---

### Requirement 12: Loading and Empty States

**User Story:** As a visitor, I want clear visual feedback when data is loading or unavailable, so that I understand the application state at all times.

#### Acceptance Criteria

1. WHEN data is being fetched, THE Application SHALL display a Loading component showing skeleton cards equal to the configured count (default 6).
2. WHEN no vehicles are present in the database, THE Vehicles_Page SHALL display an EmptyState component with message "No vehicles are currently listed."
3. WHEN filter results are empty, THE Vehicles_Page SHALL display an EmptyState component with a "Clear Filters" action button.
4. THE EmptyState component SHALL accept a `message` string prop, an optional `actionLabel` string prop, and an optional `onAction` callback prop.
5. WHEN an `actionLabel` and `onAction` prop are provided to EmptyState, THE EmptyState SHALL display a button labelled with `actionLabel` that calls `onAction` when clicked.

---

### Requirement 13: Responsive Design

**User Story:** As a visitor using any device, I want the site to be usable on mobile, tablet, and desktop screen sizes, so that I can browse vehicles from any device.

#### Acceptance Criteria

1. THE Application SHALL be usable on mobile viewports (≥ 320px wide), tablet viewports (≥ 600px wide), and desktop viewports (≥ 1200px wide).
2. THE VehicleGrid SHALL display 1 column on xs breakpoint, 2 columns on sm breakpoint, 3 columns on md breakpoint, and 4 columns on lg breakpoint.
3. WHEN the viewport is mobile-sized, THE Navbar SHALL hide desktop navigation links and display a hamburger icon button.
4. WHEN the user taps the hamburger icon, THE Navbar SHALL open a slide-in Drawer containing the navigation links.
5. WHEN the user selects a link from the mobile Drawer, THE Navbar SHALL close the Drawer and navigate to the selected route.
6. WHEN displayed on mobile, THE VehicleFilters SHALL be presented as a collapsible drawer rather than a persistent sidebar.

---

### Requirement 14: No E-Commerce Features

**User Story:** As the business owner, I want the site to direct customers to contact me by phone or Telegram, so that purchases are arranged in person without any online transaction complexity.

#### Acceptance Criteria

1. THE Application SHALL not contain any shopping cart, checkout flow, payment form, or order management feature.
2. THE Application SHALL display "PHONE_NUMBER_HERE" as the seller's phone contact placeholder throughout the site.
3. THE Application SHALL display "TELEGRAM_USERNAME_HERE" as the seller's Telegram contact placeholder throughout the site.
4. WHEN a visitor wants to purchase a vehicle, THE Application SHALL direct the visitor to contact the seller via phone or Telegram.
