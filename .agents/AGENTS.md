# Shivaay Enterprises — Master Project Instructions

> **This is a LIVE, PRODUCTION B2B wholesale distribution platform serving real business customers.**
> Every change must be treated with the same discipline as a production deployment at a Fortune 500 company.

---

## 1. Project Context

### Business Overview
- **Company:** Shivaay Enterprise — a wholesale distribution company for soft drinks, beverages, FMCG products, and general store supplies.
- **Location:** Ankleshwar, Bharuch, Gujarat, India.
- **Domain:** [shivaayenterprise.com](https://shivaayenterprise.com)
- **Audience:** B2B wholesale buyers, retail shop owners, and end consumers browsing the product catalogue.

### Technology Stack
- **Framework:** React 19 with Vite 8 (module-type ES project)
- **Styling:** Tailwind CSS v4 (via `@tailwindcss/vite` plugin, NOT Tailwind v3 config files)
- **Animation:** Framer Motion 12
- **Icons:** Lucide React
- **Routing:** React Router DOM 7 (BrowserRouter, `<Routes>` / `<Route>`)
- **Backend / Database:** Supabase (PostgreSQL) via `@supabase/supabase-js` v2
- **Build Optimisations:** Babel with React Compiler preset (`babel-plugin-react-compiler`)
- **Deployment:** Vercel (with `vercel.json` rewrites for SPA routing)
- **Admin PWA:** Service worker registration in `admin.html` with web app manifest

### Dual-Entry Architecture
This project is a **multi-entry Vite application** with two completely separate entry points:

| Entry        | HTML              | JS Entry            | Vite Config             | Build Output   | Dev Port |
|--------------|-------------------|----------------------|-------------------------|----------------|----------|
| **Public**   | `index.html`      | `src/main.jsx`       | `vite.config.js`        | `dist/`        | 5173     |
| **Admin**    | `admin.html`      | `src/admin-main.jsx` | `vite.admin.config.js`  | `dist-admin/`  | 5174     |

- The public site and admin panel share the same `src/` codebase but have **separate routing trees**.
- Public routes: `/`, `/products`, `/products/:id`, `/contact`, `/about`, `/login`
- Admin routes: `/admin/login`, `/admin/dashboard`, `/admin/products`
- The `vercel.json` rewrites handle SPA fallback routing for both entry points.
- **Never merge admin routes into `main.jsx` or public routes into `admin-main.jsx`.**

### NPM Scripts
| Script         | Purpose                                          |
|----------------|--------------------------------------------------|
| `npm run dev`  | Start public site dev server (port 5173)         |
| `npm run dev:admin` | Start admin panel dev server (port 5174)   |
| `npm run build` | Production build for public site → `dist/`      |
| `npm run build:admin` | Production build for admin → `dist-admin/` |
| `npm run lint` | ESLint static analysis                           |

---

## 2. Production Safety

> **⚠️ CRITICAL: This application has real production data, real customers, and real business operations.**

### Absolute Rules
1. **NEVER** run destructive database operations (`DROP TABLE`, `DELETE FROM` without `WHERE`, `TRUNCATE`, schema column removal) without explicit user confirmation.
2. **NEVER** modify, overwrite, or delete `.env` files. Environment variables contain live Supabase credentials.
3. **NEVER** push, deploy, or run `vercel deploy` without explicit user approval.
4. **NEVER** modify `vercel.json` rewrite rules without understanding the routing impact on both entry points.
5. **NEVER** alter the Supabase project URL or anon key.
6. **NEVER** delete or rename the `product-images` Supabase Storage bucket.

### Before Any Change
- Ask: *"Could this break the live site for existing users?"*
- Ask: *"Could this corrupt or delete production data?"*
- Ask: *"Is this change reversible without data loss?"*
- If the answer to any of these is "yes" or "maybe," **stop and confirm with the user first.**

### Data Changes
- All database mutations (INSERT, UPDATE, DELETE) to production tables must be done through the existing UI flows or with explicit user confirmation.
- Never run bulk data modifications via scripts without user approval.
- Always test data-affecting queries with a `SELECT` first to verify the scope.

---

## 3. Development Workflow

### Getting Started
```bash
npm install           # Install dependencies
npm run dev           # Public site at localhost:5173
npm run dev:admin     # Admin panel at localhost:5174
```

### Code Change Process
1. **Understand** the existing code before modifying anything.
2. **Prefer** editing existing files over creating new ones when the change is small.
3. **Test** changes by running the dev server (`npm run dev` or `npm run dev:admin`).
4. **Lint** with `npm run lint` after modifications.
5. **Build** (`npm run build` and/or `npm run build:admin`) to verify there are no production build errors before declaring work complete.

### Tailwind CSS v4 Specifics
- Tailwind v4 uses `@import "tailwindcss"` in `src/index.css` — there is **no `tailwind.config.js`**.
- Custom theme tokens are defined with `@theme { }` blocks in `index.css`.
- Custom fonts are declared as `--font-*` theme variables (e.g., `--font-sans`, `--font-heading`).
- The base layer uses `@layer base { }` for global body styles.
- **Do NOT** create a `tailwind.config.js` file. **Do NOT** use `@tailwind base/components/utilities` directives (v3 syntax).

### Font System
- **Primary body font:** Manrope (via `font-sans`)
- **Heading font:** Space Grotesk (via `font-heading`)
- **Decorative fonts:** Multiple display fonts are registered for branding purposes (Wellfleet, Barriecito, Akronim, Niconne, Caesar Dressing, Love Ya Like A Sister, Road Rage, Frijole)
- All fonts are loaded via Google Fonts in `index.html` and `admin.html`.

---

## 4. Supabase & Database Rules

### Client Configuration
- Supabase client is initialised in `src/lib/supabase.js` as a **single shared instance**.
- It uses `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` from the `.env` file.
- **Always import the client from `src/lib/supabase.js`** — never create a second client instance.

### Known Tables
| Table       | Used By                                                    | Operations                            |
|-------------|-----------------------------------------------------------|---------------------------------------|
| `products`  | Public Products page, ProductDetails, Admin Products page | SELECT, INSERT, UPDATE, DELETE        |
| `profiles`  | AdminProtectedRoute (role-based auth check)               | SELECT (role check)                   |

### Known Storage Buckets
| Bucket           | Purpose                                    |
|------------------|--------------------------------------------|
| `product-images` | Product catalogue images (WebP, compressed)|

### Products Table Schema (observed from code)
Columns used in code: `id`, `name`, `description`, `price`, `image_url`, `is_active`, `category`, `created_at`, `updated_at`

### Database Safety Rules
1. **Never DROP or ALTER tables** without explicit user confirmation and a rollback plan.
2. **Never DELETE rows** in bulk — always use specific `WHERE` clauses.
3. **Prefer soft-deletes** (e.g., `is_active = false`) over hard deletes when introducing new deletion flows.
4. When adding new columns, always use `ALTER TABLE ... ADD COLUMN ... DEFAULT` to avoid breaking existing rows.
5. **Never disable or weaken Row Level Security (RLS)** policies. If RLS policies exist, preserve them.
6. **Test all Supabase queries** with `.select()` first before running mutations.
7. When uploading images, always clean up old images from storage when replacing (the existing pattern in `AdminProducts.jsx` already does this).

### Auth Pattern
- Admin authentication uses `supabase.auth.signInWithPassword()` (email + password).
- Admin authorisation checks the `profiles` table for `role === 'admin'` via `AdminProtectedRoute`.
- Logout uses `supabase.auth.signOut()`.
- The public customer login page (`/login`) is currently a placeholder — it does not authenticate.

---

## 5. Security Rules

### Environment Variables
- `.env` is gitignored and contains live Supabase credentials.
- **Never hardcode** Supabase URLs, API keys, or any secrets in source code.
- **Never commit** `.env` files to version control.
- Always access environment variables via `import.meta.env.VITE_*`.

### Authentication & Authorisation
- The admin panel is protected by `AdminProtectedRoute`, which checks both session validity AND admin role in the `profiles` table.
- **Never bypass** or weaken the `AdminProtectedRoute` guard.
- **Never expose** admin-only operations (INSERT, UPDATE, DELETE on products) through the public site.
- Admin routes live exclusively in `admin-main.jsx` — never add admin routes to the public `App.jsx`.

### Client-Side Security
- All user inputs must be sanitised before being sent to Supabase.
- Image uploads are validated for file type (JPEG, PNG, WebP) and size (max 5 MB) before upload.
- Images are compressed and converted to WebP before uploading to Supabase Storage.
- Never use `dangerouslySetInnerHTML` unless absolutely necessary and content is sanitised.

### CORS & API
- The Supabase anon key is a **publishable** key with limited permissions — it is expected to be in the client bundle.
- All sensitive operations should be gated by RLS policies on the Supabase side, not just client-side checks.

---

## 6. UI/UX Design System Rules

All generated web apps, pages, components, and UI must follow this enterprise-grade design system:

### Visual Hierarchy
- H1: 48-64px, Bold, Max 2 lines
- H2: 36-44px, Bold
- H3: 28-32px, Semi Bold
- Body: 16-18px, comfortable line height
- Small Text: 14px
- Buttons: 16px, Semi Bold

### Typography
- Font: Inter (preferred), Manrope, or System Sans Serif
- Use consistent font weights and generous line heights. No cramped text.

### Spacing & Grid System
- Follow strict 8-point spacing: 4, 8, 12, 16, 24, 32, 40, 48, 64, 80, 96, 120px.
- Section Padding: 96px (desktop), 72px (tablet), 56px (mobile).
- Container: Max width 1280px, centered.
- Horizontal Padding: 24px (desktop), 20px (tablet), 16px (mobile).
- Grid: 12 cols (desktop), 8 cols (tablet), 4 cols (mobile). Align cards perfectly.

### Border Radius
- Cards: 16px
- Buttons & Inputs: 12px
- Images: 16px
- Large Containers: 24px

### Shadow System
- Only subtle shadows (very soft elevation). Never heavy. Slightly stronger on hover.

### Color Palette
- Primary: Deep Navy `#0F172A`
- Secondary: Pure White `#FFFFFF`
- Accent / CTA: Professional Red `#DC2626`
- Text Primary: `#111827`
- Text Secondary: `#6B7280`
- Border: `#E5E7EB`
- Background: `#F8FAFC`
- Muted Background: `#F1F5F9`
- Semantic: Success `#16A34A`, Warning `#F59E0B`, Danger `#DC2626`

### Buttons & Inputs
- Primary Button: Solid Deep Navy, White Text, Rounded, slight lift on hover.
- Secondary Button: White, Border, light gray bg on hover.
- CTA Button: Accent Red.
- Forms: Large inputs, consistent height, rounded corners, proper focus states.

### Icons & Animations
- Icons: Lucide React ONLY. Use sizes 20px, 24px, or 32px consistently.
- Animations: Framer Motion only. Subtle and professional (fade, slide up, scale, opacity), 200-400ms duration.
- Hover States: Cards (slight lift/shadow), Buttons (color/scale), Links (underline/color), Images (slight zoom).

### Layout & Composition
- Design mobile-first. No overflow, no broken layouts, consistent spacing.
- Sections: Differentiate through spacing and composition, not random colors.
- Navbar: Sticky, 72-80px height, logo left, nav center/right.
- Footer: Dark background, corporate style (multiple cols, business info, quick links).
- Code Organization: Split UI into reusable primitives, avoid duplicate JSX, never create huge components.

### General Philosophy
- Professional, premium, elegant, trustworthy, minimal, confident, clean, spacious.
- Avoid generic templates, visual clutter, flashing, and childish elements.
- Similar quality to Stripe, Vercel, Notion, Linear, Webflow.

---

## 7. Code Architecture & Organization

### Directory Structure
```
src/
├── admin-main.jsx          # Admin panel entry point
├── main.jsx                # Public site entry point
├── App.jsx                 # Public site root component (routes + PublicLayout)
├── index.css               # Tailwind v4 imports + theme tokens + base layer
├── lib/
│   └── supabase.js         # Single Supabase client instance
├── context/
│   └── CartContext.jsx      # Cart state via useReducer + localStorage persistence
├── layouts/
│   └── AdminLayout.jsx      # Admin shell (sidebar + topbar + content area)
├── pages/
│   ├── About.jsx
│   ├── Contact.jsx
│   ├── Login.jsx            # Public login placeholder (coming soon)
│   ├── Products.jsx
│   ├── ProductDetails.jsx
│   └── admin/
│       ├── AdminLogin.jsx
│       ├── AdminDashboard.jsx
│       └── AdminProducts.jsx
├── components/
│   ├── common/              # Shared across all public pages
│   │   ├── Navbar.jsx
│   │   ├── Footer.jsx
│   │   ├── ScrollToTop.jsx
│   │   └── WhatsAppIcon.jsx
│   ├── home/                # Home page section components
│   │   ├── Hero.jsx
│   │   ├── TrustSection.jsx
│   │   └── WholeCTA.jsx
│   ├── contact/             # Contact page section components
│   │   ├── ContactHero.jsx
│   │   ├── ContactInfo.jsx
│   │   ├── ContactMap.jsx
│   │   ├── ContactCTA.jsx
│   │   └── ContactFAQ.jsx
│   ├── cart/                # Cart drawer and item components
│   │   ├── CartDrawer.jsx
│   │   └── CartItem.jsx
│   ├── admin/               # Admin-specific components
│   │   └── AdminSidebar.jsx
│   ├── auth/                # Authentication guards
│   │   └── AdminProtectedRoute.jsx
│   ├── ui/                  # Reserved for atomic/primitive components
│   ├── context/             # Reserved (unused — primary context in src/context/)
│   ├── layout/              # Reserved for reusable layout wrappers
│   └── pages/               # Reserved
├── constants/               # Reserved for static data
└── utils/                   # Reserved for utility functions
```

### Established Patterns to Follow

#### Component Patterns
- **Functional components only** — no class components.
- **Named function declarations** for sub-components within a file (e.g., `function StatCard()`, `function EmptyState()`).
- **Default exports** for the main page/component export; named exports for hooks and utilities.
- Components follow the pattern: imports → constants/variants → sub-components → main component → export.

#### State Management
- **React Context + `useReducer`** for global state (see `CartContext.jsx`).
- **Local `useState`** for component-level state (loading, errors, form fields).
- **`useCallback`** for memoised async data-fetching functions.
- **`useEffect`** for data fetching on mount and side effects.
- Cart state is persisted to `localStorage` under key `shivaay_cart_v1`.

#### Data Fetching
- All data fetching goes through the shared `supabase` client from `src/lib/supabase.js`.
- Pattern: `useState` (data, loading, error) → `useCallback` (fetch function) → `useEffect` (trigger on mount).
- Always handle loading, error, and empty states with dedicated UI components.

#### Animation Pattern
- Framer Motion `variants` objects defined at the top of the file (e.g., `fadeUp`, `slideDown`).
- Use `initial`, `animate`, `exit` props on `motion.div` elements.
- Use `whileInView` with `viewport={{ once: true }}` for scroll-triggered animations.
- Use `AnimatePresence` for mount/unmount transitions (modals, drawers, forms).
- Keep animation durations between 200-400ms. Use `easeOut` easing.

#### Layout Pattern
- **Public site:** `PublicLayout` wraps each route with `Navbar` + `CartDrawer` + `Footer`.
- **Admin panel:** `AdminLayout` wraps each admin page with `AdminSidebar` + topbar.
- Max content width: `1280px` (public) / `1200px` (admin).

#### Image Handling
- Product images are uploaded to Supabase Storage (`product-images` bucket).
- Images are client-side compressed to WebP (max 1200px dimension, 80% quality) before upload.
- Unique filenames are generated with timestamp + random string.
- All `<img>` tags include `onError` handlers for graceful fallback display.
- Product listing images use `loading="lazy"`, detail images use `loading="eager"`.

#### Form Patterns
- Forms use local `useState` for each field or a single form object state.
- Validation happens on submit, not on every keystroke.
- Feedback is shown via inline error/success banners with semantic colors.
- Submit buttons show loading spinners during async operations.
- Reusable form primitives: `FieldWrapper`, `TextInput`, `TextAreaInput` (in `AdminProducts.jsx`).

### Rules for Code Changes
1. **Reuse existing components** — check `src/components/` before creating new ones.
2. **Follow existing naming conventions** — PascalCase for components, camelCase for functions/variables.
3. **Keep files focused** — one primary exported component per file. Sub-components within the same file are acceptable if they are tightly coupled.
4. **Avoid unnecessary rewrites** — if existing code works, enhance it rather than rewrite it.
5. **Import paths** — use relative paths from the current file, not path aliases.
6. **Static data** — store in `src/constants/` files, not inline in components.
7. **Unique IDs** — all interactive elements should have unique, descriptive `id` attributes for testing.

---

## 8. Responsive Design & Accessibility

### Breakpoint Strategy
The project uses Tailwind's default responsive breakpoints with mobile-first design:
- **Default (no prefix):** Mobile < 640px
- **`sm:`** ≥ 640px (large phones / small tablets)
- **`md:`** ≥ 768px (tablets)
- **`lg:`** ≥ 1024px (desktops)
- **`xl:`** ≥ 1280px (large desktops)

### Responsive Patterns Used
- The Navbar collapses into a hamburger menu on mobile (`md:hidden` / `hidden md:flex`).
- Product grids adapt: 2 cols (mobile) → 3 cols (md) → 4 cols (lg).
- Admin sidebar: fixed on `lg+`, drawer overlay on mobile.
- Product details page: stacked (mobile) → side-by-side (md+).
- Mobile sticky bottom bar on ProductDetails for cart/inquiry actions.
- Section padding scales down on smaller screens.

### Accessibility Requirements
- All buttons and interactive elements must have `aria-label` attributes when they lack visible text.
- Use `aria-expanded` on toggles (hamburger menu, drawers).
- Use `role="alert"` and `aria-live="assertive"` for error messages.
- Maintain proper heading hierarchy (`h1` → `h2` → `h3`), one `h1` per page.
- Ensure sufficient color contrast ratios (the design palette is pre-approved for contrast).
- All images must have meaningful `alt` text.
- Form inputs must have associated `<label>` elements (using `htmlFor`).
- Use `focus:outline` / `focus-visible:ring` for keyboard navigation focus states.

### SEO Practices
- The Contact page dynamically sets page title, meta description, and canonical URL via `useEffect`.
- Apply the same pattern when creating new pages.
- Use semantic HTML elements (`<section>`, `<main>`, `<nav>`, `<header>`, `<footer>`).

---

## 9. Testing & Verification

### Verification Checklist
After making any change, verify the following as applicable:

1. **Build passes:** `npm run build` and/or `npm run build:admin` complete without errors.
2. **Lint passes:** `npm run lint` returns no errors.
3. **Dev server runs:** `npm run dev` and/or `npm run dev:admin` start without errors.
4. **No console errors:** Check browser dev tools for runtime errors.
5. **Responsive behaviour:** Test at mobile (375px), tablet (768px), and desktop (1280px) widths.
6. **Data operations:** If database mutations were changed, verify they work with real data.
7. **Auth flows:** If auth-related code was modified, verify login/logout/protected routes.
8. **Navigation:** Verify all routes render correctly and links work.

### Common Gotchas
- Tailwind v4 does NOT have a `tailwind.config.js` — custom tokens go in `index.css` `@theme {}`.
- The admin panel runs on a separate Vite config and port — test it independently.
- The `dist-admin/` build renames `admin.html` → `index.html` for Vercel compatibility.
- Cart state persists in `localStorage` — clear it during testing if cart state is stale.

---

## 10. Agent Behavior

### Core Principles
1. **Inspect before modifying.** Always read and understand the existing code before proposing changes. Never assume the structure — verify it.
2. **Understand context.** Read related files (imports, parent components, routes) to understand how a component fits into the larger application.
3. **Reuse existing patterns.** Before creating a new component, hook, or utility, check if one already exists. Follow the patterns established in the codebase.
4. **Make the smallest appropriate change.** Do not refactor or rewrite code that is not directly related to the current task.
5. **Avoid unnecessary rewrites.** Working code should be enhanced, not rewritten. Changing code style or structure without functional improvement is unacceptable.

### Before Making Changes
- Read the file(s) you intend to modify.
- Read adjacent files (imports, dependents) to understand dependencies.
- Check if the component/pattern already exists elsewhere in the project.
- Confirm the change doesn't conflict with the dual-entry architecture.

### During Changes
- Follow the established code patterns (see Section 7).
- Use the design system colors, spacing, and typography (see Section 6).
- Maintain all existing comments and docstrings that are unrelated to the change.
- Preserve existing accessibility attributes (`aria-*`, `role`, `alt`, `htmlFor`).
- Give interactive elements unique, descriptive `id` attributes.

### Destructive Operations — Ask First
Always request explicit user confirmation before:
- Deleting or dropping database tables, columns, or rows.
- Removing or renaming files.
- Modifying environment variables or deployment configuration.
- Changing authentication or authorisation logic.
- Altering Supabase RLS policies or storage bucket configurations.
- Running any operation that cannot be easily undone.

### After Changes
- Test that the dev server starts without errors.
- Verify the build completes without errors.
- Check that affected functionality works correctly.
- Confirm responsive behaviour is maintained.
- Verify no console errors or warnings were introduced.

### Communication
- When proposing significant changes, explain the reasoning and potential impact.
- When multiple approaches exist, present options with trade-offs rather than making assumptions.
- When uncertain about business logic or requirements, ask the user rather than guessing.
- When a change might affect production data or live users, flag it explicitly.
