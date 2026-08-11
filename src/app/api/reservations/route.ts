import { ZodError } from "zod";

import { badRequest, conflict, created, internalError, notFound } from "@/lib/api/response";
import { ReservationSchema } from "@/schemas/reservation.schema";
import { ReservationService } from "@/services/reservation.service";

const reservationService = new ReservationService();

function getErrorCode(error: unknown): unknown {
    if (typeof error !== "object" || error === null || !("code" in error)) {
        return undefined;
    }

    return error.code;
}

export async function POST(request: Request) {
    try {
        const body: unknown = await request.json();
        const reservationRequest = ReservationSchema.parse(body);
        const reservation = await reservationService.reserveGift(reservationRequest);

        return created(reservation);
    } catch (error) {
        if (error instanceof SyntaxError || error instanceof ZodError) {
            return badRequest("Dados da reserva inválidos.");
        }

        const errorCode = getErrorCode(error);

        if (errorCode === "P0001") {
            return conflict("Este presente acabou de ser reservado.");
        }

        if (errorCode === "P0002") {
            return notFound("Presente não encontrado.");
        }

        return internalError("Não foi possível realizar a reserva.");
    }
}
