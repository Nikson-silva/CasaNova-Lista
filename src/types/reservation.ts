import type {
  Tables,
  TablesInsert,
  TablesUpdate,
} from "@/types/database"

export type Reservation = Tables<"reservations">
export type ReservationInsert = TablesInsert<"reservations">
export type ReservationUpdate = TablesUpdate<"reservations">
