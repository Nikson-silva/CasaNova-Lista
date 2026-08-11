import type { Gift } from "@/types/gift"
import type { Reservation } from "@/types/reservation"

export type AdminReservationGift = Pick<
  Gift,
  "id" | "image_path" | "name" | "status"
>

export type AdminReservation = Reservation & {
  gift: AdminReservationGift
}
