import { supabaseServer } from "@/lib/supabase/server"
import type { Reservation, ReservationInsert } from "@/types/reservation"
import type { RepositoryEntityResult } from "@/types/repository"

export const ReservationRepository = {
  async reserveGift(
    reservation: ReservationInsert,
  ): RepositoryEntityResult<Reservation> {
    const { data, error } = await supabaseServer
      .rpc("reserve_gift", {
        p_gift_id: reservation.gift_id,
        p_guest_name: reservation.guest_name,
        p_guest_phone: reservation.guest_phone as string,
        p_message: reservation.message,
      })

    if (error) {
      throw error
    }

    return data
  },
}
