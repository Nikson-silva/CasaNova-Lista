import { z } from "zod"

import { badRequest, internalError, notFound, ok } from "@/lib/api/response"
import { GiftService } from "@/services/gift.service"

const giftService = new GiftService()

function isMissingRecordError(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === "PGRST116"
  )
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params

    if (!z.string().uuid().safeParse(id).success) {
      return badRequest("Identificador do presente inválido.")
    }

    const gift = await giftService.findById(id)

    return ok(gift)
  } catch (error) {
    if (isMissingRecordError(error)) {
      return notFound("Presente não encontrado.")
    }

    return internalError("Não foi possível carregar o presente.")
  }
}
