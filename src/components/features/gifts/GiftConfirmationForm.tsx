"use client";

import { GiftPixConfirmation } from "./GiftPixConfirmation";
import { GiftPixPayment } from "./GiftPixPayment";
import { GiftPresentOptions } from "./GiftPresentOptions";
import { Gift as GiftIcon, MessageCircle } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { LoadingButton } from "@/components/ui/LoadingButton";
import { Textarea } from "@/components/ui/Textarea";
import { RESERVATION_CONFLICT_MESSAGE, useReserveGift } from "@/hooks/useReserveGift";
import { createWhatsAppUrl } from "@/lib/whatsapp";
import type { ReservationRequest } from "@/schemas/reservation.schema";
import type { Gift } from "@/types/gift";
import type { ReservationInsert } from "@/types/reservation";

type GiftConfirmationFormProps = {
    gift: Pick<Gift, "id" | "name" | "estimated_price">;
};

type ReservationFormValues = Pick<ReservationRequest, "guest_name" | "message">;

type SubmissionFeedback = {
    kind: "error" | "success";
    message: string;
} | null;

function createDefaultMessage(giftName: string): string {
    return `Confirmo presença em seu chá de casa nova e irei lhes presentear com ${giftName}.`;
}

function getSubmissionErrorMessage(error: unknown): string {
    if (error instanceof Error && error.message === RESERVATION_CONFLICT_MESSAGE) {
        return "Este presente acabou de ser reservado por outra pessoa.";
    }

    if (error instanceof Error && error.message === "Presente não encontrado.") {
        return "Este presente não está mais disponível.";
    }

    return "Não foi possível confirmar o presente. Tente novamente.";
}

