# Reusable Skills Index

## Master Skills Table

| Skill | Category | What It Provides | Prerequisites |
|-------|----------|-----------------|---------------|
| [Multi-Entry SPA Architecture](./frontend/multi-entry-spa-architecture/SKILL.md) | Frontend | Build multiple independent SPAs (public + admin) from a shared codebase with separate build configs, ports, and deployments | Module bundler (Vite/Webpack), SPA routing |
| [React Context State Management](./frontend/react-context-state-management/SKILL.md) | Frontend | useReducer + Context with localStorage persistence, derived values, and custom hooks with safety guards | React hooks (useReducer, useContext, useEffect) |
| [React Data Fetching Patterns](./frontend/react-data-fetching-patterns/SKILL.md) | Frontend | Async data fetching with exhaustive loading/error/empty state handling, CRUD lifecycle, and retry mechanisms | React hooks (useState, useCallback, useEffect), async/await |
| [Authentication & Authorisation Architecture](./security/authentication-authorization-architecture/SKILL.md) | Security | Dual-audience auth (OAuth + email/password), role-based protected routes, OAuth callback handling, session management | OAuth 2.0, React Router, auth provider API |
| [Row-Level Security Design](./security/row-level-security-design/SKILL.md) | Security | PostgreSQL RLS policies: owner-based access, role-based admin access, public read, storage policies, auto-RLS triggers | PostgreSQL, SQL CREATE POLICY, Supabase roles |
| [Production Database Migrations](./database/production-database-migrations/SKILL.md) | Database | Safe, incremental, non-destructive migrations with grants, RLS, triggers, and iterative error correction | SQL DDL, migration tooling |
| [Database Triggers & Automation](./database/database-triggers-automation/SKILL.md) | Database | PostgreSQL triggers for auto-create, updated_at, idempotent SECURITY DEFINER functions, non-blocking error handling | PostgreSQL triggers, PL/pgSQL |
| [Client-Side Image Pipeline](./engineering/client-side-image-pipeline/SKILL.md) | Engineering | File validation, Canvas-based resize/WebP conversion, cloud storage upload with unique filenames, old-image cleanup | Canvas API, File/Blob APIs, cloud storage |

**Total: 8 skills across 4 categories**

---

## Skills by Category

### Frontend (3 skills)

Skills for React application architecture, state management, and data interaction.

| Skill | Focus |
|-------|-------|
| [Multi-Entry SPA Architecture](./frontend/multi-entry-spa-architecture/SKILL.md) | Application structure and build system |
| [React Context State Management](./frontend/react-context-state-management/SKILL.md) | Client-side shared state |
| [React Data Fetching Patterns](./frontend/react-data-fetching-patterns/SKILL.md) | Server data interaction and UI states |

### Security (2 skills)

Skills for access control at both the client and database layers.

| Skill | Focus |
|-------|-------|
| [Authentication & Authorisation Architecture](./security/authentication-authorization-architecture/SKILL.md) | Client-side auth flows and route guards |
| [Row-Level Security Design](./security/row-level-security-design/SKILL.md) | Database-level access enforcement |

### Database (2 skills)

Skills for managing PostgreSQL schema evolution and server-side automation.

| Skill | Focus |
|-------|-------|
| [Production Database Migrations](./database/production-database-migrations/SKILL.md) | Schema changes and version control |
| [Database Triggers & Automation](./database/database-triggers-automation/SKILL.md) | Automatic row creation and maintenance |

### Engineering (1 skill)

Cross-cutting development practices and pipelines.

| Skill | Focus |
|-------|-------|
| [Client-Side Image Pipeline](./engineering/client-side-image-pipeline/SKILL.md) | Image processing and storage management |

---

## Suggested Skill Selection

Use this guide to select the right skills for common project scenarios.

### Building a React + Supabase Application

Start with these skills in order:

```
1. Multi-Entry SPA Architecture        → if you have public + admin surfaces
2. React Context State Management      → for cart, theme, or other shared state
3. React Data Fetching Patterns        → for loading data from Supabase
4. Authentication & Authorisation      → for login and protected routes
5. Row-Level Security Design           → for database access control
6. Production Database Migrations      → for schema evolution
7. Database Triggers & Automation      → for auto-profile creation
8. Client-Side Image Pipeline          → if you have image uploads
```

### Building a React Application (No Supabase)

```
1. Multi-Entry SPA Architecture        → if applicable
2. React Context State Management      → for shared state
3. React Data Fetching Patterns        → adapted to your API client
4. Authentication & Authorisation      → adapted to your auth provider
```

### Adding an Admin Panel to an Existing App

```
1. Multi-Entry SPA Architecture        → separate entry for admin
2. Authentication & Authorisation      → admin-specific auth + role checks
3. Row-Level Security Design           → admin policies in the database
4. React Data Fetching Patterns        → CRUD interfaces
5. Client-Side Image Pipeline          → if admin uploads images
```

### Setting Up a New PostgreSQL Database

```
1. Production Database Migrations      → migration workflow
2. Row-Level Security Design           → RLS from day one
3. Database Triggers & Automation      → auto-profile, updated_at
```

### Adding Image Upload to Any Project

```
1. Client-Side Image Pipeline          → the complete pipeline
2. Row-Level Security Design           → storage bucket policies
```

### Making Production Database Changes

```
1. Production Database Migrations      → safe change workflow
2. Row-Level Security Design           → if adding/modifying policies
3. Database Triggers & Automation      → if adding automation
```

---

## Skill Dependency Graph

```
Multi-Entry SPA Architecture
    └──→ Authentication & Authorisation Architecture
             ├──→ Row-Level Security Design
             │        └──→ Production Database Migrations
             │        └──→ Database Triggers & Automation
             └──→ React Context State Management

React Data Fetching Patterns (independent, used everywhere)

Client-Side Image Pipeline
    └──→ Row-Level Security Design (storage policies)
```

No skill requires another to function. The arrows indicate "benefits from reading".

---

## Provenance

All skills were extracted from the [Shivaay Enterprise](https://shivaayenterprise.com) repository — a production B2B wholesale distribution platform built with React 19, Vite 8, Supabase, and Tailwind CSS v4. The extraction analysed 31 commits, 6 SQL migrations, and the complete source code.

See [README.md](./README.md) for usage instructions and maintenance guidelines.
