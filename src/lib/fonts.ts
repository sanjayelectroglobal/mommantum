import { Epilogue, Outfit, Mansalva, Cormorant_Garamond, DM_Sans } from "next/font/google"

export const epilogue = Epilogue({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
})

export const outfit = Outfit({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
})

export const mansalva = Mansalva({
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
})

export const cormorantGaramond = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  display: "swap",
})

export const dmSans = DM_Sans({
  subsets: ["latin"],
  display: "swap",
})
