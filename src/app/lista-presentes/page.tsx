"use client"

import { Flower2 } from "lucide-react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { Suspense, useMemo } from "react"

import { GiftGrid } from "@/components/features/gifts/GiftGrid"
import { Container } from "@/components/layout/Container"
import { Header } from "@/components/layout/Header"
import { Button } from "@/components/ui/Button"
import { Card } from "@/components/ui/Card"
import { Skeleton } from "@/components/ui/Skeleton"
import { useCategories } from "@/hooks/useCategories"
import { useGifts } from "@/hooks/useGifts"
import { cn } from "@/lib/utils"
import type { Category } from "@/types/category"
import type { Gift } from "@/types/gift"

const EMPTY_CATEGORIES: Category[] = []
const EMPTY_GIFTS: Gift[] = []

export default function GiftListPage() {
  return (
    <Suspense
      fallback={
        <>
          <Header />
          <main
            aria-busy="true"
            className="min-h-[calc(100vh-68px)] bg-[#F5FAFD] lg:min-h-[calc(100vh-64px)]"
          />
        </>
      }
    >
      <GiftListPageContent />
    </Suspense>
  )
}

function createCategorySlug(categoryName: string): string {
  return categoryName
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/\s+/g, "-")
}

function isPixGift(gift: Gift): boolean {
  return gift.kind === "normal" && gift.category_id === null
}