export function GiftConfirmationForm({ gift }: GiftConfirmationFormProps) {
    const [presentMethod, setPresentMethod] = useState<"item" | "pix" | null>(null);
    const isFlexiblePixGift = gift.estimated_price === null;
    /**
     * Guarda o valor escolhido pelo convidado
     * para o pagamento via Pix.
     *
     * Enquanto for null, o usuário ainda está
     * na tela de geração do Pix.
     *
     * Quando receber um valor, avançamos para
     * a tela de confirmação do Pix.
     */
    const [pixAmount, setPixAmount] = useState<number | null>(null);

    const reserveGiftMutation = useReserveGift(gift.id);

    const [feedback, setFeedback] = useState<SubmissionFeedback>(null);

    const {
        formState: { errors, isSubmitting },
        handleSubmit,
        register,
    } = useForm<ReservationFormValues>({
        defaultValues: {
            guest_name: "",
            message: createDefaultMessage(gift.name),
        },
    });

    const isSubmittingReservation = isSubmitting || reserveGiftMutation.isPending;

    function handleBackToPresentOptions() {
        setPresentMethod(null);
        setPixAmount(null);
        setFeedback(null);
    }

    async function submitReservation(values: ReservationFormValues) {
        if (isSubmittingReservation) {
            return;
        }

        setFeedback(null);

        const guestName = values.guest_name.trim();

        const message = values.message.trim();

        const payload: ReservationInsert = {
            gift_id: gift.id,
            guest_name: guestName,
            guest_phone: null,
            message,
        };

        try {
            await reserveGiftMutation.mutateAsync(payload);

            const whatsappUrl = createWhatsAppUrl(message);

            if (whatsappUrl) {
                window.open(whatsappUrl, "_blank", "noopener,noreferrer");

                return;
            }

            setFeedback({
                kind: "success",
                message: "Presente confirmado. O destino do WhatsApp ainda não está configurado.",
            });
        } catch (error) {
            setFeedback({
                kind: "error",
                message: getSubmissionErrorMessage(error),
            });
        }
    }

    /*
     * Etapa inicial:
     *
     * O usuário escolhe se deseja:
     *
     * - Presentear com o item
     * - Presentear via Pix
     */
    if (presentMethod === null) {
        return (
            <GiftPresentOptions
                showItemOption={!isFlexiblePixGift}
                onSelectItem={isFlexiblePixGift ? undefined : () => setPresentMethod("item")}
                onSelectPix={() => setPresentMethod("pix")}
            />
        );
    }

    /*
     * Fluxo Pix.
     */
    if (presentMethod === "pix") {
        if (pixAmount !== null) {
            return (
                <GiftPixConfirmation
                    gift={{
                        id: gift.id,
                        name: gift.name,
                    }}
                    amount={pixAmount}
                    isFlexibleAmount={isFlexiblePixGift}
                    onBack={() => {
                        setPixAmount(null);
                    }}
                />
            );
        }

        return (
            <GiftPixPayment
                giftName={gift.name}
                estimatedPrice={gift.estimated_price}
                isFlexibleAmount={isFlexiblePixGift}
                onBack={handleBackToPresentOptions}
                onPaymentConfirmed={(amount) => {
                    setPixAmount(amount);
                }}
            />
        );
    }

    /*
     * Fluxo original de presente físico.
     *
     * Esta parte continua utilizando exatamente
     * a mesma lógica de reserva que já funcionava.
     */
    return (
        <Card className="rounded-none border-[#C6DDEA] p-6 shadow-[0_1px_5px_rgba(38,55,72,0.05)] lg:p-8">
            <button
                type="button"
                onClick={handleBackToPresentOptions}
                className="mb-5 text-sm font-medium text-[#1682C0] transition-colors hover:text-[#126D9F] hover:underline"
            >
                ← Voltar
            </button>

            <div className="flex items-center gap-2 text-[#263748]">
                <GiftIcon aria-hidden="true" className="size-5 text-[#1682C0]" />

                <h2 className="font-serif text-xl font-semibold">Confirmar presente</h2>
            </div>

            <p className="mt-2 text-[13px] leading-5 text-[#627489]">
                Caso queira confirmar o item que deseja nos presentear, envie uma mensagem de
                confirmação.
            </p>

            <div className="mt-5 rounded-lg border border-[#C6DDEA] bg-[#F8FBFD] p-4">
                <p className="text-sm font-semibold text-[#263748]">📦 Endereço para entrega</p>

                <p className="mt-2 text-sm leading-6 text-[#627489]">
                    Caso prefira comprar o presente pela internet, você pode utilizar nosso endereço
                    para a entrega:
                </p>

                <address className="mt-2 not-italic text-sm font-medium leading-6 text-[#263748]">
                    Rua João Tamanduá, nº 274
                    <br />
                    Bairro Três Irmãs
                    <br />
                    CEP: 58423-380
                </address>
            </div>

            <form className="mt-6" noValidate onSubmit={handleSubmit(submitReservation)}>
                <label
                    htmlFor="guest-name"
                    className="text-[12px] font-semibold uppercase text-[#263748]"
                >
                    Nome completo <span className="text-[#DC2626]">*</span>
                </label>

                <Input
                    id="guest-name"
                    type="text"
                    required
                    autoComplete="name"
                    placeholder="Digite seu nome completo"
                    disabled={isSubmittingReservation}
                    aria-invalid={Boolean(errors.guest_name)}
                    aria-describedby={errors.guest_name ? "guest-name-error" : undefined}
                    className="mt-1.5 h-12 rounded-[4px] border-[#B9D7E7] bg-[#F8FBFD] px-4 text-[15px]"
                    {...register("guest_name", {
                        required: "Informe seu nome completo.",
                        validate: (value) =>
                            value.trim().length >= 3 ||
                            "Informe um nome com pelo menos 3 caracteres.",
                        maxLength: {
                            value: 120,
                            message: "O nome deve ter no máximo 120 caracteres.",
                        },
                    })}
                />

                {errors.guest_name ? (
                    <p id="guest-name-error" role="alert" className="mt-1.5 text-sm text-[#B91C1C]">
                        {errors.guest_name.message}
                    </p>
                ) : null}

                <label
                    htmlFor="confirmation-message"
                    className="mt-4 block text-[12px] font-semibold uppercase text-[#263748]"
                >
                    Mensagem de confirmação
                </label>

                <Textarea
                    required
                    id="confirmation-message"
                    disabled={isSubmittingReservation}
                    aria-invalid={Boolean(errors.message)}
                    aria-describedby={
                        errors.message
                            ? "confirmation-message-error confirmation-message-help"
                            : "confirmation-message-help"
                    }
                    className="mt-1.5 min-h-24 rounded-[4px] border-[#B9D7E7] bg-[#F8FBFD] px-4 py-3 text-[15px] leading-6 text-[#263748]"
                    {...register("message", {
                        required: "Escreva uma mensagem de confirmação.",
                        validate: (value) =>
                            value.trim().length >= 5 ||
                            "A mensagem deve ter pelo menos 5 caracteres.",
                        maxLength: {
                            value: 1000,
                            message: "A mensagem deve ter no máximo 1000 caracteres.",
                        },
                    })}
                />

                {errors.message ? (
                    <p
                        id="confirmation-message-error"
                        role="alert"
                        className="mt-1.5 text-sm text-[#B91C1C]"
                    >
                        {errors.message.message}
                    </p>
                ) : null}

                <p id="confirmation-message-help" className="mt-2 text-[13px] text-[#627489]">
                    Você pode editar a mensagem antes de enviar.
                </p>

                {feedback ? (
                    <p
                        role={feedback.kind === "error" ? "alert" : "status"}
                        className={
                            feedback.kind === "error"
                                ? "mt-4 text-sm text-[#B91C1C]"
                                : "mt-4 text-sm text-[#167A3A]"
                        }
                    >
                        {feedback.message}
                    </p>
                ) : null}

                <LoadingButton
                    type="submit"
                    loading={isSubmittingReservation}
                    disabled={isSubmittingReservation}
                    className="mt-5 h-12 w-full rounded-[4px] bg-[#2D89BD] text-white hover:bg-[#2478A7]"
                >
                    <MessageCircle aria-hidden="true" className="size-4" />
                    Enviar mensagem pelo WhatsApp
                </LoadingButton>

                <p className="mt-3 text-center text-[12px] leading-5 text-[#627489]">
                    O WhatsApp será aberto com a mensagem preenchida após a confirmação.
                </p>
            </form>
        </Card>
    );
}
