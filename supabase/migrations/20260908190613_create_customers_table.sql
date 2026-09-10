-- =============================================================================
-- Migration: create_customers_table
-- Branch:    feature/customer-auth
-- Purpose:   Public-facing customer profile table, separate from admin profiles.
--            One row per authenticated customer, keyed on auth.users(id).
--            Designed to support future Google OAuth (Supabase Auth handles that;
--            no OAuth logic lives here).
-- =============================================================================

-- ---------------------------------------------------------------------------
-- 1. Table definition
-- ---------------------------------------------------------------------------

CREATE TABLE "public"."customers" (
  "id"         uuid                     NOT NULL,
  "full_name"  text,
  "email"      text,
  "phone"      text,
  "created_at" timestamp with time zone NOT NULL DEFAULT now(),
  "updated_at" timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT "customers_pkey" PRIMARY KEY (id),
  CONSTRAINT "customers_id_fkey"
    FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Note: RLS is enabled automatically by the rls_auto_enable() event trigger
-- that is already installed by the production baseline migration.
-- We enable it explicitly here as well for safety / portability.
ALTER TABLE "public"."customers"
  ENABLE ROW LEVEL SECURITY;

-- ---------------------------------------------------------------------------
-- 2. Trigger: keep updated_at current on every row update
-- ---------------------------------------------------------------------------

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

CREATE TRIGGER trg_customers_updated_at
  BEFORE UPDATE ON "public"."customers"
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

-- ---------------------------------------------------------------------------
-- 3. Row Level Security policies
--    Principle: a customer can only see and modify their own row.
--    No admin access is granted through this table — admins use profiles.
-- ---------------------------------------------------------------------------

-- SELECT: a customer can read their own row.
CREATE POLICY "Customers can view their own record"
  ON "public"."customers"
  FOR SELECT
  TO "authenticated"
  USING (( SELECT auth.uid() AS uid) = id);

-- INSERT: a customer can insert exactly one row whose id matches their uid.
CREATE POLICY "Customers can insert their own record"
  ON "public"."customers"
  FOR INSERT
  TO "authenticated"
  WITH CHECK (( SELECT auth.uid() AS uid) = id);

-- UPDATE: a customer can update their own row only.
CREATE POLICY "Customers can update their own record"
  ON "public"."customers"
  FOR UPDATE
  TO "authenticated"
  USING (( SELECT auth.uid() AS uid) = id)
  WITH CHECK (( SELECT auth.uid() AS uid) = id);

-- DELETE: customers cannot delete their own auth account row from this side;
-- deletion cascades automatically from auth.users if the account is removed.
-- No DELETE policy is granted here intentionally.

-- ---------------------------------------------------------------------------
-- 4. Grants — mirror the conservative pattern used for profiles in the
--    baseline migration (no broad INSERT/UPDATE/DELETE to anon / service_role).
-- ---------------------------------------------------------------------------

GRANT MAINTAIN, REFERENCES, TRIGGER, TRUNCATE ON TABLE "public"."customers" TO "anon";

GRANT MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE ON TABLE "public"."customers" TO "authenticated";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."customers" TO "postgres";

GRANT MAINTAIN, REFERENCES, TRIGGER, TRUNCATE ON TABLE "public"."customers" TO "service_role";
