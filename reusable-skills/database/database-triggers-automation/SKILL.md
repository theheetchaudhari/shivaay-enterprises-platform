# Skill: Database Triggers & Automation

## Purpose

Provides the engineering pattern for using **PostgreSQL triggers** to automate database operations — specifically automatic row creation on related table inserts, timestamp maintenance, and idempotent trigger functions with non-blocking error handling.

## When to Use

- You need to automatically create a row in one table whenever a row is inserted into another (e.g., create a user profile when a new auth user signs up).
- You need to automatically update a timestamp column whenever a row is modified.
- You need server-side data consistency guarantees that don't depend on the application layer.
- You want the automation to work regardless of how the data is inserted (API, migration, direct SQL).

## When NOT to Use

- The automation involves complex business logic that changes frequently — use application-layer code instead.
- The trigger would need to make HTTP calls or interact with external services — PostgreSQL triggers should be fast and local.
- The automation only needs to work from one code path — a simple function call in the application is clearer.
- You are on a managed platform that restricts trigger creation (some database providers limit trigger use).

## Prerequisites

- Understanding of PostgreSQL trigger concepts: `BEFORE`/`AFTER`, `FOR EACH ROW`, `NEW`/`OLD` records.
- Understanding of `SECURITY DEFINER` vs. `SECURITY INVOKER` execution contexts.
- Understanding of PostgreSQL error handling (`EXCEPTION WHEN OTHERS THEN`).

## Core Principles

1. **Triggers enforce invariants at the database level.** No matter how data enters the database (API, migration, admin console), the trigger fires.
2. **Trigger functions should be fast.** They execute within the same transaction as the triggering statement. Slow triggers slow down every insert/update.
3. **Idempotency via `ON CONFLICT DO NOTHING`.** If the trigger fires multiple times for the same row (re-seeds, re-runs), it should not fail or create duplicates.
4. **Non-blocking error handling.** A trigger that creates a secondary record should never prevent the primary record from being created. Log the error and return `NEW`.
5. **`SECURITY DEFINER` for cross-schema access.** When a trigger needs to write to a table that the triggering user can't access (due to RLS), the function must run as its owner.
6. **Lock `search_path` on `SECURITY DEFINER` functions.** Prevent search-path injection by explicitly setting it to known schemas.

## General Pattern

### 1. Auto-Update Timestamp Trigger

```sql
-- Reusable function for any table with an updated_at column
CREATE OR REPLACE FUNCTION public.set_updated_at()
  RETURNS trigger
  LANGUAGE plpgsql
  SECURITY DEFINER
  SET search_path TO 'pg_catalog', 'public'
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Apply to any table
CREATE TRIGGER trg_items_updated_at
  BEFORE UPDATE ON "public"."items"
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();
```

**Key:** One function, many triggers. The function is generic — it just sets `NEW.updated_at = now()` on any table that has an `updated_at` column.

### 2. Auto-Create Related Record on Insert

```sql
CREATE OR REPLACE FUNCTION public.handle_new_user()
  RETURNS trigger
  LANGUAGE plpgsql
  SECURITY DEFINER
  SET search_path TO 'pg_catalog', 'public', 'auth'
AS $$
BEGIN
  -- Create a profile row for the new user
  INSERT INTO public.user_profiles (id, email, display_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NULL)
  )
  ON CONFLICT (id) DO NOTHING;  -- Idempotent

  RETURN NEW;

EXCEPTION
  WHEN OTHERS THEN
    -- Log but never block the primary insert
    RAISE LOG 'handle_new_user: failed for user % — %: %',
              NEW.id, SQLSTATE, SQLERRM;
    RETURN NEW;
END;
$$;

-- Revoke public execute — only the trigger should call this
REVOKE ALL ON FUNCTION public.handle_new_user() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO postgres;

-- Fire after the user is committed (so FK constraint is satisfied)
DROP TRIGGER IF EXISTS trg_on_user_created ON auth.users;

CREATE TRIGGER trg_on_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

COMMENT ON FUNCTION public.handle_new_user() IS
  'SECURITY DEFINER: auto-creates user_profiles row on signup. '
  'Idempotent via ON CONFLICT DO NOTHING. '
  'Never blocks user registration on failure.';
```

### 3. Trigger Timing

| Timing | Use Case |
|--------|----------|
| `BEFORE INSERT` | Modify `NEW` values before they're written (set defaults, normalise data) |
| `AFTER INSERT` | Create related rows in other tables (the triggering row is already committed) |
| `BEFORE UPDATE` | Modify `NEW` values (auto-update `updated_at`) |
| `AFTER UPDATE` | Sync changes to denormalised tables, send notifications |
| `BEFORE DELETE` | Validate or prevent deletion |
| `AFTER DELETE` | Clean up related data |

