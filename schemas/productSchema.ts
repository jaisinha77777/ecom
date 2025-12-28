import { z } from "zod";

/**
 * Prisma Decimal → string | number
 * (Prisma accepts both, but string is safer for money)
 */

// Min rupees 1 
const DecimalSchema = z.union([
  z.string().regex(/^(?:[1-9]\d*|0)?(?:\.\d{1,2})?$/),
  z.number().min(1),
]);

export const productSchema = z.object({
  productName: z.string().min(1).max(255),
  description: z.string().optional(),
  brand: z.string(),
  category: z.number(),
  price: DecimalSchema,
  compareAtPrice: DecimalSchema.optional(),
  cost: DecimalSchema,
  currency: z.string().length(3).default("INR"),
  stockQuantity: z.preprocess(
    (val) => Number(val),
    z.number().int().min(0)
  ),
  tags: z.array(z.string()).optional(),
  images: z.any().optional(), // Prisma Json
});

