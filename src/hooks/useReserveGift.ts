"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { reservationService } from "@/services/frontend/reservation.service";
// import type { Gift } from "@/types/gift";
import type { ReservationInsert } from "@/types/reservation";

export const RESERVATION_CONFLICT_MESSAGE = "Este presente acabou de ser reservado.";

function isReservationConflict(error: Error): boolean {
    return error.message === RESERVATION_CONFLICT_MESSAGE;
}

export function useReserveGift(giftId: string) {
    const queryClient = useQueryClient();

    async function refreshGiftQueries() {
        await Promise.all([
            queryClient.invalidateQueries({
                queryKey: ["gifts"],
                exact: true,
            }),
            queryClient.invalidateQueries({
                queryKey: ["gifts", giftId],
                exact: true,
            }),
        ]);
    }

    return useMutation({
        mutationFn: (data: ReservationInsert) => reservationService.reserveGift(data),

        onSuccess: async () => {
            await refreshGiftQueries();
        },

        onError: async (error: Error) => {
            if (isReservationConflict(error)) {
                await refreshGiftQueries();
            }
        },

        retry: false,
    });
}