## Recommended Workflow

1. **Identify the invariant** — what must always be true? (e.g., "every user has a profile row").
2. **Choose the timing** — `BEFORE` or `AFTER`, and which operation.
3. **Write the function** — with `SECURITY DEFINER` if it needs cross-table access.
4. **Add idempotency** — `ON CONFLICT DO NOTHING` or `IF NOT EXISTS`.
5. **Add error handling** — `EXCEPTION WHEN OTHERS THEN RETURN NEW`.
6. **Lock the `search_path`** — prevent injection.
7. **Revoke public execute** — the function should only be called by the trigger.
8. **Add a `COMMENT`** — document the function's purpose.
9. **Write the trigger** — with `DROP TRIGGER IF EXISTS` for safe re-runs.
10. **Test** — insert a row and verify the trigger fired correctly.

## Decision Points

### `SECURITY DEFINER` vs. `SECURITY INVOKER`

- **`SECURITY DEFINER`**: Runs as the function owner (usually `postgres`), bypassing RLS. Required when the trigger needs to write to tables the triggering user can't access directly.
- **`SECURITY INVOKER`** (default): Runs with the privileges of the user who caused the trigger to fire. Use when no privilege escalation is needed.

### `BEFORE` vs. `AFTER` for auto-creation

- **`AFTER INSERT`** (recommended for FK relationships): The parent row is committed, so the FK constraint on the child table is satisfied.
- **`BEFORE INSERT`**: The parent row doesn't exist yet. If the child table has a FK to the parent, the insert will fail.

### Error suppression: Always return `NEW`?

- For **non-critical secondary records** (user profiles, audit logs): Yes. Log the error and return `NEW` so the primary operation succeeds.
- For **critical data integrity** (financial ledger, inventory decrement): No. Let the exception propagate to rollback the transaction.

## Common Mistakes

1. **Using `BEFORE INSERT` for FK-dependent child rows.** The parent row doesn't exist yet — the FK constraint fails.
2. **Forgetting `ON CONFLICT DO NOTHING`.** If the trigger fires twice (e.g., during re-seeding), it fails with a duplicate key error.
3. **Not locking `search_path` on `SECURITY DEFINER`.** An attacker could create a function with the same name in a user-controlled schema that gets called instead.
4. **Making the trigger too complex.** Triggers should be fast. Complex business logic belongs in the application.
5. **Not revoking execute permissions.** A `SECURITY DEFINER` function callable by any user is a privilege escalation vector.
6. **Raising exceptions in non-critical triggers.** A trigger that creates an audit log should never prevent the primary operation from succeeding.

## Security Considerations

- **`SECURITY DEFINER` is a privilege escalation.** The function runs as `postgres` regardless of who triggered it. Keep the function simple and well-audited.
- **Lock `search_path` to prevent injection.** Always set `SET search_path TO 'pg_catalog', 'public'` (or the specific schemas needed).
- **Revoke execute from `PUBLIC`.** Grant execute only to the roles that need it (usually just `postgres` for trigger functions).
- **Don't expose trigger functions via API.** Supabase auto-generates REST endpoints for functions. Ensure trigger functions are not callable via the API.

## Debugging

| Symptom | Likely Cause |
|---------|-------------|
| Primary insert works but child row is missing | `EXCEPTION WHEN OTHERS` caught an error silently — check `pg_log` for the RAISE LOG message |
| Duplicate key error on insert | `ON CONFLICT DO NOTHING` missing — the trigger tried to create a row that already exists |
| "function does not exist" | Function created in wrong schema, or `search_path` doesn't include the function's schema |
| FK violation in trigger | Using `BEFORE INSERT` instead of `AFTER INSERT` — parent row not yet committed |
| Trigger fires but data is wrong | `NEW.column_name` references wrong column — check the column names of the triggering table |

**Debugging approach:**
1. Check Supabase logs or `pg_log` for RAISE LOG messages.
2. Test the trigger function directly: `SELECT public.handle_new_user(ROW(...))`.
3. Check if the trigger exists: `SELECT * FROM information_schema.triggers WHERE trigger_name = '...'`.
4. Check function permissions: `SELECT * FROM pg_proc WHERE proname = '...'`.

## Production Considerations

