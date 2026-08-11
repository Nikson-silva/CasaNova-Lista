import { supabaseServer } from "@/lib/supabase/server"
import type { AdminReservation } from "@/types/admin-reservation"
import type { Reservation } from "@/types/reservation"
import type { RepositoryEntityResult } from "@/types/repository"

const reservationSelect = `
  id,
  gift_id,
  guest_name,
  guest_phone,
  message,
  created_at,
  updated_at,
  cancelled_at,
  gift:gifts!reservations_gift_id_fkey(id, name, status, image_path)
`

export const AdminReservationRepository = {
  async findAll(): Promise<AdminReservation[]> {
    const { data, error } = await supabaseServer
      .from("reservations")
      .select(reservationSelect)
      .order("created_at", { ascending: false })

    if (error) {
      throw error
    }

    return data
  },

  async findById(id: string): RepositoryEntityResult<Reservation> {
    const { data, error } = await supabaseServer
      .from("reservations")
      .select("*")
      .eq("id", id)
      .single()

    if (error) {
      throw error
    }

    return data
  },

  async cancelByGiftId(giftId: string): RepositoryEntityResult<Reservation> {
    const { data, error } = await supabaseServer.rpc("cancel_gift_reservation", {
      p_gift_id: giftId,
    })

    if (error) {
      throw error
    }

    return data
  },
}