function GiftListPageContent() {
  const pathname = usePathname()
  const router = useRouter()
  const searchParams = useSearchParams()
  const categoriesQuery = useCategories()
  const giftsQuery = useGifts()

  const categories = categoriesQuery.data ?? EMPTY_CATEGORIES
  const gifts = giftsQuery.data ?? EMPTY_GIFTS
  const requestedCategorySlug = searchParams.get("categoria")
  const isLoading = categoriesQuery.isLoading || giftsQuery.isLoading
  const hasError = categoriesQuery.isError || giftsQuery.isError
  const isRefetching = categoriesQuery.isFetching || giftsQuery.isFetching

  const {
    availableGiftCount,
    filteredGifts,
    selectedCategoryId,
    selectedCategorySlug,
  } = useMemo(
    () => {
      const selectedCategory = requestedCategorySlug
        ? categories.find(
            (category) =>
              createCategorySlug(category.name) === requestedCategorySlug,
          )
        : undefined
      const categoryGifts = gifts.filter(
        (gift) =>
          gift.kind === "normal" &&
          (!selectedCategory ||
            isPixGift(gift) ||
            gift.category_id === selectedCategory.id),
      )
      const pixGift = categoryGifts.find(isPixGift)
      const giftsByDescendingPrice = categoryGifts
        .filter((gift) => !isPixGift(gift))
        .sort(
          (firstGift, secondGift) =>
            (secondGift.estimated_price ?? Number.NEGATIVE_INFINITY) -
            (firstGift.estimated_price ?? Number.NEGATIVE_INFINITY),
        )
      const visibleGifts = pixGift
        ? [pixGift, ...giftsByDescendingPrice]
        : giftsByDescendingPrice

      return {
        availableGiftCount: visibleGifts.reduce(
          (total, gift) => total + (gift.status === "available" ? 1 : 0),
          0,
        ),
        filteredGifts: visibleGifts,
        selectedCategoryId: selectedCategory?.id ?? null,
        selectedCategorySlug: selectedCategory
          ? createCategorySlug(selectedCategory.name)
          : null,
      }
    },
    [categories, gifts, requestedCategorySlug],
  )

  function updateCategory(categoryName?: string) {
    const nextSearchParams = new URLSearchParams(searchParams.toString())

    if (categoryName) {
      nextSearchParams.set("categoria", createCategorySlug(categoryName))
    } else {
      nextSearchParams.delete("categoria")
    }

    const queryString = nextSearchParams.toString()
    const nextUrl = queryString ? `${pathname}?${queryString}` : pathname

    router.push(nextUrl, { scroll: false })
  }

  return (
    <>
      <Header />
      <main className="min-h-[calc(100vh-68px)] overflow-hidden bg-[#F5FAFD] lg:min-h-[calc(100vh-64px)]">
        <Container className="pb-16 pt-8">
          <section aria-labelledby="gift-list-title">
            <div className="flex items-center gap-2 text-[#1682C0]">
              <Flower2
                aria-hidden="true"
                className="size-4 text-[#B9DCEB]"
              />
              <p className="text-[12px] font-medium uppercase tracking-[0.14em]">
                Chá de Casa Nova
              </p>
            </div>

            <h1
              id="gift-list-title"
              className="mt-4 font-serif text-[32px] font-semibold leading-none text-[#263748] lg:text-[40px]"
            >
              Lista de Presentes
            </h1>

            <p className="mt-3 max-w-[570px] text-[15px] leading-6 text-[#627489]">
              Escolha um presente especial para Nikson & Letícia. Cada item pode
              ser reservado por apenas um convidado — garanta o seu!
            </p>

            <div className="mt-2 min-h-5 text-[13px] font-medium text-[#1682C0]">
              {isLoading ? (
                <Skeleton className="h-4 w-40 bg-[#D9E8F0]" />
              ) : (
                <p>
                  {availableGiftCount} de {filteredGifts.length} presentes
                  disponíveis
                </p>
              )}
            </div>
          </section>

          {hasError ? (
            <Card className="mx-auto mt-10 max-w-xl p-6 text-center">
              <p className="text-[#263748]">
                Tivemos um problema ao carregar os presentes.
              </p>
              <Button
                type="button"
                loading={isRefetching}
                onClick={() => {
                  void Promise.all([
                    categoriesQuery.refetch(),
                    giftsQuery.refetch(),
                  ])
                }}
                className="mt-5"
              >
                Tentar novamente
              </Button>
            </Card>
          ) : (
            <>
              <section
                aria-label="Categorias de presentes"
                className="mt-8 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:mt-10"
              >
                <div className="flex w-max gap-2">
                  <Button
                    type="button"
                    variant={selectedCategoryId === null ? "default" : "outline"}
                    aria-pressed={selectedCategoryId === null}
                    onClick={() => updateCategory()}
                    className={cn(
                      "h-10 rounded-[4px] px-4 text-sm",
                      selectedCategoryId === null
                        ? "bg-[#2D89BD] hover:bg-[#2D89BD]/90"
                        : "border-[#B9D7E7] bg-transparent text-[#5B6D80] hover:bg-white hover:text-[#263748]",
                    )}
                  >
                    Todas
                  </Button>

                  {categories.map((category) => {
                    const isActive = selectedCategoryId === category.id

                    return (
                      <Button
                        key={category.id}
                        type="button"
                        variant={isActive ? "default" : "outline"}
                        aria-pressed={isActive}
                        onClick={() => updateCategory(category.name)}
                        className={cn(
                          "h-10 rounded-[4px] px-4 text-sm",
                          isActive
                            ? "bg-[#2D89BD] hover:bg-[#2D89BD]/90"
                            : "border-[#B9D7E7] bg-transparent text-[#5B6D80] hover:bg-white hover:text-[#263748]",
                        )}
                      >
                        {category.name}
                      </Button>
                    )
                  })}
                </div>
              </section>

              <section aria-label="Presentes" className="mt-9">
                {!isLoading && filteredGifts.length === 0 ? (
                  <Card className="p-8 text-center text-[#5B6D80]">
                    Nenhum presente encontrado nesta categoria.
                  </Card>
                ) : (
                  <GiftGrid
                    categories={categories}
                    gifts={filteredGifts}
                    categorySlug={selectedCategorySlug}
                    loading={isLoading}
                  />
                )}
              </section>
            </>
          )}
        </Container>
      </main>
    </>
  )
}
