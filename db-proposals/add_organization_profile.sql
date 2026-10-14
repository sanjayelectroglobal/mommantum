-- ==============================================================================
-- Migration Proposal: Add organization_profile column to site_setting
-- Status: PROPOSAL ONLY (LOCAL ONLY - Do not execute against production)
-- Purpose: Stores structured schema metadata for Organization and LocalBusiness
--          (legalName, telephone, address, founders, social sameAs, etc.)
-- ==============================================================================

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'site_setting'
          AND column_name = 'organization_profile'
    ) THEN
        ALTER TABLE public.site_setting
        ADD COLUMN organization_profile JSONB DEFAULT NULL;

        COMMENT ON COLUMN public.site_setting.organization_profile IS 
          'Structured organization profile override for JSON-LD schema generation (Schema.org Organization / LocalBusiness)';
    END IF;
END $$;
