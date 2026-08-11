"use client"

import { Plus } from "lucide-react"
import { useMemo, useState } from "react"

import { AdminGiftForm } from "@/components/features/admin/AdminGiftForm"
import { AdminReservationsPanel } from "@/components/features/admin/AdminReservationsPanel"
import { AdminLogoutButton } from "@/components/features/admin/AdminLogoutButton"
import { Badge } from "@/components/ui/Badge"
import { Button } from "@/components/ui/Button"
import { Card } from "@/components/ui/Card"
import { Skeleton } from "@/components/ui/Skeleton"
import {
  useAdminGifts,
  useCreateAdminGift,
  useDeleteAdminGift,
  useUpdateAdminGift,
} from "@/hooks/useAdminGifts"
import { useCategories } from "@/hooks/useCategories"
import { cn } from "@/lib/utils"
import type { AdminGiftRequest } from "@/schemas/admin-gift.schema"
import type { Category } from "@/types/category"
import type { Gift } from "@/types/gift"

const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
})

const EMPTY_GIFTS: Gift[] = []
const EMPTY_CATEGORIES: Category[] = []

type KindFilter = "all" | "normal" | "crazy"
type StatusFilter = "all" | "available" | "reserved"

function getErrorMessage(error: unknown): string {
  return error instanceof Error
    ? error.message
    : "Não foi possível concluir a operação."
}

