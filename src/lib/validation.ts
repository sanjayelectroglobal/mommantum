import { z } from "zod"

// 1. Reusable Validation Rules (Helpers)
export const indianPhone = z
  .string()
  .min(1, "Phone is required")
  .regex(/^[6-9]\d{9}$/, "Enter valid 10-digit Indian mobile number")
  .transform((v) => v.replace(/\D/g, "").slice(-10))

export const indianPincode = z
  .string()
  .min(1, "Pincode is required")
  .regex(/^\d{6}$/, "Must be 6 digits")

export const sanitizedString = (label: string, min = 1, max = 100) =>
  z
    .string()
    .min(min, `${label} is required`)
    .max(max, `${label} is too long`)
    .transform((v) => v.trim())

// 2. Form Schemas
export const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
})

export const signupSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  first_name: sanitizedString("First name", 1, 50),
  last_name: sanitizedString("Last name", 1, 50),
  phone: z.string().optional().or(z.literal("")),
  password: z.string().min(6, "Password must be at least 6 characters"),
})

export const addressSchema = z.object({
  first_name:   sanitizedString("First name", 1, 50),
  last_name:    sanitizedString("Last name", 1, 50),
  address_1:    sanitizedString("Address", 5, 200),
  address_2:    z.string().optional().or(z.literal("")),
  company:      z.string().optional().or(z.literal("")),
  city:         sanitizedString("City", 2, 100),
  province:     z.string().optional().or(z.literal("")),
  postal_code:  z.string().min(1, "Postal code is required"),
  phone:        z.string().optional().or(z.literal("")),
  country_code: z.string().min(2, "Country is required"),
}).superRefine((data, ctx) => {
  if (data.country_code.toLowerCase() === "in") {
    const pincodeRes = indianPincode.safeParse(data.postal_code)
    if (!pincodeRes.success) {
      pincodeRes.error.issues.forEach(issue => {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["postal_code"],
          message: issue.message,
        })
      })
    }
    if (data.phone) {
      const phoneRes = indianPhone.safeParse(data.phone)
      if (!phoneRes.success) {
        phoneRes.error.issues.forEach(issue => {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["phone"],
            message: issue.message,
          })
        })
      }
    }
  }
})

// 3. Exported TypeScript Types inferred from the Schemas
export type LoginFormValues = z.infer<typeof loginSchema>
export type SignupFormValues = z.infer<typeof signupSchema>
export type AddressFormValues = z.infer<typeof addressSchema>
