"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"

import { reservationService } from "@/services/frontend/reservation.service"
import type { Gift } from "@/types/gift"
import type { ReservationInsert } from "@/types/reservation"

export const RESERVATION_CONFLICT_MESSAGE =
  "Este presente acabou de ser reservado."

function isReservationConflict(error: Error): boolean {
  return error.message === RESERVATION_CONFLICT_MESSAGE
}

export function useReserveGift(giftId: string) {
  const queryClient = useQueryClient()

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
    ])
  }

  return useMutation({
    mutationFn: (data: ReservationInsert) =>
      reservationService.reserveGift(data),
    onSuccess: async () => {
      queryClient.setQueryData<Gift>(["gifts", giftId], (currentGift) =>
        currentGift ? { ...currentGift, status: "reserved" } : currentGift,
      )
      queryClient.setQueryData<Gift[]>(["gifts"], (currentGifts) =>
        currentGifts?.map((gift) =>
          gift.id === giftId ? { ...gift, status: "reserved" } : gift,
        ),
      )

      await refreshGiftQueries()
    },
    onError: async (error: Error) => {
      if (isReservationConflict(error)) {
        await refreshGiftQueries()
      }
    },
    retry: false,
  })
}
