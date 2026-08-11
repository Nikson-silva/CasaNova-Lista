import { internalError, ok } from "@/lib/api/response"
import { GiftService } from "@/services/gift.service"

const giftService = new GiftService()

export async function GET() {
  try {
    const gifts = await giftService.findAll()

    return ok(gifts)
  } catch {
    return internalError("Não foi possível carregar os presentes.")
  }
}
