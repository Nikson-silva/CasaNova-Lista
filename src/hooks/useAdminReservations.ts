"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import { adminReservationService } from "@/services/frontend/admin-reservation.service"

const ADMIN_RESERVATIONS_QUERY_KEY = ["admin", "reservations"] as const

export function useAdminReservations() {
  return useQuery({
    queryKey: ADMIN_RESERVATIONS_QUERY_KEY,
    queryFn: adminReservationService.getReservations,
  })
}

export function useCancelAdminReservation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: adminReservationService.cancelReservation,
    onSuccess: async (reservation) => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ADMIN_RESERVATIONS_QUERY_KEY,
        }),
        queryClient.invalidateQueries({ queryKey: ["admin", "gifts"] }),
        queryClient.invalidateQueries({ queryKey: ["gifts"] }),
        queryClient.invalidateQueries({
          queryKey: ["admin", "gifts", reservation.gift_id],
          exact: true,
        }),
        queryClient.invalidateQueries({
          queryKey: ["gifts", reservation.gift_id],
          exact: true,
        }),
      ])
    },
  })
}
