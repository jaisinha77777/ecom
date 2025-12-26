import { z } from "zod"

export const UserAddressSchema = z.object({
    name : z.string().min(1, "Name is required"),
  address_line1: z.string().min(1, "Address line 1 is required"),
  address_line2: z.string().optional().nullable(),
  city: z.string().min(1, "City is required"),
  state: z.string().optional(),
  pincode: z.string().min(1, "Pincode is required").max(6, "Max 6 digits"),
})
