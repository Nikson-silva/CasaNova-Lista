"use client"

import { ArrowLeft, ExternalLink, Flower2, Gift as GiftIcon } from "lucide-react"
import Link from "next/link"

import { GiftConfirmationForm } from "@/components/features/gifts/GiftConfirmationForm"
import { Container } from "@/components/layout/Container"
import { Badge } from "@/components/ui/Badge"
import { buttonVariants } from "@/components/ui/Button"
import { Button } from "@/components/ui/Button"
import { Card } from "@/components/ui/Card"
import { GiftDetailsSkeleton } from "@/components/features/gifts/GiftDetailsSkeleton"
import { useCategories } from "@/hooks/useCategories"
import { useGift } from "@/hooks/useGift"
import { getPublicImageUrl } from "@/lib/supabase/storage"
import { cn } from "@/lib/utils"
import type { Gift } from "@/types/gift"

const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
})

type GiftDetailsProps = {
  giftId: string
  categorySlug?: string
}

function createBackHref(categorySlug?: string): string {
  if (!categorySlug) {
    return "/lista-presentes"
  }

  const searchParams = new URLSearchParams({ categoria: categorySlug })

  return `/lista-presentes?${searchParams.toString()}`
}

function isGiftNotFound(error: unknown): boolean {
  return (
    error instanceof Error &&
    (error.message === "Presente não encontrado." ||
      error.message === "Identificador do presente inválido.")
  )
}

function GiftImage({ gift }: { gift: Gift }) {
  const imageUrl = gift.image_path
    ? getPublicImageUrl(gift.image_path)
    : null

  return (
    <div className="aspect-4/3 overflow-hidden border border-[#B9DCEB] bg-[#E5F3FA]">
      {imageUrl ? (
        // A URL externa já é pública e não utiliza o otimizador do Next.js.
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={imageUrl}
          alt={gift.name}
          className="size-full bg-white object-contain"
        />
      ) : (
        <div className="flex size-full items-center justify-center">
          <GiftIcon
            aria-hidden="true"
            className="size-16 text-[#2D89BD]"
            strokeWidth={1.6}
          />
        </div>
      )}
    </div>
  )
}

function DetailsDivider() {
  return (
    <div aria-hidden="true" className="flex items-center gap-4">
      <span className="h-px flex-1 bg-[#C9DFEA]" />
      <span className="inline-flex items-center gap-1 text-[#A8D3E6]">
        <span className="size-1 rounded-full bg-[#A8D3E6]" />
        <Flower2 className="size-6" />
        <span className="size-1 rounded-full bg-[#A8D3E6]" />
      </span>
      <span className="h-px flex-1 bg-[#C9DFEA]" />
    </div>
  )
}

function ReservedGiftNotice() {
  return (
    <Card
      role="status"
      className="rounded-none border-[#F1C6C6] bg-[#FFF8F8] p-6 shadow-[0_1px_5px_rgba(38,55,72,0.05)] lg:p-8"
    >
      <div className="flex items-center gap-2 text-[#9F1D1D]">
        <GiftIcon aria-hidden="true" className="size-5" />
        <h2 className="font-serif text-xl font-semibold">
          Presente já reservado
        </h2>
      </div>
      <p className="mt-2 text-sm leading-6 text-[#7C4A4A]">
        Este presente já foi escolhido por outro convidado.
      </p>
    </Card>
  )
}