export function AdminGiftsPanel() {
  const giftsQuery = useAdminGifts()
  const categoriesQuery = useCategories()
  const createGiftMutation = useCreateAdminGift()
  const updateGiftMutation = useUpdateAdminGift()
  const deleteGiftMutation = useDeleteAdminGift()
  const [kindFilter, setKindFilter] = useState<KindFilter>("all")
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [editingGift, setEditingGift] = useState<Gift | null | undefined>(undefined)
  const [operationError, setOperationError] = useState<string | null>(null)

  const gifts = giftsQuery.data ?? EMPTY_GIFTS
  const categories = categoriesQuery.data ?? EMPTY_CATEGORIES
  const filteredGifts = useMemo(
    () =>
      gifts.filter(
        (gift) =>
          (kindFilter === "all" || gift.kind === kindFilter) &&
          (statusFilter === "all" || gift.status === statusFilter) &&
          (categoryFilter === "all" || gift.category_id === categoryFilter),
      ),
    [categoryFilter, gifts, kindFilter, statusFilter],
  )
  const nextDisplayOrder = Math.max(0, ...gifts.map((gift) => gift.display_order)) + 1
  const isLoading = giftsQuery.isLoading || categoriesQuery.isLoading
  const hasError = giftsQuery.isError || categoriesQuery.isError

  async function saveGift(data: AdminGiftRequest) {
    setOperationError(null)

    try {
      if (editingGift) {
        await updateGiftMutation.mutateAsync({ id: editingGift.id, data })
      } else {
        await createGiftMutation.mutateAsync(data)
      }

      setEditingGift(undefined)
    } catch (error) {
      throw error
    }
  }

  async function deleteGift(gift: Gift) {
    if (!window.confirm(`Tem certeza que deseja excluir “${gift.name}”?`)) {
      return
    }

    setOperationError(null)

    try {
      await deleteGiftMutation.mutateAsync(gift.id)
      if (editingGift?.id === gift.id) {
        setEditingGift(undefined)
      }
    } catch (error) {
      setOperationError(getErrorMessage(error))
    }
  }

  return (
    <main className="min-h-screen bg-[#F5FAFD] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.14em] text-[#1682C0]">
              CasaNova-Lista
            </p>
            <h1 className="mt-2 font-serif text-3xl font-semibold text-[#263748]">
              Administração
            </h1>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button type="button" onClick={() => setEditingGift(null)}>
              <Plus aria-hidden="true" />
              Novo presente
            </Button>
            <AdminLogoutButton />
          </div>
        </div>

        {editingGift !== undefined ? (
          <section className="mt-8" aria-label="Formulário de presente">
            <AdminGiftForm
              key={editingGift?.id ?? "new-gift"}
              categories={categories}
              gift={editingGift}
              nextDisplayOrder={nextDisplayOrder}
              onCancel={() => setEditingGift(undefined)}
              onSubmit={saveGift}
            />
          </section>
        ) : null}

        <section className="mt-8" aria-labelledby="admin-gifts-title">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 id="admin-gifts-title" className="font-serif text-2xl font-semibold text-[#263748]">
              {gifts.length} presentes
            </h2>
            <div className="flex flex-wrap gap-2">
              <select
                aria-label="Filtrar por tipo"
                value={kindFilter}
                onChange={(event) => setKindFilter(event.target.value as KindFilter)}
                className="h-10 rounded-md border border-[#B9D7E7] bg-white px-3 text-sm text-[#263748] outline-none focus-visible:ring-2 focus-visible:ring-[#1682C0]/30"
              >
                <option value="all">Todos os tipos</option>
                <option value="normal">Normal</option>
                <option value="crazy">Maluco</option>
              </select>
              <select
                aria-label="Filtrar por status"
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value as StatusFilter)}
                className="h-10 rounded-md border border-[#B9D7E7] bg-white px-3 text-sm text-[#263748] outline-none focus-visible:ring-2 focus-visible:ring-[#1682C0]/30"
              >
                <option value="all">Todos os status</option>
                <option value="available">Disponível</option>
                <option value="reserved">Reservado</option>
              </select>
              <select
                aria-label="Filtrar por categoria"
                value={categoryFilter}
                onChange={(event) => setCategoryFilter(event.target.value)}
                className="h-10 rounded-md border border-[#B9D7E7] bg-white px-3 text-sm text-[#263748] outline-none focus-visible:ring-2 focus-visible:ring-[#1682C0]/30"
              >
                <option value="all">Todas as categorias</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {operationError ? (
            <p role="alert" className="mt-4 text-sm text-[#B91C1C]">
              {operationError}
            </p>
          ) : null}

          {hasError ? (
            <Card className="mt-6 p-6 text-center">
              <p className="text-[#263748]">Não foi possível carregar os presentes.</p>
              <Button
                type="button"
                loading={giftsQuery.isFetching || categoriesQuery.isFetching}
                onClick={() => {
                  void Promise.all([giftsQuery.refetch(), categoriesQuery.refetch()])
                }}
                className="mt-4"
              >
                Tentar novamente
              </Button>
            </Card>
          ) : isLoading ? (
            <div className="mt-6 grid gap-4">
              {[1, 2, 3].map((item) => (
                <Skeleton key={item} className="h-36 w-full" />
              ))}
            </div>
          ) : filteredGifts.length === 0 ? (
            <Card className="mt-6 p-6 text-center text-[#627489]">
              Nenhum presente encontrado para os filtros selecionados.
            </Card>
          ) : (
            <div className="mt-6 grid gap-4">
              {filteredGifts.map((gift) => {
                const categoryName = categories.find((category) => category.id === gift.category_id)?.name
                const isAvailable = gift.status === "available"

                return (
                  <Card
                    key={gift.id}
                    className={cn("p-5", !isAvailable && "bg-[#F8FAFC]")}
                  >
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div className="min-w-0">
                        <h3 className="font-serif text-xl font-semibold text-[#263748]">
                          {gift.name}
                        </h3>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {categoryName ? <Badge variant="outline">{categoryName}</Badge> : null}
                          <Badge variant="outline">{gift.kind === "normal" ? "Normal" : "Maluco"}</Badge>
                          <Badge variant={isAvailable ? "success" : "danger"}>
                            {isAvailable ? "Disponível" : "Reservado"}
                          </Badge>
                        </div>
                        <p className="mt-3 text-sm text-[#627489]">
                          {gift.estimated_price === null
                            ? "Valor livre"
                            : currencyFormatter.format(gift.estimated_price)}
                          <span className="ml-3">Ordem: {gift.display_order}</span>
                        </p>
                      </div>
                      <div className="flex shrink-0 gap-2">
                        <Button type="button" variant="outline" onClick={() => setEditingGift(gift)}>
                          Editar
                        </Button>
                        <Button
                          type="button"
                          variant="destructive"
                          loading={deleteGiftMutation.isPending && deleteGiftMutation.variables === gift.id}
                          disabled={deleteGiftMutation.isPending}
                          onClick={() => {
                            void deleteGift(gift)
                          }}
                        >
                          Excluir
                        </Button>
                      </div>
                    </div>
                  </Card>
                )
              })}
            </div>
          )}
        </section>

        <AdminReservationsPanel />
      </div>
    </main>
  )
}
