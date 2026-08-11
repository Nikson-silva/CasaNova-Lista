import { z } from "zod"

const nullableUrl = z
  .string()
  .trim()
  .url("Link de recomendação inválido.")
  .nullable()
  .transform((value) => value || null)

const nullableImagePath = z
  .string()
  .trim()
  .min(1, "Imagem inválida.")
  .max(512, "Imagem inválida.")
  .nullable()
  .transform((value) => value || null)

export const AdminGiftSchema = z.object({
  name: z.string().trim().min(1, "Informe o nome.").max(255),
  description: z.string().trim().min(1, "Informe a descrição.").max(2000),
  category_id: z.string().uuid().nullable(),
  estimated_price: z.number().finite().nonnegative().nullable(),
  image_path: nullableImagePath,
  recommendation_url: nullableUrl,
  status: z.enum(["available", "reserved"]),
  kind: z.enum(["normal", "crazy"]),
  display_order: z.number().int().positive(),
})

export type AdminGiftRequest = z.infer<typeof AdminGiftSchema>

export const AdminGiftIdSchema = z.string().uuid()