export function GiftDetails({ categorySlug, giftId }: GiftDetailsProps) {
  const backHref = createBackHref(categorySlug)
  const giftQuery = useGift(giftId)
  const categoriesQuery = useCategories()

  if (giftQuery.isLoading || categoriesQuery.isLoading) {
    return <GiftDetailsSkeleton />
  }

  if (isGiftNotFound(giftQuery.error)) {
    return (
      <Container className="px-4 py-16 text-center sm:px-6 lg:px-8">
        <Card className="mx-auto max-w-lg p-8">
          <h1 className="font-serif text-3xl font-semibold text-[#263748]">
            Presente não encontrado.
          </h1>
          <Link
            href={backHref}
            className={cn(buttonVariants({ variant: "outline" }), "mt-6")}
          >
            Voltar para Lista de Presentes
          </Link>
        </Card>
      </Container>
    )
  }

  if (giftQuery.isError || categoriesQuery.isError || !giftQuery.data) {
    return (
      <Container className="px-4 py-16 text-center sm:px-6 lg:px-8">
        <Card className="mx-auto max-w-lg p-8">
          <h1 className="font-serif text-3xl font-semibold text-[#263748]">
            Não foi possível carregar o presente.
          </h1>
          <Button
            type="button"
            loading={giftQuery.isFetching || categoriesQuery.isFetching}
            onClick={() => {
              void Promise.all([giftQuery.refetch(), categoriesQuery.refetch()])
            }}
            className="mt-6"
          >
            Tentar novamente
          </Button>
        </Card>
      </Container>
    )
  }

  const gift = giftQuery.data
  const categoryName =
    categoriesQuery.data?.find((category) => category.id === gift.category_id)
      ?.name ?? ""
  const isAvailable = gift.status === "available"
  const statusLabel = isAvailable ? "Disponível" : "Reservado"

  return (
    <Container className="px-4 pb-16 pt-8 sm:px-6 lg:px-8">
      <nav
        aria-label="Breadcrumb"
        className="flex min-w-0 items-center gap-3 text-sm"
      >
        <Link
          href={backHref}
          className="inline-flex shrink-0 items-center gap-2 rounded-sm text-[#1682C0] outline-none focus-visible:ring-2 focus-visible:ring-[#1682C0]/30"
        >
          <ArrowLeft aria-hidden="true" className="size-4" />
          Lista de Presentes
        </Link>
        <span aria-hidden="true" className="shrink-0 text-[#B7C5D0]">
          /
        </span>
        <span className="min-w-0 flex-1 truncate text-[#627489]">
          {gift.name}
        </span>
      </nav>

      <div className="mt-4 grid gap-8 lg:grid-cols-2 lg:gap-12">
        <GiftImage gift={gift} />

        <div className="space-y-6">
          <Card
            className={cn(
              "rounded-none border-[#C6DDEA] p-6 shadow-none lg:p-8",
              !isAvailable && "bg-[#F8FAFC]",
            )}
          >
            <div className="flex flex-wrap items-center gap-3">
              {categoryName ? (
                <Badge
                  variant="outline"
                  className="rounded-[3px] border-[#B9D7E7] bg-[#EAF5FA] px-2.5 py-1 text-[12px] font-normal text-[#1682C0]"
                >
                  {categoryName}
                </Badge>
              ) : null}
              <Badge
                variant={isAvailable ? "success" : "danger"}
                aria-label={`Status: ${statusLabel}`}
                className={cn(
                  "gap-1 rounded-none bg-transparent p-0 text-[12px] font-medium",
                  isAvailable ? "text-[#18B84E]" : "text-[#DC2626]",
                )}
              >
                <span
                  aria-hidden="true"
                  className={cn(
                    "size-1.5 rounded-full",
                    isAvailable ? "bg-[#18B84E]" : "bg-[#DC2626]",
                  )}
                />
                {statusLabel}
              </Badge>
            </div>

            <h1 className="mt-5 font-serif text-[30px] font-semibold leading-none text-[#263748] lg:text-[34px]">
              {gift.name}
            </h1>

            {gift.estimated_price !== null ? (
              <p className="mt-3">
                <span className="font-serif text-[24px] font-semibold text-[#1682C0]">
                  {currencyFormatter.format(gift.estimated_price)}
                </span>{" "}
                <span className="text-sm text-[#627489]">aprox.</span>
              </p>
            ) : (
              <p className="mt-3 font-serif text-[24px] font-semibold text-[#1682C0]">
                Valor livre
              </p>
            )}

            <div className="mt-7">
              <DetailsDivider />
            </div>

            <p className="mt-7 text-[15px] leading-6 text-[#627489]">
              {gift.description ?? ""}
            </p>

            {gift.recommendation_url ? (
              <a
                href={gift.recommendation_url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Ver produto recomendado para ${gift.name} em uma nova aba`}
                className={cn(
                  buttonVariants(),
                  "mt-6 w-full rounded-[4px] bg-[#2D89BD] text-white hover:bg-[#2478A7] sm:w-auto",
                )}
              >
                Ver produto recomendado
                <ExternalLink aria-hidden="true" className="size-4" />
              </a>
            ) : null}
          </Card>

          {isAvailable ? (
            <GiftConfirmationForm key={gift.id} gift={gift} />
          ) : (
            <ReservedGiftNotice />
          )}
        </div>
      </div>
    </Container>
  )
}
