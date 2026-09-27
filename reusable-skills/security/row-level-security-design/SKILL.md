# Skill: Row-Level Security Design

## Purpose

Provides the engineering pattern for designing and implementing **Row-Level Security (RLS) policies** in PostgreSQL to enforce data access control at the database layer. Covers owner-based access, role-based admin access, public read policies, storage bucket policies, and automatic RLS enforcement via event triggers.

## When to Use

- You are using a PostgreSQL database (directly or via Supabase, Neon, etc.) and need to enforce access control.
- Your application exposes the database to clients through an API that forwards the user's auth token (e.g., Supabase client SDK).
- You need to ensure that even if client-side code is tampered with, users can only access their own data.
- You have multiple roles (admin, customer, public) with different data access permissions.

## When NOT to Use

- Your database is only accessed by a trusted backend server with a service role key — you may enforce access in application middleware instead (though RLS is still a good defence-in-depth layer).
- You are using a database that doesn't support RLS (e.g., MySQL before 8.0, most NoSQL databases).
- Your access patterns are so complex that RLS policies become unmaintainable — consider a dedicated authorisation service (e.g., OPA, Cerbos).

## Prerequisites

- Understanding of PostgreSQL roles (`anon`, `authenticated`, `service_role` in Supabase).
- Understanding of SQL `CREATE POLICY` syntax.
- Understanding of the difference between `USING` (which rows can be read/deleted) and `WITH CHECK` (which rows can be inserted/updated).
- Understanding of `auth.uid()` (Supabase) or equivalent session context functions.

## Core Principles

1. **RLS is the last line of defence.** Client-side guards and API middleware are bypassed if someone calls the API directly. RLS ensures the database itself rejects unauthorised access.
2. **Enable RLS on every table.** A table without RLS is open to any authenticated user with table-level grants. Enable RLS by default, then create explicit policies for access.
3. **Principle of least privilege.** Start with no access (RLS enabled, no policies) and add specific policies for each role and operation.
4. **Separate policies per operation.** Create distinct policies for SELECT, INSERT, UPDATE, and DELETE. Don't use a single policy for all operations.
5. **Owner-based access for user data.** Users should only access rows they own. The policy compares `auth.uid()` to the row's owner ID.
6. **Role-based access for admin data.** Admin access is granted by checking the user's role in a profiles/roles table.
7. **Public read via `anon` role.** For publicly accessible data (product catalogues), create a SELECT policy for the `anon` role with `USING (true)`.

## General Pattern

### 1. Enable RLS

```sql
ALTER TABLE "public"."items" ENABLE ROW LEVEL SECURITY;
```

**Without this, RLS policies are ignored.** Always enable RLS before creating policies.

### 2. Owner-Based Access (User Data)

```sql
-- Users can read their own rows
CREATE POLICY "Users can view their own data"
  ON "public"."user_data"
  FOR SELECT
  TO "authenticated"
  USING ((SELECT auth.uid() AS uid) = user_id);

-- Users can insert their own rows
CREATE POLICY "Users can insert their own data"
  ON "public"."user_data"
  FOR INSERT
  TO "authenticated"
  WITH CHECK ((SELECT auth.uid() AS uid) = user_id);

-- Users can update their own rows
CREATE POLICY "Users can update their own data"
  ON "public"."user_data"
  FOR UPDATE
  TO "authenticated"
  USING ((SELECT auth.uid() AS uid) = user_id)
  WITH CHECK ((SELECT auth.uid() AS uid) = user_id);
```

**Key:** UPDATE policies need both `USING` (which existing rows can be modified) and `WITH CHECK` (what the new values must satisfy).

### 3. Role-Based Admin Access

```sql
-- Admins can view all rows
CREATE POLICY "Admins can view all items"
  ON "public"."items"
  FOR SELECT
  TO "authenticated"
  USING (
    EXISTS (
      SELECT 1
      FROM public.profiles
      WHERE profiles.id = (SELECT auth.uid() AS uid)
        AND profiles.role = 'admin'::text
    )
  );
```

