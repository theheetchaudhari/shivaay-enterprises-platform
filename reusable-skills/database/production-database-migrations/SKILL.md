# Skill: Production Database Migrations

## Purpose

Provides the engineering pattern for writing **safe, incremental, non-destructive database migrations** that evolve a production schema without data loss, downtime, or breaking existing functionality.

## When to Use

- You need to add tables, columns, constraints, functions, triggers, or policies to a production database.
- You need to fix permissions or grants that were incorrect in a previous migration.
- You are evolving a database schema that has real data and real users.
- You want a version-controlled, reproducible history of all schema changes.

## When NOT to Use

- You are prototyping with disposable data and don't care about migration history.
- You are using a schemaless database (MongoDB, DynamoDB) where migrations are handled differently.
- You need to perform a one-time data backfill that doesn't change the schema — use a script, not a migration.

## Prerequisites

- Understanding of SQL DDL (CREATE, ALTER, DROP).
- Understanding of your migration tool (Supabase CLI, Prisma Migrate, Knex, Flyway, etc.).
- Access to a staging environment that mirrors production.

## Core Principles

1. **Migrations are append-only.** Never edit a migration that has already been applied to production. Create a new migration to fix issues.
2. **Every migration must be safe to run on a database with live data.** Use `IF NOT EXISTS`, `IF EXISTS`, `ADD COLUMN ... DEFAULT`, and `ON CONFLICT DO NOTHING`.
3. **Never drop or rename in the same migration as the replacement.** Add the new thing first, migrate data in a separate step, then drop the old thing in a third migration.
4. **Include grants and permissions.** Tables without proper grants are useless to the application even if they exist.
5. **Document intent.** Every migration should have a header comment explaining what it does and why.
6. **Test on a copy first.** Never apply an untested migration to production.

## General Pattern

### 1. Migration File Naming

Use timestamp-prefixed filenames for deterministic ordering:

```
migrations/
├── 20240101000000_initial_schema.sql
├── 20240115120000_add_customers_table.sql
├── 20240116000000_add_customer_addresses.sql
├── 20240116010000_fix_customer_grants.sql
└── 20240120000000_add_admin_access_policies.sql
```

### 2. Migration Structure

```sql
-- =============================================================================
-- Migration: descriptive_name
-- Purpose:   What this migration does and why.
-- =============================================================================

-- ---------------------------------------------------------------------------
-- 1. Table definition
-- ---------------------------------------------------------------------------

CREATE TABLE "public"."items" (
  "id"         uuid                     NOT NULL DEFAULT gen_random_uuid(),
  "name"       text                     NOT NULL,
  "is_active"  boolean                  NOT NULL DEFAULT true,
  "created_at" timestamp with time zone NOT NULL DEFAULT now(),
  "updated_at" timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT "items_pkey" PRIMARY KEY (id)
);

ALTER TABLE "public"."items" ENABLE ROW LEVEL SECURITY;

-- ---------------------------------------------------------------------------
-- 2. Trigger for updated_at
-- ---------------------------------------------------------------------------

CREATE TRIGGER trg_items_updated_at
  BEFORE UPDATE ON "public"."items"
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

-- ---------------------------------------------------------------------------
-- 3. RLS Policies
-- ---------------------------------------------------------------------------

CREATE POLICY "Policy name"
  ON "public"."items"
  FOR SELECT
  TO "authenticated"
  USING (...);

-- ---------------------------------------------------------------------------
-- 4. Grants
-- ---------------------------------------------------------------------------

GRANT SELECT ON TABLE "public"."items" TO "anon";
GRANT SELECT, INSERT, UPDATE ON TABLE "public"."items" TO "authenticated";
```

### 3. Adding a Column to an Existing Table

```sql
-- Safe: always provide a DEFAULT to avoid breaking existing rows
ALTER TABLE "public"."items"
  ADD COLUMN IF NOT EXISTS "category" text DEFAULT NULL;
```

### 4. Fixing Grants After the Fact

```sql
-- =============================================================================
-- Migration: fix_grants
-- Purpose:   Grant INSERT and UPDATE that were missing from the initial migration.
-- =============================================================================

GRANT UPDATE ON TABLE "public"."customers" TO "authenticated";
GRANT INSERT, UPDATE ON TABLE "public"."customer_addresses" TO "authenticated";
```

### 5. Adding Policies After Initial Deployment

```sql
-- =============================================================================
-- Migration: add_admin_read_access
-- Purpose:   Allow admins to view customer data they previously couldn't access.
-- =============================================================================

CREATE POLICY "Admins can view all customers"
  ON "public"."customers"
  FOR SELECT
  TO "authenticated"
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = (SELECT auth.uid() AS uid)
        AND profiles.role = 'admin'::text
    )
  );
```

