"use client"

import Image from "next/image"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"

import { Button } from "@/components/ui/Button"
import { Card } from "@/components/ui/Card"
import { Input } from "@/components/ui/Input"
import { Textarea } from "@/components/ui/Textarea"
import {
  useDeleteAdminGiftImage,
  useUploadAdminGiftImage,
} from "@/hooks/useAdminGiftImages"
import { getPublicImageUrl } from "@/lib/supabase/storage"
import type { AdminGiftRequest } from "@/schemas/admin-gift.schema"
import type { Category } from "@/types/category"
import type { Gift } from "@/types/gift"

type AdminGiftFormValues = {
  name: string
  description: string
  category_id: string
  estimated_price: string
  recommendation_url: string
  status: "available" | "reserved"
  kind: "normal" | "crazy"
  display_order: string
}

type AdminGiftFormProps = {
  categories: Category[]
  gift: Gift | null
  nextDisplayOrder: number
  onCancel: () => void
  onSubmit: (data: AdminGiftRequest) => Promise<void>
}

function getDefaultValues(
  gift: Gift | null,
  nextDisplayOrder: number,
): AdminGiftFormValues {
  return {
    name: gift?.name ?? "",
    description: gift?.description ?? "",
    category_id: gift?.category_id ?? "",
    estimated_price:
      gift?.estimated_price === null || gift === null
        ? ""
        : String(gift.estimated_price),
    recommendation_url: gift?.recommendation_url ?? "",
    status: gift?.status ?? "available",
    kind: gift?.kind ?? "normal",
    display_order: String(gift?.display_order ?? nextDisplayOrder),
  }
}

function getErrorMessage(error: unknown): string {
  return error instanceof Error
    ? error.message
    : "Não foi possível salvar o presente."
}

