"use client"

import { useMemo } from "react"

import { CrazyGiftsHero } from "@/components/features/gifts/CrazyGiftsHero"
import { GiftGrid } from "@/components/features/gifts/GiftGrid"
import { Container } from "@/components/layout/Container"
import { Header } from "@/components/layout/Header"
import { Button } from "@/components/ui/Button"
import { Card } from "@/components/ui/Card"
import { useGifts } from "@/hooks/useGifts"
import type { Gift } from "@/types/gift"

const EMPTY_GIFTS: Gift[] = []

export default function CrazyGiftsPage() {
  const giftsQuery = useGifts()
  const gifts = giftsQuery.data ?? EMPTY_GIFTS
  const crazyGifts = useMemo(
    () =>
      gifts
        .filter((gift) => gift.kind === "crazy")
        .sort((firstGift, secondGift) => {
          if (firstGift.estimated_price === null) {
            return secondGift.estimated_price === null ? 0 : 1
          }

          if (secondGift.estimated_price === null) {
            return -1
          }

          return secondGift.estimated_price - firstGift.estimated_price
        }),
    [gifts],
  )

  return (
    <>
      <Header />
      <main className="min-h-[calc(100vh-68px)] bg-[#F5FAFD] lg:min-h-[calc(100vh-64px)]">
        <Container className="pb-16 pt-8">
          <CrazyGiftsHero
            giftCount={crazyGifts.length}
            loading={giftsQuery.isLoading || giftsQuery.isError}
          />

          <section aria-labelledby="crazy-gifts-grid-title" className="mt-10">
            <h2 id="crazy-gifts-grid-title" className="sr-only">
              Presentes especiais disponíveis
            </h2>

            {giftsQuery.isError ? (
              <Card className="mx-auto max-w-xl p-6 text-center">
                <p className="text-[#263748]">
                  Tivemos um problema ao carregar os presentes.
                </p>
                <Button
                  type="button"
                  loading={giftsQuery.isFetching}
                  onClick={() => {
                    void giftsQuery.refetch()
                  }}
                  className="mt-5"
                >
                  Tentar novamente
                </Button>
              </Card>
            ) : !giftsQuery.isLoading && crazyGifts.length === 0 ? (
              <Card className="p-8 text-center text-[#5B6D80]">
                Nenhum presente maluco encontrado.
              </Card>
            ) : (
              <GiftGrid
                ariaLabel="Lista de presentes malucos"
                categories={[]}
                gifts={crazyGifts}
                loading={giftsQuery.isLoading}
                special
                className="grid-cols-1 md:grid-cols-2 lg:grid-cols-3 lg:gap-6"
              />
            )}
          </section>
        </Container>
      </main>
    </>
  )
}