## Recommended Workflow

1. **Write the migration SQL** with clear section comments.
2. **Test locally** by applying the migration to a local database copy.
3. **Review the migration** for safety:
   - Does it use `IF NOT EXISTS` / `IF EXISTS` where appropriate?
   - Does `ADD COLUMN` include a `DEFAULT`?
   - Are grants included?
   - Is RLS enabled?
4. **Apply to staging** and verify the application works correctly.
5. **Apply to production** during a low-traffic period.
6. **Verify** by testing affected functionality immediately after deployment.

## Decision Points

### Baseline migration vs. incremental migrations from scratch

- **Baseline migration** (recommended for existing databases): Capture the current schema state as migration #1. Future changes are incremental.
- **Incremental from scratch**: Every migration builds on the previous one. Works for new projects but can become unwieldy for existing databases.

### `CREATE TABLE IF NOT EXISTS` vs. plain `CREATE TABLE`

- Use `IF NOT EXISTS` only if the migration might be re-run (idempotent migrations).
- Use plain `CREATE TABLE` if your migration tool guarantees each migration runs exactly once.

### Foreign key `ON DELETE CASCADE` vs. `ON DELETE RESTRICT`

- `CASCADE`: Deleting the parent automatically deletes children. Good for "owned" data (user → addresses).
- `RESTRICT`: Prevents deleting the parent if children exist. Good for "referenced" data (order → product).

## Common Mistakes

1. **Editing an already-applied migration.** The migration tool thinks it's already been run and skips it. The change is never applied.
2. **Dropping a column without first deploying code that doesn't use it.** The application crashes because it references the removed column.
3. **Missing grants.** The table exists but the application gets "permission denied" errors because the role can't access it.
4. **Not enabling RLS on new tables.** The table is accessible to anyone with table-level grants.
5. **Running destructive migrations without a rollback plan.** `DROP TABLE` and `DELETE FROM` are irreversible without backups.
6. **Not quoting identifiers.** PostgreSQL lowercases unquoted identifiers. `CREATE TABLE MyTable` creates `mytable`.
7. **Forgetting `updated_at` trigger.** The column exists but never updates — timestamps become stale.

## Failure Pattern

### Symptom
Users can read data but cannot insert or update. The error is "insufficient privilege" or "permission denied".

### Investigation
Check the grants on the affected table:
```sql
SELECT grantee, privilege_type
FROM information_schema.role_table_grants
WHERE table_name = 'customer_addresses';
```

### Root Cause
The initial migration created the table and RLS policies but did not grant INSERT or UPDATE to the `authenticated` role. The RLS policy allows the operation, but the role-level grant blocks it.

### Resolution
Create a new migration that adds the missing grants:
```sql
GRANT INSERT, UPDATE ON TABLE "public"."customer_addresses" TO "authenticated";
```

### General Lesson
RLS policies and role grants are **both** required for access. A permissive RLS policy is useless without the underlying grant, and vice versa.

### Prevention
Use a checklist for every new table:
1. Table created
2. RLS enabled
3. Policies created for each role and operation
4. Grants assigned for each role and operation
5. Triggers created (updated_at, etc.)

## Security Considerations

- **Never include secrets** (API keys, passwords) in migration files. They are committed to version control.
- **Review privilege escalation.** Ensure migrations don't accidentally grant `service_role` or `postgres` access to application users.
- **Lock down `SECURITY DEFINER` functions.** Set `search_path` explicitly to prevent search-path injection attacks.
- **Audit DEFAULT privileges.** PostgreSQL's `ALTER DEFAULT PRIVILEGES` applies to all future tables. Ensure the defaults are restrictive.

## Debugging

| Symptom | Likely Cause |
|---------|-------------|
| "relation does not exist" | Migration hasn't been applied, or table name is misspelled (case sensitivity) |
| "permission denied for table" | Missing GRANT for the role |
| "new row violates row-level security" | RLS policy's `WITH CHECK` doesn't match the inserted data |
| "function does not exist" | Trigger function not created, or created in a different schema |
| Migration appears applied but table is missing | Migration was applied to a different database (check connection string) |

## Production Considerations

- **Backup before applying.** Take a database snapshot before running migrations on production.
- **Use transactions.** If your migration tool supports transactional migrations, enable it. A failed migration should not leave the database in a half-migrated state.
- **Monitor query performance.** Adding indexes or constraints on large tables can lock the table. Use `CREATE INDEX CONCURRENTLY` for large tables.
- **Migration rollback plan.** For every migration, know what you would do to undo it. Even if you never roll back, the plan forces you to think about consequences.
- **Don't migrate and deploy code simultaneously.** Apply the migration first, verify it works, then deploy the code that uses the new schema. New code on old schema is safer than old code on new schema.

