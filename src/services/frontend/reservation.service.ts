import { httpClient } from "@/lib/api/client"
import type { Reservation, ReservationInsert } from "@/types/reservation"

export const reservationService = {
  reserveGift(data: ReservationInsert): Promise<Reservation> {
    return httpClient.post<Reservation>("/api/reservations", {
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
  },
}
