"use client"

import { useState } from "react"

import { Badge } from "@/components/ui/Badge"
import { Button } from "@/components/ui/Button"
import { Card } from "@/components/ui/Card"
import { Skeleton } from "@/components/ui/Skeleton"
import {
  useAdminReservations,
  useCancelAdminReservation,
} from "@/hooks/useAdminReservations"
import { cn } from "@/lib/utils"

const dateFormatter = new Intl.DateTimeFormat("pt-BR", {
  dateStyle: "short",
  timeStyle: "short",
})

type ReservationFilter = "all" | "active" | "cancelled"

function getErrorMessage(error: unknown): string {
  return error instanceof Error
    ? error.message
    : "Não foi possível concluir a operação."
}

export function AdminReservationsPanel() {
  const reservationsQuery = useAdminReservations()
  const cancelReservationMutation = useCancelAdminReservation()
  const [filter, setFilter] = useState<ReservationFilter>("all")
  const [confirmationId, setConfirmationId] = useState<string | null>(null)
  const [operationError, setOperationError] = useState<string | null>(null)
  const reservations = reservationsQuery.data ?? []
  const filteredReservations = reservations.filter((reservation) => {
        if (filter === "active") {
          return reservation.cancelled_at === null
        }

        if (filter === "cancelled") {
          return reservation.cancelled_at !== null
        }

        return true
      })

  async function cancelReservation(id: string) {
    setOperationError(null)

    try {
      await cancelReservationMutation.mutateAsync(id)
      setConfirmationId(null)
    } catch (error) {
      setOperationError(getErrorMessage(error))
    }
  }

  return (
    <section className="mt-10" aria-labelledby="admin-reservations-title">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 id="admin-reservations-title" className="font-serif text-2xl font-semibold text-[#263748]">
            Reservas
          </h2>
          <p className="mt-1 text-sm text-[#627489]">
            {reservations.length} {reservations.length === 1 ? "reserva" : "reservas"}
          </p>
        </div>
        <select
          aria-label="Filtrar reservas"
          value={filter}
          onChange={(event) => setFilter(event.target.value as ReservationFilter)}
          className="h-10 rounded-md border border-[#B9D7E7] bg-white px-3 text-sm text-[#263748] outline-none focus-visible:ring-2 focus-visible:ring-[#1682C0]/30"
        >
          <option value="all">Todas</option>
          <option value="active">Ativas</option>
          <option value="cancelled">Canceladas</option>
        </select>
      </div>

      {operationError ? <p role="alert" className="mt-4 text-sm text-[#B91C1C]">{operationError}</p> : null}

      {reservationsQuery.isError ? (
        <Card className="mt-6 p-6 text-center">
          <p className="text-[#263748]">Não foi possível carregar as reservas.</p>
          <Button
            type="button"
            className="mt-4"
            loading={reservationsQuery.isFetching}
            onClick={() => { void reservationsQuery.refetch() }}
          >
            Tentar novamente
          </Button>
        </Card>
      ) : reservationsQuery.isLoading ? (
        <div className="mt-6 grid gap-4">
          {[1, 2].map((item) => <Skeleton key={item} className="h-44 w-full" />)}
        </div>
      ) : filteredReservations.length === 0 ? (
        <Card className="mt-6 p-6 text-center text-[#627489]">
          {reservations.length === 0
            ? "Não existem reservas no momento."
            : "Nenhuma reserva encontrada para o filtro selecionado."}
        </Card>
      ) : (
        <div className="mt-6 grid gap-4">
          {filteredReservations.map((reservation) => {
            const isActive = reservation.cancelled_at === null
            const isGiftAvailable = reservation.gift.status === "available"
            const isCancelling =
              cancelReservationMutation.isPending &&
              cancelReservationMutation.variables === reservation.id

            return (
              <Card key={reservation.id} className={cn("p-5", !isActive && "bg-[#F8FAFC]")}>
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <h3 className="font-serif text-xl font-semibold text-[#263748]">{reservation.gift.name}</h3>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <Badge variant={isActive ? "success" : "outline"}>{isActive ? "Ativa" : "Cancelada"}</Badge>
                      <Badge variant={isGiftAvailable ? "success" : "danger"}>{isGiftAvailable ? "Disponível" : "Reservado"}</Badge>
                    </div>
                    {isActive && isGiftAvailable ? (
                      <p role="alert" className="mt-3 text-sm text-[#B45309]">
                        Reserva existente com presente disponível.
                      </p>
                    ) : null}
                    <dl className="mt-4 grid gap-3 text-sm">
                      <div>
                        <dt className="font-medium text-[#263748]">Convidado</dt>
                        <dd className="mt-0.5 text-[#627489]">{reservation.guest_name}</dd>
                      </div>
                      {reservation.guest_phone ? (
                        <div>
                          <dt className="font-medium text-[#263748]">Telefone</dt>
                          <dd className="mt-0.5 text-[#627489]">{reservation.guest_phone}</dd>
                        </div>
                      ) : null}
                      <div>
                        <dt className="font-medium text-[#263748]">Mensagem</dt>
                        <dd className="mt-0.5 whitespace-pre-wrap text-[#627489]">{reservation.message}</dd>
                      </div>
                      <div>
                        <dt className="font-medium text-[#263748]">Reservado em</dt>
                        <dd className="mt-0.5 text-[#627489]">{dateFormatter.format(new Date(reservation.created_at))}</dd>
                      </div>
                      {reservation.cancelled_at ? (
                        <div>
                          <dt className="font-medium text-[#263748]">Cancelada em</dt>
                          <dd className="mt-0.5 text-[#627489]">{dateFormatter.format(new Date(reservation.cancelled_at))}</dd>
                        </div>
                      ) : null}
                    </dl>
                  </div>

                  {isActive ? (
                    <div className="shrink-0">
                      {confirmationId === reservation.id ? (
                        <div className="max-w-sm rounded-md border border-[#F3D1D1] bg-[#FFF7F7] p-4">
                          <p className="text-sm font-medium text-[#7F1D1D]">Tem certeza que deseja liberar este presente?</p>
                          <p className="mt-1 text-sm text-[#7F1D1D]">Isso cancelará a reserva atual e permitirá que o presente seja reservado novamente.</p>
                          <div className="mt-3 flex flex-wrap gap-2">
                            <Button type="button" variant="destructive" size="sm" loading={isCancelling} disabled={cancelReservationMutation.isPending} onClick={() => { void cancelReservation(reservation.id) }}>
                              Confirmar liberação
                            </Button>
                            <Button type="button" variant="outline" size="sm" disabled={isCancelling} onClick={() => setConfirmationId(null)}>
                              Voltar
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <Button type="button" variant="outline" disabled={cancelReservationMutation.isPending} onClick={() => setConfirmationId(reservation.id)}>
                          Liberar presente
                        </Button>
                      )}
                    </div>
                  ) : null}
                </div>
              </Card>
            )
          })}
        </div>
      )}
    </section>
  )
}
