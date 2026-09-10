-- =============================================================================
-- Migration: fix_authenticated_grants
-- Purpose:   Grants UPDATE on customers and INSERT/UPDATE on customer_addresses
--            to the authenticated role, fixing the insufficient privilege errors.
-- =============================================================================

-- Grant UPDATE so customers can edit their name/phone
GRANT UPDATE ON TABLE "public"."customers" TO "authenticated";

-- Grant INSERT, UPDATE (for UPSERT) so customers can manage their address
-- Note: DELETE is intentionally omitted as address deletion is not supported.
GRANT INSERT, UPDATE ON TABLE "public"."customer_addresses" TO "authenticated";