**Pattern:** Use `EXISTS` with a subquery to the profiles/roles table. This is evaluated for every row access, so keep the profiles table small and indexed.

### 4. Public Read Access

```sql
CREATE POLICY "Anyone can view active items"
  ON "public"."items"
  FOR SELECT
  TO "anon"
  USING (true);  -- or USING (is_active = true) for filtered access
```

### 5. Storage Bucket Policies

```sql
-- Anyone can view files in the bucket
CREATE POLICY "Public read on images"
  ON "storage"."objects"
  FOR SELECT
  TO PUBLIC
  USING (bucket_id = 'product-images'::text);

-- Only admins can upload files
CREATE POLICY "Admin upload to images"
  ON "storage"."objects"
  FOR INSERT
  TO "authenticated"
  WITH CHECK (
    bucket_id = 'product-images'::text
    AND EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = (SELECT auth.uid() AS uid)
        AND profiles.role = 'admin'::text
    )
  );
```

### 6. Automatic RLS Enforcement (Event Trigger)

```sql
CREATE OR REPLACE FUNCTION public.rls_auto_enable()
  RETURNS event_trigger
  LANGUAGE plpgsql
  SECURITY DEFINER
  SET search_path TO 'pg_catalog'
AS $$
DECLARE cmd record;
BEGIN
  FOR cmd IN
    SELECT * FROM pg_event_trigger_ddl_commands()
    WHERE command_tag IN ('CREATE TABLE', 'CREATE TABLE AS')
      AND object_type IN ('table', 'partitioned table')
  LOOP
    IF cmd.schema_name = 'public' THEN
      EXECUTE format('ALTER TABLE IF EXISTS %s ENABLE ROW LEVEL SECURITY',
                     cmd.object_identity);
    END IF;
  END LOOP;
END;
$$;

CREATE EVENT TRIGGER "ensure_rls"
  ON ddl_command_end
  WHEN TAG IN ('CREATE TABLE', 'CREATE TABLE AS', 'SELECT INTO')
  EXECUTE FUNCTION public.rls_auto_enable();
```

**This ensures every new table in the public schema automatically has RLS enabled**, preventing accidental exposure.

## Recommended Workflow

1. **Enable RLS on the table** immediately after creating it.
2. **Create SELECT policies** first — determine who can read what.
3. **Create INSERT policies** — who can add new rows, and what constraints apply.
4. **Create UPDATE policies** — who can modify which rows, with both `USING` and `WITH CHECK`.
5. **Create DELETE policies** — or intentionally omit them to prevent deletion.
6. **Test with the intended role** — use Supabase's SQL editor role switcher or set `role` in a test client.
7. **Consider an auto-RLS event trigger** to prevent future tables from being created without RLS.

## Decision Points

### Owner column: `id` (same as auth.users.id) vs. `user_id` (foreign key)?

- **`id` matching auth.users.id**: The row's primary key IS the user's ID. Used for one-to-one relationships (profiles, settings). Policy: `USING (auth.uid() = id)`.
- **`user_id` foreign key**: The row references a user. Used for one-to-many relationships (orders, addresses). Policy: `USING (auth.uid() = user_id)`.

### Deny by default or explicit deny policies?

- **Deny by default** (recommended): Enable RLS with no policies. Only explicitly allowed operations succeed.
- **Explicit deny**: Create policies with `USING (false)`. Unnecessary if deny-by-default is used.

### Intentionally omitting DELETE policies

If you want data to be "soft deleted" (via an `is_active` flag) rather than hard deleted, simply don't create a DELETE policy. The database will reject all DELETE operations for that table.

### Role check: JWT claim vs. database lookup

- **JWT claim** (`auth.jwt() ->> 'role'`): Faster, no subquery. But claims can be stale if the role changed after token issuance.
- **Database lookup** (`EXISTS (SELECT 1 FROM profiles WHERE ...)`): Always current. Slightly slower due to the subquery. **Recommended for critical access decisions.**

## Common Mistakes

