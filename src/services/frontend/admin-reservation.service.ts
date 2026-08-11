import { httpClient } from "@/lib/api/client"
import type { AdminReservation } from "@/types/admin-reservation"
import type { Reservation } from "@/types/reservation"

export const adminReservationService = {
  getReservations(): Promise<AdminReservation[]> {
    return httpClient.get<AdminReservation[]>("/api/admin/reservations")
  },

  cancelReservation(id: string): Promise<Reservation> {
    return httpClient.post<Reservation>(`/api/admin/reservations/${id}/cancel`)
  },
}
