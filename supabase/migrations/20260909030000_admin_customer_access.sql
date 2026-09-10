-- =============================================================================
-- Migration: admin_customer_access
-- Purpose:   Grants admin users (role = 'admin') read access to the
--            public.customers and public.customer_addresses tables.
-- =============================================================================

-- ---------------------------------------------------------------------------
-- 1. Customers Table Admin Policy
-- ---------------------------------------------------------------------------
CREATE POLICY "Admins can view all customers"
  ON "public"."customers"
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

-- ---------------------------------------------------------------------------
-- 2. Customer Addresses Table Admin Policy
-- ---------------------------------------------------------------------------
CREATE POLICY "Admins can view all customer addresses"
  ON "public"."customer_addresses"
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