1. **Forgetting to enable RLS.** Policies have no effect if RLS is not enabled on the table.
2. **Granting table-level permissions that bypass RLS.** The `service_role` in Supabase bypasses RLS by default. Never use the service role key in client-side code.
3. **Missing `WITH CHECK` on UPDATE policies.** A user could update their row to change the `user_id` to someone else's ID if `WITH CHECK` doesn't verify ownership.
4. **Overly broad `TO` clause.** Using `TO PUBLIC` instead of `TO authenticated` grants access to unauthenticated users.
5. **Policy conflicts.** Multiple SELECT policies for the same role are OR'd together. If one policy allows access, the row is visible even if another would deny it. PostgreSQL RLS is permissive by default.
6. **Not testing with the actual role.** Writing policies against the `postgres` role (which bypasses RLS) and assuming they work.
7. **Forgetting storage bucket policies.** Tables have RLS but the storage bucket is publicly writable.

## Security Considerations

- **RLS is not a substitute for input validation.** Policies control which rows are accessible, not the format or content of the data. Use CHECK constraints and application-level validation.
- **The `service_role` key bypasses RLS.** Never expose this key in client-side code. Use it only in trusted server-side functions.
- **`SECURITY DEFINER` functions run as their owner (usually postgres), bypassing RLS.** Use them carefully and lock down `search_path` to prevent injection.
- **Policy evaluation order is not guaranteed.** Design policies to be independent — don't rely on one policy being checked before another.
- **Index the columns used in policy expressions.** `auth.uid() = user_id` is fast if `user_id` is indexed. Subqueries against `profiles` benefit from a primary key lookup.

## Debugging

| Symptom | Likely Cause |
|---------|-------------|
| SELECT returns 0 rows (not an error) | RLS is enabled but no matching SELECT policy exists for the current role |
| INSERT fails with "new row violates RLS" | `WITH CHECK` policy doesn't match the inserted data |
| UPDATE silently affects 0 rows | `USING` policy doesn't match the existing row for the current user |
| DELETE silently affects 0 rows | No DELETE policy exists, or the `USING` clause doesn't match |
| Policy works in SQL editor but not from the app | SQL editor uses the `postgres` role (bypasses RLS); the app uses `authenticated` or `anon` |
| Admin can't see other users' data | Admin SELECT policy is missing or the role check subquery doesn't match |

**Debugging approach:**
1. Check which role the client is using.
2. Verify RLS is enabled on the table: `SELECT relrowsecurity FROM pg_class WHERE relname = 'table_name'`.
3. List policies: `SELECT * FROM pg_policies WHERE tablename = 'table_name'`.
4. Test the policy's `USING`/`WITH CHECK` expression directly with the user's `auth.uid()`.

## Production Considerations

- **Migration discipline**: RLS policies are part of the schema. Add them in migrations, not manually in the dashboard. See [Production Database Migrations](../../database/production-database-migrations/SKILL.md).
- **Performance**: Complex subqueries in policies are evaluated per-row. For large tables, ensure the subquery tables (profiles) are well-indexed.
- **Monitoring**: Log denied access attempts for security auditing. Supabase provides query logs that show RLS denials.
- **Testing**: Write integration tests that authenticate as different roles and verify correct access patterns.

## Shivaay Example

Shivaay implements a comprehensive RLS design across 4 tables and 1 storage bucket:

**Products table** — Dual-access pattern:
- `anon` can SELECT all rows (public catalogue).
- `authenticated` with admin role can SELECT, INSERT, UPDATE, DELETE (via `EXISTS` subquery on `profiles`).

**Profiles table** — Self-read only:
- `authenticated` can SELECT their own row (`auth.uid() = id`).
- No INSERT/UPDATE/DELETE policies — admin profiles are managed server-side.
- `CHECK` constraint ensures `role = 'admin'` — this table only holds admin users.

**Customers table** — Owner-based access:
- `authenticated` can SELECT, INSERT, UPDATE their own row (`auth.uid() = id`).
- No DELETE policy — customer rows cascade-delete from `auth.users`.
- Admins can SELECT all rows (via a separate policy added in migration `20260909030000`).