- **Trigger performance**: Every trigger adds latency to the triggering operation. Profile slow inserts by checking if trigger execution is the bottleneck.
- **Transaction scope**: Triggers execute within the same transaction. A trigger that fails (without error handling) will rollback the entire transaction.
- **Migration order**: The trigger function must exist before the trigger is created. In migrations, create the function first, then the trigger.
- **Trigger on auth.users**: In Supabase, `auth.users` is managed by `supabase_auth_admin`. You can create triggers on it, but you cannot add `COMMENT ON TRIGGER` (you don't own the table). Document the trigger in the function's comment instead.

## Shivaay Example

Shivaay implements two trigger patterns:

**Auto-create customer profile on signup** (`20260909000000_create_customer_profile_trigger.sql`):
- `handle_new_customer()` trigger function fires `AFTER INSERT` on `auth.users`.
- Uses `SECURITY DEFINER` because the new user's session token doesn't exist yet when the trigger fires.
- Extracts `full_name` from `raw_user_meta_data` (populated by Google OAuth or `signUp` options).
- `ON CONFLICT (id) DO NOTHING` for idempotency.
- `EXCEPTION WHEN OTHERS` logs the error but always returns `NEW` — user registration is never blocked.
- Execute permission revoked from `PUBLIC`, granted only to `postgres`.
- `search_path` locked to `'pg_catalog', 'public', 'auth'`.
- `COMMENT ON FUNCTION` documents the design decisions.

**Auto-update `updated_at` timestamp** (`20260908190613_create_customers_table.sql`):
- `set_updated_at()` is a generic `BEFORE UPDATE` function that sets `NEW.updated_at = now()`.
- Applied to both `customers` and `customer_addresses` tables via separate triggers.
- Reuses the same function for both tables — the function is table-agnostic.

## Anti-Patterns

- **Trigger chains**: Table A's trigger writes to Table B, whose trigger writes to Table C. Difficult to debug and can cause infinite loops.
- **Business logic in triggers**: Complex conditional workflows that would be clearer in application code.
- **Triggers for denormalisation without cache invalidation**: Maintaining a materialised count/sum via triggers without considering eventual consistency in distributed systems.
- **Silent data loss**: Catching exceptions without logging them. The primary operation succeeds but the secondary data is silently lost.

## Validation Checklist

- [ ] Trigger function uses `SECURITY DEFINER` only when needed (cross-table writes)
- [ ] `search_path` is explicitly set on `SECURITY DEFINER` functions
- [ ] Execute permissions are revoked from `PUBLIC` on `SECURITY DEFINER` functions
- [ ] `ON CONFLICT DO NOTHING` or equivalent ensures idempotency
- [ ] Error handling uses `EXCEPTION WHEN OTHERS` with `RAISE LOG` for non-critical triggers
- [ ] Non-critical triggers always `RETURN NEW` (never block the primary operation)
- [ ] Trigger timing is correct (`BEFORE` for modifying `NEW`, `AFTER` for creating related rows)
- [ ] Function has a `COMMENT ON FUNCTION` documenting its purpose
- [ ] `DROP TRIGGER IF EXISTS` precedes `CREATE TRIGGER` for safe re-runs
- [ ] Trigger function is tested with actual data

## Related Skills

- [Production Database Migrations](../production-database-migrations/SKILL.md) — Triggers are created within migrations
- [Row-Level Security Design](../../security/row-level-security-design/SKILL.md) — `SECURITY DEFINER` bypasses RLS, which is intentional for triggers that create rows on behalf of new users

## Repository Evidence

- [`supabase/migrations/20260909000000_create_customer_profile_trigger.sql`](../../supabase/migrations/20260909000000_create_customer_profile_trigger.sql) — Full auto-create trigger with SECURITY DEFINER, ON CONFLICT, error handling, permission lockdown, and documentation
- [`supabase/migrations/20260908190613_create_customers_table.sql`](../../supabase/migrations/20260908190613_create_customers_table.sql) — `set_updated_at()` function and trigger application
- [`supabase/migrations/20260909010000_create_customer_addresses_table.sql`](../../supabase/migrations/20260909010000_create_customer_addresses_table.sql) — Reuse of `set_updated_at()` on a second table

## Limitations

- The Shivaay project only uses `INSERT` and `UPDATE` triggers. `DELETE` triggers and `INSTEAD OF` triggers were not demonstrated.
- Trigger-based audit logging (recording who changed what) was not implemented.
- Trigger performance under load was not measured — the project has low data volume.
- The `handle_new_customer` function accesses `raw_user_meta_data` which is a Supabase-specific column on `auth.users`. The general pattern is portable, but the specific data extraction is not.
- No testing framework for triggers was used — verification was manual.
