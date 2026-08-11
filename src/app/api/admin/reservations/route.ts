import { internalError, ok, unauthorized } from "@/lib/api/response"
import { requireAdminSession } from "@/lib/admin/session"
import { AdminReservationService } from "@/services/admin-reservation.service"

const adminReservationService = new AdminReservationService()

export async function GET() {
  try {
    await requireAdminSession()
  } catch {
    return unauthorized("Não autorizado.")
  }

  try {
    return ok(await adminReservationService.findAll())
  } catch {
    return internalError("Não foi possível carregar as reservas.")
  }
}