**Customer addresses table** — Owner-based with admin read:
- `authenticated` can SELECT, INSERT, UPDATE, DELETE their own address (`auth.uid() = customer_id`).
- Admins can SELECT all addresses.
- `UNIQUE` constraint on `customer_id` enforces one address per customer.

**Product images bucket** (`storage.objects`):
- `PUBLIC` can SELECT (view) images where `bucket_id = 'product-images'`.
- `authenticated` with admin role can INSERT, UPDATE, DELETE images.

**Auto-RLS event trigger**: `rls_auto_enable()` function fires on `CREATE TABLE` events and automatically enables RLS on new tables in the `public` schema.

## Anti-Patterns

- **"Admin bypass" policy**: Creating a policy like `USING (true)` for the `authenticated` role, intending to filter in the application. This exposes all data to any authenticated user.
- **RLS-free tables**: Leaving RLS disabled "because it's just test data". Someone will forget to enable it before production.
- **Client-side filtering as security**: Fetching all data and filtering in JavaScript. The full dataset is visible in network tools.
- **Overlapping permissive policies**: Creating policies that unintentionally grant broader access when OR'd together.

## Validation Checklist

- [ ] RLS is enabled on every table that holds user data
- [ ] Each table has explicit policies for each operation (SELECT, INSERT, UPDATE, DELETE)
- [ ] Owner-based policies compare `auth.uid()` to the correct column
- [ ] UPDATE policies include both `USING` and `WITH CHECK`
- [ ] Admin policies use database role lookup (not JWT claim alone)
- [ ] Public read policies use the `anon` role, not `PUBLIC`
- [ ] Storage bucket policies mirror the table policies
- [ ] Policies have been tested with actual client roles (not `postgres`)
- [ ] No `service_role` key is used in client-side code
- [ ] An auto-RLS mechanism exists to prevent future tables from being unprotected

## Related Skills

- [Authentication & Authorisation Architecture](../authentication-authorization-architecture/SKILL.md) — Client-side complement to server-side RLS
- [Production Database Migrations](../../database/production-database-migrations/SKILL.md) — RLS policies should be version-controlled in migrations
- [Database Triggers & Automation](../../database/database-triggers-automation/SKILL.md) — Triggers interact with RLS via `SECURITY DEFINER`

## Repository Evidence

- [`supabase/migrations/20260908174355_production_baseline.sql`](../../supabase/migrations/20260908174355_production_baseline.sql) — Products and profiles tables with RLS, storage policies, auto-RLS event trigger
- [`supabase/migrations/20260908190613_create_customers_table.sql`](../../supabase/migrations/20260908190613_create_customers_table.sql) — Customer table with owner-based RLS
- [`supabase/migrations/20260909010000_create_customer_addresses_table.sql`](../../supabase/migrations/20260909010000_create_customer_addresses_table.sql) — Address table with owner-based RLS and UNIQUE constraint
- [`supabase/migrations/20260909020000_fix_authenticated_grants.sql`](../../supabase/migrations/20260909020000_fix_authenticated_grants.sql) — Grant fix for missing UPDATE/INSERT permissions
- [`supabase/migrations/20260909030000_admin_customer_access.sql`](../../supabase/migrations/20260909030000_admin_customer_access.sql) — Admin read-access policies added after initial deployment
- [`src/components/auth/AdminProtectedRoute.jsx`](../../src/components/auth/AdminProtectedRoute.jsx) — Client-side admin role check mirrors the RLS pattern

## Limitations

- The Shivaay project uses permissive policies exclusively. Restrictive policies (using `AS RESTRICTIVE`) were not explored.
- Performance impact of the `EXISTS` subquery on large-scale applications was not measured.
- The auto-RLS event trigger only handles `CREATE TABLE` — it doesn't handle tables created via migration tools that use `CREATE TABLE IF NOT EXISTS`.
- Cross-table RLS interactions (e.g., a user can see an order only if they can see the customer who placed it) were not implemented.
- The project does not use PostgreSQL's `current_setting()` for custom claims — it relies entirely on `auth.uid()` and table lookups.
