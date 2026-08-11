import { z } from "zod"

export const AdminReservationIdSchema = z.string().uuid()