export function AdminGiftForm({
  categories,
  gift,
  nextDisplayOrder,
  onCancel,
  onSubmit,
}: AdminGiftFormProps) {
  const [submissionError, setSubmissionError] = useState<string | null>(null)
  const [imageError, setImageError] = useState<string | null>(null)
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [selectedImagePreviewUrl, setSelectedImagePreviewUrl] = useState<string | null>(null)
  const [removeCurrentImage, setRemoveCurrentImage] = useState(false)
  const uploadImageMutation = useUploadAdminGiftImage()
  const deleteImageMutation = useDeleteAdminGiftImage()
  const {
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
  } = useForm<AdminGiftFormValues>({
    defaultValues: getDefaultValues(gift, nextDisplayOrder),
  })
  const isPix = gift?.name === "Pix do Indeciso"
  const previewUrl =
    selectedImagePreviewUrl ??
    (!removeCurrentImage && gift?.image_path
      ? getPublicImageUrl(gift.image_path)
      : null)
  const isSaving = isSubmitting || uploadImageMutation.isPending || deleteImageMutation.isPending

  useEffect(() => {
    return () => {
      if (selectedImagePreviewUrl) {
        URL.revokeObjectURL(selectedImagePreviewUrl)
      }
    }
  }, [selectedImagePreviewUrl])

  function clearSelectedImage() {
    setSelectedImage(null)
    setSelectedImagePreviewUrl(null)
  }

  function selectImage(file: File | null) {
    setImageError(null)

    if (!file) {
      clearSelectedImage()
      return
    }

    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      clearSelectedImage()
      setImageError("Imagem inválida. Use JPEG, PNG ou WebP.")
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      clearSelectedImage()
      setImageError("Arquivo muito grande. O limite é 5 MB.")
      return
    }

    clearSelectedImage()
    setSelectedImage(file)
    setSelectedImagePreviewUrl(URL.createObjectURL(file))
    setRemoveCurrentImage(false)
  }

  async function submit(values: AdminGiftFormValues) {
    setSubmissionError(null)
    setImageError(null)

    const estimatedPrice = values.estimated_price.trim()
    const displayOrder = Number(values.display_order)
    const previousImagePath = gift?.image_path ?? null
    let uploadedImagePath: string | null = null
    let imagePath = removeCurrentImage ? null : previousImagePath

    try {
      if (selectedImage) {
        const uploadResult = await uploadImageMutation.mutateAsync(selectedImage)
        uploadedImagePath = uploadResult.image_path
        imagePath = uploadedImagePath
      }

      const data: AdminGiftRequest = {
        name: values.name.trim(),
        description: values.description.trim(),
        category_id: values.category_id || null,
        estimated_price: estimatedPrice === "" ? null : Number(estimatedPrice),
        image_path: imagePath,
        recommendation_url: values.recommendation_url.trim() || null,
        status: values.status,
        kind: values.kind,
        display_order: isPix ? 1 : displayOrder,
      }

      await onSubmit(data)

      if (previousImagePath && previousImagePath !== imagePath) {
        try {
          await deleteImageMutation.mutateAsync(previousImagePath)
        } catch (error) {
          setImageError(
            `${getErrorMessage(error)} O presente foi salvo e a imagem anterior foi preservada.`,
          )
        }
      }
    } catch (error) {
      if (uploadedImagePath) {
        try {
          await deleteImageMutation.mutateAsync(uploadedImagePath)
        } catch {
          // The upload may remain orphaned, but no existing object is ever removed here.
        }
      }

      setSubmissionError(getErrorMessage(error))
    }
  }

  return (
    <Card className="p-5 sm:p-6">
      <h2 className="font-serif text-2xl font-semibold text-[#263748]">
        {gift ? "Editar presente" : "Novo presente"}
      </h2>
      <p className="mt-1 text-sm text-[#627489]">
        Selecione uma imagem para enviá-la somente ao salvar o presente.
      </p>

      <form className="mt-5 grid gap-4 sm:grid-cols-2" noValidate onSubmit={handleSubmit(submit)}>
        <fieldset className="sm:col-span-2">
          <legend className="text-sm font-medium text-[#263748]">Imagem</legend>
          <div className="mt-1.5 flex flex-col gap-4 sm:flex-row sm:items-start">
            <div className="flex h-32 w-full max-w-48 items-center justify-center overflow-hidden rounded-md border border-dashed border-[#B9D7E7] bg-[#F5FAFD] sm:w-48">
              {previewUrl ? (
                <Image
                  src={previewUrl}
                  alt={selectedImage ? "Prévia da nova imagem" : `Imagem atual de ${gift?.name ?? "presente"}`}
                  width={192}
                  height={128}
                  unoptimized
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="px-3 text-center text-xs text-[#627489]">Sem imagem selecionada</span>
              )}
            </div>
            <div className="min-w-0 flex-1 space-y-3">
              <Input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                disabled={isSaving}
                aria-describedby="admin-image-help"
                onChange={(event) => selectImage(event.target.files?.[0] ?? null)}
              />
              <p id="admin-image-help" className="text-xs text-[#627489]">
                JPEG, PNG ou WebP, até 5 MB.
              </p>
              {selectedImage ? (
                <Button type="button" variant="outline" size="sm" disabled={isSaving} onClick={clearSelectedImage}>
                  Remover seleção
                </Button>
              ) : gift?.image_path && !removeCurrentImage ? (
                <Button type="button" variant="outline" size="sm" disabled={isSaving} onClick={() => setRemoveCurrentImage(true)}>
                  Remover imagem atual
                </Button>
              ) : removeCurrentImage ? (
                <Button type="button" variant="outline" size="sm" disabled={isSaving} onClick={() => setRemoveCurrentImage(false)}>
                  Manter imagem atual
                </Button>
              ) : null}
            </div>
          </div>
          {imageError ? (
            <p role="alert" className="mt-2 text-sm text-[#B91C1C]">{imageError}</p>
          ) : null}
        </fieldset>

        <label className="sm:col-span-2">
          <span className="text-sm font-medium text-[#263748]">Nome</span>
          <Input
            className="mt-1.5"
            disabled={isSaving}
            aria-invalid={Boolean(errors.name)}
            {...register("name", { required: "Informe o nome." })}
          />
        </label>

        <label className="sm:col-span-2">
          <span className="text-sm font-medium text-[#263748]">Descrição</span>
          <Textarea
            className="mt-1.5 min-h-28"
            disabled={isSaving}
            aria-invalid={Boolean(errors.description)}
            {...register("description", { required: "Informe a descrição." })}
          />
        </label>

        <label>
          <span className="text-sm font-medium text-[#263748]">Categoria</span>
          <select
            className="mt-1.5 flex h-10 w-full rounded-md border border-[#E5E7EB] bg-white px-3 text-sm text-[#000020] outline-none focus-visible:ring-2 focus-visible:ring-[#000020]/20"
            disabled={isSaving}
            {...register("category_id")}
          >
            <option value="">Sem categoria</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>{category.name}</option>
            ))}
          </select>
        </label>

        <label>
          <span className="text-sm font-medium text-[#263748]">Tipo do presente</span>
          <select
            className="mt-1.5 flex h-10 w-full rounded-md border border-[#E5E7EB] bg-white px-3 text-sm text-[#000020] outline-none focus-visible:ring-2 focus-visible:ring-[#000020]/20"
            disabled={isSaving}
            {...register("kind")}
          >
            <option value="normal">Normal</option>
            <option value="crazy">Maluco</option>
          </select>
        </label>

        <label>
          <span className="text-sm font-medium text-[#263748]">Preço</span>
          <Input
            type="number"
            min="0"
            step="0.01"
            inputMode="decimal"
            className="mt-1.5"
            disabled={isSaving}
            aria-invalid={Boolean(errors.estimated_price)}
            {...register("estimated_price", {
              validate: (value) => value === "" || Number(value) >= 0 || "Informe um preço válido.",
            })}
          />
        </label>

        <label>
          <span className="text-sm font-medium text-[#263748]">Status</span>
          <select
            className="mt-1.5 flex h-10 w-full rounded-md border border-[#E5E7EB] bg-white px-3 text-sm text-[#000020] outline-none focus-visible:ring-2 focus-visible:ring-[#000020]/20"
            disabled={isSaving}
            {...register("status")}
          >
            <option value="available">Disponível</option>
            <option value="reserved">Reservado</option>
          </select>
        </label>

        <label className="sm:col-span-2">
          <span className="text-sm font-medium text-[#263748]">Link de recomendação</span>
          <Input
            type="url"
            placeholder="https://..."
            className="mt-1.5"
            disabled={isSaving}
            aria-invalid={Boolean(errors.recommendation_url)}
            {...register("recommendation_url")}
          />
        </label>

        <label>
          <span className="text-sm font-medium text-[#263748]">Display order</span>
          <Input
            type="number"
            min="1"
            step="1"
            inputMode="numeric"
            className="mt-1.5"
            disabled={isSaving || isPix}
            aria-describedby={isPix ? "pix-display-order-help" : undefined}
            aria-invalid={Boolean(errors.display_order)}
            {...register("display_order", {
              validate: (value) => Number.isInteger(Number(value)) && Number(value) > 0 ? true : "Informe um número inteiro maior que zero.",
            })}
          />
          {isPix ? <span id="pix-display-order-help" className="mt-1 block text-xs text-[#627489]">O Pix permanece na posição 1.</span> : null}
        </label>

        {submissionError ? <p role="alert" className="sm:col-span-2 text-sm text-[#B91C1C]">{submissionError}</p> : null}

        <div className="flex flex-wrap gap-3 sm:col-span-2">
          <Button type="submit" loading={isSaving} disabled={isSaving}>Salvar</Button>
          <Button type="button" variant="outline" disabled={isSaving} onClick={onCancel}>Cancelar</Button>
        </div>
      </form>
    </Card>
  )
}