## Shivaay Example

Shivaay's migration history demonstrates iterative schema evolution on a production database:

1. **`20260908174355_production_baseline.sql`**: Captures the existing schema — `products` and `profiles` tables, RLS policies for admin CRUD on products, public read access, storage bucket policies for product images, and the `rls_auto_enable()` event trigger.

2. **`20260908190613_create_customers_table.sql`**: Adds the `customers` table with owner-based RLS, `set_updated_at()` trigger function, and conservative grants mirroring the baseline pattern.

3. **`20260909000000_create_customer_profile_trigger.sql`**: Creates the `handle_new_customer()` trigger function to automatically create a customer row on signup. Uses `SECURITY DEFINER`, `ON CONFLICT DO NOTHING`, and error handling that never blocks signup.

4. **`20260909010000_create_customer_addresses_table.sql`**: Adds `customer_addresses` with a `UNIQUE(customer_id)` constraint (one address per customer), owner-based RLS, and reuses the `set_updated_at()` function from the previous migration.

5. **`20260909020000_fix_authenticated_grants.sql`**: Fixes a real production bug — the initial customer/address migrations forgot to grant UPDATE on `customers` and INSERT/UPDATE on `customer_addresses` to the `authenticated` role. Users could read but not modify their own data.

6. **`20260909030000_admin_customer_access.sql`**: Adds SELECT policies so admins can view all customers and addresses — a feature that was needed for the admin customer management pages.

This progression shows the reality of production migrations: initial mistakes (missing grants) are fixed with new migrations, not by editing old ones.

## Anti-Patterns

- **"Just run it in the SQL editor"**: Making schema changes directly in the database without a migration file. No history, no reproducibility, no rollback.
- **The mega-migration**: Putting every table, policy, grant, and trigger in one massive file. Impossible to understand or debug.
- **Editing applied migrations**: Changing a migration that's already been applied. The migration tool skips it, and the change is lost.
- **`DROP TABLE IF EXISTS` at the top**: Some guides suggest dropping and recreating. This destroys data.
- **Missing comments**: A migration without a header comment becomes opaque months later.

## Validation Checklist

- [ ] Migration file is named with a timestamp prefix
- [ ] Migration has a header comment explaining purpose
- [ ] New tables have RLS enabled
- [ ] New tables have appropriate policies for all operations
- [ ] New tables have grants for all relevant roles
- [ ] `ADD COLUMN` includes a `DEFAULT` value
- [ ] `SECURITY DEFINER` functions have `SET search_path`
- [ ] Migration has been tested locally before production
- [ ] Migration does not edit or depend on changes to previously applied migrations
- [ ] Foreign keys specify `ON DELETE` behaviour
- [ ] Triggers are created for `updated_at` columns

## Related Skills

- [Row-Level Security Design](../../security/row-level-security-design/SKILL.md) — RLS policies are typically created within migrations
- [Database Triggers & Automation](../database-triggers-automation/SKILL.md) — Triggers are created within migrations

## Repository Evidence

- [`supabase/migrations/20260908174355_production_baseline.sql`](../../supabase/migrations/20260908174355_production_baseline.sql) — Baseline schema capture
- [`supabase/migrations/20260908190613_create_customers_table.sql`](../../supabase/migrations/20260908190613_create_customers_table.sql) — New table with RLS, trigger, grants
- [`supabase/migrations/20260909010000_create_customer_addresses_table.sql`](../../supabase/migrations/20260909010000_create_customer_addresses_table.sql) — Table with UNIQUE constraint and trigger reuse
- [`supabase/migrations/20260909020000_fix_authenticated_grants.sql`](../../supabase/migrations/20260909020000_fix_authenticated_grants.sql) — Grant fix migration (evidence of iterative correction)
- [`supabase/migrations/20260909030000_admin_customer_access.sql`](../../supabase/migrations/20260909030000_admin_customer_access.sql) — Feature-driven policy addition

## Limitations

- The Shivaay project does not use transactional migrations — each migration is applied as a standalone script. If a migration partially fails, manual intervention may be needed.
- Rollback migrations (down migrations) are not present. The project uses forward-only migrations.
- The project does not demonstrate schema changes to existing tables (ALTER TABLE ADD COLUMN on a populated table) — all tables were created from scratch.
- Performance considerations for large-table migrations (concurrent index creation, table locks) were not encountered due to the project's small data volume.
- Data migration (transforming existing rows) is not demonstrated — all migrations are structural.
