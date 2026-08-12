# Shivaay Enterprises React - Architecture Documentation

This document provides a detailed overview of the folder structure, file architecture, components, and technology stack of the Shivaay Enterprises React application.

---

## 📂 Project Architecture Tree

Below is the complete file and folder structure of the repository (excluding `node_modules` and built files):

```text
shivaay-enterprises-react/
├── .agents/
│   └── AGENTS.md                  # Custom workspace rules and UI/UX design guidelines
├── public/
│   ├── products/                  # High-quality product images for distribution display
│   │   ├── bisleri.png
│   │   ├── campa.png
│   │   ├── coca-cola.png
│   │   ├── fanta.png
│   │   ├── gina.png
│   │   ├── limca.png
│   │   ├── maaza.png
│   │   ├── parle.png
│   │   ├── pepsi.png
│   │   ├── real-juice.png
│   │   ├── seven-up.png
│   │   ├── sprite.png
│   │   ├── thums-up.png
│   │   └── tropicana.png
│   ├── logo.png                   # Brand primary logo (dark/transparent text)
│   ├── logo-white-text.png        # Brand white-text logo (for dark navigation header/footer)
│   └── tab-logo.png               # Browser tab favicon logo
├── src/
│   ├── assets/                    # Bundled graphic assets
│   │   ├── hero.png               # Main landing illustration
│   │   ├── react.svg              # React framework icon
│   │   └── vite.svg               # Vite build tool icon
│   ├── components/                # Reusable UI component modules
│   │   ├── common/                # Site-wide persistent components
│   │   │   ├── Footer.jsx         # Site-wide footer with business info and map embed
│   │   │   └── Navbar.jsx         # Sticky header navigation bar with mobile support
│   │   ├── home/                  # Section components exclusively for the Landing Page
│   │   │   ├── Hero.jsx           # Welcome intro with key branding and CTAs
│   │   │   ├── Partners.jsx       # Brand grid highlighting wholesale partners
│   │   │   ├── TrustSection.jsx   # Grid detailing customer guarantees / value props
│   │   │   └── WholeCTA.jsx       # Final action-oriented banner to sign up/contact
│   │   ├── context/               # [Empty] Reserved for React Context (state managers)
│   │   ├── layout/                # [Empty] Reserved for reusable wrapper structures
│   │   ├── pages/                 # [Empty] Reserved for routing views (e.g. Products, About)
│   │   └── ui/                    # [Empty] Reserved for atomic/primitive inputs and buttons
│   ├── constants/                 # Fixed config objects and static data stores
│   │   └── partners.js            # Partner brands mapping (logo image paths and names)
│   ├── layouts/                   # [Empty] Reserved for top-level page templates
│   ├── routes/                    # [Empty] Reserved for routing configurations
│   ├── utils/                     # [Empty] Reserved for utility functions
│   ├── App.jsx                    # Core component orchestrating page flow and layout
│   ├── index.css                  # Tailwinds v4 layer styling and base typography imports
│   └── main.jsx                   # Web application entry-point hook
├── .gitignore                     # Git tracking exclusion list
├── eslint.config.js               # Code style and standards check configurations
├── index.html                     # HTML root template document
├── package.json                   # Project packages, scripts, and runtime dependencies
├── package-lock.json              # Direct dependency lock registry
└── vite.config.js                 # Vite, Babel, and Tailwind build integrations
```

---

## 🛠️ Technology Stack & Dependencies

