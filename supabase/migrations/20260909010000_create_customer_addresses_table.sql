-- =============================================================================
-- Migration: create_customer_addresses_table
-- Purpose:   Stores the primary delivery address for each customer.
--            Enforces ONE address per customer for now.
--            latitude and longitude are optional until Google Maps is integrated.
-- =============================================================================

-- ---------------------------------------------------------------------------
-- 1. Table definition
-- ---------------------------------------------------------------------------

CREATE TABLE "public"."customer_addresses" (
  "id"             uuid                     NOT NULL DEFAULT gen_random_uuid(),
  "customer_id"    uuid                     NOT NULL,
  
  -- Address Fields
  "address_line_1" text                     NOT NULL,
  "address_line_2" text,
  "area"           text                     NOT NULL,
  "city"           text                     NOT NULL,
  "state"          text                     NOT NULL,
  "pincode"        text                     NOT NULL,
  "landmark"       text,
  
  -- Geolocation Fields (Nullable for now)
  "latitude"       double precision,
  "longitude"      double precision,
  
  "created_at"     timestamp with time zone NOT NULL DEFAULT now(),
  "updated_at"     timestamp with time zone NOT NULL DEFAULT now(),
  
  CONSTRAINT "customer_addresses_pkey" PRIMARY KEY (id),
  CONSTRAINT "customer_addresses_customer_id_fkey"
    FOREIGN KEY (customer_id) REFERENCES public.customers(id) ON DELETE CASCADE,
  -- Enforce ONE address per customer
  CONSTRAINT "customer_addresses_customer_id_key" UNIQUE (customer_id)
);

-- Enable RLS
ALTER TABLE "public"."customer_addresses"
  ENABLE ROW LEVEL SECURITY;

-- ---------------------------------------------------------------------------
-- 2. Trigger: keep updated_at current on every row update
-- ---------------------------------------------------------------------------

CREATE TRIGGER trg_customer_addresses_updated_at
  BEFORE UPDATE ON "public"."customer_addresses"
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

-- ---------------------------------------------------------------------------
-- 3. Row Level Security policies
-- ---------------------------------------------------------------------------

-- SELECT: a customer can view their own address.
CREATE POLICY "Customers can view their own address"
  ON "public"."customer_addresses"
  FOR SELECT
  TO "authenticated"
  USING (( SELECT auth.uid() AS uid) = customer_id);

-- INSERT: a customer can insert their own address.
CREATE POLICY "Customers can insert their own address"
  ON "public"."customer_addresses"
  FOR INSERT
  TO "authenticated"
  WITH CHECK (( SELECT auth.uid() AS uid) = customer_id);

-- UPDATE: a customer can update their own address.
CREATE POLICY "Customers can update their own address"
  ON "public"."customer_addresses"
  FOR UPDATE
  TO "authenticated"
  USING (( SELECT auth.uid() AS uid) = customer_id)
  WITH CHECK (( SELECT auth.uid() AS uid) = customer_id);

-- DELETE: a customer can delete their own address.
CREATE POLICY "Customers can delete their own address"
  ON "public"."customer_addresses"
  FOR DELETE
  TO "authenticated"
  USING (( SELECT auth.uid() AS uid) = customer_id);

-- ---------------------------------------------------------------------------
-- 4. Grants
-- ---------------------------------------------------------------------------

GRANT MAINTAIN, REFERENCES, TRIGGER, TRUNCATE ON TABLE "public"."customer_addresses" TO "anon";

GRANT MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE ON TABLE "public"."customer_addresses" TO "authenticated";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."customer_addresses" TO "postgres";

GRANT MAINTAIN, REFERENCES, TRIGGER, TRUNCATE ON TABLE "public"."customer_addresses" TO "service_role";
