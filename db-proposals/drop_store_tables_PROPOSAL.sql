-- ==============================================================================
-- PROPOSAL: Drop E-Commerce / Store Tables
-- STATUS: UNEXECUTED (Proposal Only - Do NOT run automatically)
-- ==============================================================================
--
-- IMPORTANT SAFETY WARNING:
-- 1. DO NOT RUN THIS SCRIPT WITHOUT TAKING A FULL DATABASE BACKUP FIRST.
-- 2. This file is a proposal created for future review.
-- 3. Run only in the Supabase SQL editor after careful verification and backup.
--
-- Target Store Tables to be dropped (after verification):
-- - product
-- - product_variant
-- - product_collection
-- - product_category
-- - price_set
-- - price
-- - product_variant_price_set
-- - cart
-- - cart_line_item
-- - cart_address
-- - cart_shipping_method
-- - "order"
-- - order_item
-- - order_line_item
-- - order_address
-- - region
-- - region_country
-- - shipping_option
-- - customer
--
-- Tables that must NEVER be touched:
-- - profiles
-- - services
-- - case_studies
-- - post
-- - testimonials
-- - site_setting
-- - site_keywords
-- - seo_setting
-- - link_suggestion
-- - link_embedding
-- - organization_profile
-- - auth schema tables & storage buckets
-- ==============================================================================

/*
-- Example proposed draft (commented out for safety):

BEGIN;

DROP TABLE IF EXISTS "cart_shipping_method" CASCADE;
DROP TABLE IF EXISTS "cart_address" CASCADE;
DROP TABLE IF EXISTS "cart_line_item" CASCADE;
DROP TABLE IF EXISTS "cart" CASCADE;

DROP TABLE IF EXISTS "order_line_item" CASCADE;
DROP TABLE IF EXISTS "order_item" CASCADE;
DROP TABLE IF EXISTS "order_address" CASCADE;
DROP TABLE IF EXISTS "order" CASCADE;

DROP TABLE IF EXISTS "product_variant_price_set" CASCADE;
DROP TABLE IF EXISTS "price" CASCADE;
DROP TABLE IF EXISTS "price_set" CASCADE;
DROP TABLE IF EXISTS "product_variant" CASCADE;
DROP TABLE IF EXISTS "product" CASCADE;
DROP TABLE IF EXISTS "product_collection" CASCADE;
DROP TABLE IF EXISTS "product_category" CASCADE;

DROP TABLE IF EXISTS "region_country" CASCADE;
DROP TABLE IF EXISTS "shipping_option" CASCADE;
DROP TABLE IF EXISTS "region" CASCADE;
DROP TABLE IF EXISTS "customer" CASCADE;

COMMIT;
*/
