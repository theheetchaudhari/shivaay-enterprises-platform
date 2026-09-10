-- =============================================================================
-- Migration: create_customer_profile_trigger
-- Branch:    feature/customer-auth
-- Purpose:   Automatically create a public.customers row whenever a new user
--            is inserted into auth.users (covers email/password sign-up and
--            future OAuth providers such as Google).
--
-- Design decisions:
--   1. SECURITY DEFINER: the function executes as its owner (postgres) so it
--      can INSERT into public.customers even before the new user's session
--      token exists. No RLS bypass is needed on the SELECT side.
--   2. ON CONFLICT (id) DO NOTHING: makes the function idempotent — safe to
--      call multiple times for the same user (e.g., admin re-seeds a user).
--   3. Exception handler: a failure inside the trigger NEVER rolls back the
--      auth.users INSERT (i.e., user sign-up is never blocked). Errors are
--      written to pg_log for observability.
--   4. search_path is locked to prevent search_path-injection attacks.
--   5. Does NOT touch public.profiles — admin rows are managed separately.
-- =============================================================================

-- ---------------------------------------------------------------------------
-- 1. Trigger function
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.handle_new_customer()
  RETURNS trigger
  LANGUAGE plpgsql
  SECURITY DEFINER
  -- Lock search_path: reference auth and public schemas only.
  -- pg_catalog must appear first so built-ins resolve correctly.
  SET search_path TO 'pg_catalog', 'public', 'auth'
AS $$
BEGIN
  -- Attempt to create the customer row.
  -- raw_user_meta_data->>'full_name' is populated by:
  --   • supabase.auth.signUp({ options: { data: { full_name: '...' } } })
  --   • Google OAuth (Google populates `name` — mapped to full_name by Supabase)
  -- Falls back to NULL safely when not provided.
  INSERT INTO public.customers (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NULL)
  )
  ON CONFLICT (id) DO NOTHING;

  RETURN NEW;

EXCEPTION
  WHEN OTHERS THEN
    -- Log the error but allow auth.users INSERT to succeed.
    -- The customer row can be created later via the upsert in the frontend.
    RAISE LOG 'handle_new_customer: could not create customers row for user % — SQLSTATE: %, MESSAGE: %',
              NEW.id, SQLSTATE, SQLERRM;
    RETURN NEW;
END;
$$;

-- Revoke public execute on this function — it is called only by the trigger.
REVOKE ALL ON FUNCTION public.handle_new_customer() FROM PUBLIC;
-- Grant execute to postgres so the trigger can fire under the SECURITY DEFINER context.
GRANT EXECUTE ON FUNCTION public.handle_new_customer() TO postgres;

-- ---------------------------------------------------------------------------
-- 2. Trigger on auth.users
--    Fires AFTER INSERT so that NEW.id is committed and can satisfy the FK
--    constraint on public.customers(id) → auth.users(id).
-- ---------------------------------------------------------------------------

-- Drop if somehow already exists (safe re-run).
DROP TRIGGER IF EXISTS trg_on_auth_user_created ON auth.users;

CREATE TRIGGER trg_on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_customer();

-- ---------------------------------------------------------------------------
-- 3. Comment for documentation / pg_description
-- ---------------------------------------------------------------------------

COMMENT ON FUNCTION public.handle_new_customer() IS
  'SECURITY DEFINER trigger function: inserts a public.customers row for every '
  'new auth.users entry. Idempotent via ON CONFLICT DO NOTHING. '
  'Supports email/password and OAuth (Google) sign-ups. '
  'Never blocks user registration on failure.';

-- Note: COMMENT ON TRIGGER cannot be set on auth.users (owned by supabase_auth_admin).
-- Documentation lives in the function comment above and in this migration file header.
