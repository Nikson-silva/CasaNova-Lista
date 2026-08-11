import { z } from "zod"

export const ReservationSchema = z.object({
  gift_id: z.string().uuid(),
  guest_name: z.string().trim().min(3).max(120),
  message: z.string().trim().min(5).max(1000),
  guest_phone: z
    .string()
    .trim()
    .max(30)
    .optional()
    .transform((value) => value || null),
})

export type ReservationRequest = z.infer<typeof ReservationSchema>