### Core Frameworks & Routing
- **React 19** (`react` / `react-dom` `^19.2.7`): Utilizes React 19 features including standard Hooks.
- **React Router DOM 7** (`react-router-dom` `^7.18.1`): Configured in [main.jsx](file:///f:/shivaay-enterprises-react/src/main.jsx) to handle URL navigation and link routing.

### Build Tool & Styling
- **Vite 8** (`vite` `^8.1.1`): Ultra-fast frontend bundler and local development server.
- **Tailwind CSS v4** (`tailwindcss` `^4.3.3`): Next-gen CSS styling framework integrated using `@tailwindcss/vite`.
- **Babel Compiler** (`babel-plugin-react-compiler` `^1.0.0`): Uses Babel plugins with `@rolldown/plugin-babel` inside [vite.config.js](file:///f:/shivaay-enterprises-react/vite.config.js) to leverage advanced React optimizations.

### Animation & Iconography
- **Framer Motion 12** (`framer-motion` `^12.42.2`): Powers subtle micro-interactions, fade-in loading, and state transition animations.
- **Lucide React** (`lucide-react` `^1.25.0`): Enterprise-grade icon provider.

---

## 📝 Detailed File Directory Breakdown

### 1. Root Configurations & Files
- **[package.json](file:///f:/shivaay-enterprises-react/package.json)**
  Defines critical build scripts:
  - `npm run dev`: Starts Vite dev server (binds locally, runs on default port).
  - `npm run build`: Compiles production-optimized assets inside the `dist` folder.
  - `npm run lint`: Performs static analysis of JS/JSX files using ESLint.
- **[vite.config.js](file:///f:/shivaay-enterprises-react/vite.config.js)**
  Uses `@tailwindcss/vite` and `@vitejs/plugin-react`. Sets up the experimental React Compiler presets using Babel on Vite's rollups.
- **[eslint.config.js](file:///f:/shivaay-enterprises-react/eslint.config.js)**
  Specifies linting configs using flat file format rules. Ignores the `dist` directory and extends standard configs for JS, React hooks, and refresh rules.
- **[index.html](file:///f:/shivaay-enterprises-react/index.html)**
  Mounting point for the Single Page Application (SPA). Links to the favicon (`/tab-logo.png`) and initializes Javascript execution through `src/main.jsx`.

---

### 2. Main Source Code (`src/`)

- **[main.jsx](file:///f:/shivaay-enterprises-react/src/main.jsx)**
  Hooks the React runtime into `<div id="root">` inside `index.html`. Wraps the main `<App />` component in standard `StrictMode` and a `<BrowserRouter />` layout context.
- **[App.jsx](file:///f:/shivaay-enterprises-react/src/App.jsx)**
  Acts as the primary homepage layout container. Imports and wraps the sections sequentially:
  - `<Navbar />` (Sticky header)
  - `<Hero />` (Interactive header fold)
  - `<TrustSection />` (Selling points/Core guarantees)
  - `<Partners />` (Logos of wholesale brand partners)
  - `<WholeCTA />` (Closing action banner)
  - `<Footer />` (Sticky map and social/business contact index)
- **[index.css](file:///f:/shivaay-enterprises-react/src/index.css)**
  Initializes Tailwind CSS imports using standard v4 `@import "tailwindcss"`. Utilizes `@layer base` override directives to configure global font definitions (Inter, System UI) and anti-aliasing features.

---

### 3. Components (`src/components/`)

#### 🧱 Common Components (`src/components/common/`)
- **[Navbar.jsx](file:///f:/shivaay-enterprises-react/src/components/common/Navbar.jsx)**
  A responsive global navigation header styled with a `#0F172A` Slate Dark theme. Features:
  - Logo and routing links (`Home`, `Products`, `Insights`, `Contact`) that map active states with professional color transforms (`#DC2626` Crimson).
  - Framer-motion animated `Login` (white button with hover lift) and `Register` (Crimson CTA button) elements.
  - Hamburger toggle using Lucide icons (`Menu` and `X`) controlling a slide-down mobile-friendly navigation tray.
- **[Footer.jsx](file:///f:/shivaay-enterprises-react/src/components/common/Footer.jsx)**
  A corporate footer section styled in `#0F172A` background containing:
  - Brand tagline with core values (Purity, Quality, Trust).
  - Quick-links grid mapping site navigation structure (Company info, services index).
  - Full contact details block featuring active click-to-call phone linkages and direct mail redirects.
  - Embedded Google Maps Iframe mapping Shivaay Enterprises' physical distribution facility in Ankleshwar, Bharuch, Gujarat.

#### 🏠 Home Components (`src/components/home/`)
- **[Hero.jsx](file:///f:/shivaay-enterprises-react/src/components/home/Hero.jsx)**
  The focal greeting node. Displays a large brand graphic (`/logo.png`) combined with a dynamic fade-up title: *Quality Products, Trusted by All*. Directs new visitors to standard conversion options: "Browse Products" (Action CTA) or "Contact Us" (Details secondary button).
- **[TrustSection.jsx](file:///f:/shivaay-enterprises-react/src/components/home/TrustSection.jsx)**
  Highlights core assurances (Quality, Wholesale Pricing, Grid Availability, Customer Support) using soft elevated grids, semantic icons, and hover transition scales.
- **[Partners.jsx](file:///f:/shivaay-enterprises-react/src/components/home/Partners.jsx)**
  Lists primary FMCG and beverage suppliers. Renders partner cards loaded dynamically from constant metadata. Includes local states tracking load error configurations to serve neat fallbacks if brand logos fail to load.
- **[WholeCTA.jsx](file:///f:/shivaay-enterprises-react/src/components/home/WholeCTA.jsx)**
  A bottom call-to-action module centered over a clean, abstract blur backdrop. Directs enterprise inquiries into registrations or custom support chats.

---

### 4. Static Stores & Rules

- **[partners.js](file:///f:/shivaay-enterprises-react/src/constants/partners.js)**
  Exposes the `partnerBrands` array mapping popular consumer brand labels (like Coca-Cola, PepsiCo, Parle, ITC, HUL, Dabur, Britannia, Haldiram's, Bisleri, Red Bull) to their local assets.
- **[.agents/AGENTS.md](file:///f:/shivaay-enterprises-react/.agents/AGENTS.md)**
  Maintains system-wide styling configurations for pairs of developers working in the workspace. Defines typographic heights, color codes, border radius conventions, spacing grids, and component layout philosophy to align modifications with a cohesive Stripe-like UX standard.
