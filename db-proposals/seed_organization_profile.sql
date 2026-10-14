-- ==============================================================================
-- Seed Proposal: Seed organization_profile into site_setting
-- Status: PROPOSAL ONLY (LOCAL ONLY - Do not execute against production)
-- Purpose: Populates client-confirmed business details for Mommantum
-- ==============================================================================

UPDATE public.site_setting
SET 
  brand_name = 'Mommantum',
  site_name = 'Mommantum',
  site_url = 'https://www.mommantum.com/',
  logo_url = 'https://www.mommantum.com/logo.png',
  organization_profile = '{
    "legalName": "Mommantum",
    "name": "Mommantum",
    "alternateName": "Mommantum",
    "url": "https://www.mommantum.com/",
    "logo": {
      "url": "https://www.mommantum.com/logo.png",
      "width": 500,
      "height": 500
    },
    "foundingDate": "2025-12-15",
    "founder": {
      "name": "Kuldeep Ahir",
      "image": "/team/kuldeep.webp",
      "jobTitle": "Founder"
    },
    "numberOfEmployees": {
      "value": 15
    },
    "taxID": "08CTJPA2104B1ZI",
    "email": "kuldeep@mommantum.in",
    "telephone": "+917742276031",
    "whatsapp": {
      "telephone": "+917742276031",
      "contactType": "customer support",
      "availableLanguage": ["English", "Hindi"]
    },
    "address": {
      "streetAddress": "B40A, Krishi Nagar, Taroo Ki Koot, near B2 Bypass",
      "addressLocality": "Jaipur",
      "addressRegion": "Rajasthan",
      "postalCode": "302029",
      "addressCountry": "IN"
    },
    "clientsCanVisitOffice": true,
    "openingHours": [
      {
        "days": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        "opens": "09:00",
        "closes": "21:00"
      }
    ],
    "areaServed": [
      "India",
      "Worldwide (domestic and international)"
    ],
    "hasMap": "https://maps.app.goo.gl/m5GfvAHsZJ5chD4z7?g_st=aw",
    "sameAs": [
      "https://www.instagram.com/mommantummedia/",
      "https://www.facebook.com/profile.php?id=61585107904273"
    ]
  }'::jsonb
WHERE id = (SELECT id FROM public.site_setting LIMIT 1);
