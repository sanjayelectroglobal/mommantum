/**
 * @file fonts.ts
 * @description Typography definitions for Mommantum brand fonts.
 * 
 * Replaces the fragile Next.js 15.3.9 `@next/font/google` loader (which crashes on Vercel
 * due to regex URL parsing errors) with preconnected Google Fonts linked in layout.tsx.
 * Provides typed FontClass objects with exact CSS utility class names and fallback styles.
 */

export type FontClass = {
  className: string
  style: { fontFamily: string }
}

export const epilogue: FontClass = {
  className: "font-epilogue",
  style: { fontFamily: "'Epilogue', sans-serif" },
}

export const outfit: FontClass = {
  className: "font-outfit",
  style: { fontFamily: "'Outfit', sans-serif" },
}

export const mansalva: FontClass = {
  className: "font-mansalva",
  style: { fontFamily: "'Mansalva', cursive" },
}

export const cormorantGaramond: FontClass = {
  className: "font-cormorant",
  style: { fontFamily: "'Cormorant Garamond', serif" },
}

export const dmSans: FontClass = {
  className: "font-dmsans",
  style: { fontFamily: "'DM Sans', sans-serif" },
}
