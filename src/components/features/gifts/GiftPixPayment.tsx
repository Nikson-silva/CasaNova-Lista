"use client";

import { ChangeEvent, useState } from "react";
import { ArrowLeft, QrCode } from "lucide-react";

import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { PixQrCode } from "@/components/pix/PixQrCode";

type GiftPixPaymentProps = {
    giftName: string;
    estimatedPrice: number | null;
    isFlexibleAmount?: boolean;
    onBack: () => void;
    onPaymentConfirmed: (amount: number) => void;
};

function formatCurrency(value: number): string {
    return value.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
    });
}

export function GiftPixPayment({
    giftName,
    estimatedPrice,
    isFlexibleAmount = false,
    onBack,
    onPaymentConfirmed,
}: GiftPixPaymentProps) {
    /**
     * Para presentes normais, começamos com o valor
     * aproximado do presente.
     *
     * Para o Pix do Indeciso, começamos vazio,
     * permitindo que o convidado escolha qualquer valor.
     */
    const [amountInput, setAmountInput] = useState(
        estimatedPrice !== null && !isFlexibleAmount ? estimatedPrice.toFixed(2) : "",
    );

    const [showPix, setShowPix] = useState(false);

    function handleAmountChange(event: ChangeEvent<HTMLInputElement>) {
        setAmountInput(event.target.value);
    }

    function getNumericAmount(): number {
        return Number(amountInput);
    }

    function isAmountValid(value: number): boolean {
        if (!Number.isFinite(value) || value <= 0) {
            return false;
        }

        /**
         * Pix do Indeciso:
         * qualquer valor positivo é permitido.
         */
        if (isFlexibleAmount) {
            return true;
        }

        /**
         * Presente normal:
         * o valor não pode ser menor que o valor
         * aproximado do presente.
         */
        if (estimatedPrice === null) {
            return false;
        }

        return value >= estimatedPrice;
    }

    function handleContinue() {
        const numericValue = getNumericAmount();

        if (!isAmountValid(numericValue)) {
            return;
        }

        setAmountInput(numericValue.toFixed(2));

        setShowPix(true);
    }

    function handlePaymentConfirmed() {
        const numericValue = getNumericAmount();

        if (!isAmountValid(numericValue)) {
            return;
        }

        onPaymentConfirmed(Number(numericValue.toFixed(2)));
    }

    if (showPix) {
        const numericAmount = getNumericAmount();

        return (
            <Card className="rounded-none border-[#C6DDEA] p-6 shadow-[0_1px_5px_rgba(38,55,72,0.05)] lg:p-8">
                <button
                    type="button"
                    onClick={() => setShowPix(false)}
                    className="mb-5 inline-flex items-center gap-1.5 text-sm font-medium text-[#1682C0] transition-colors hover:text-[#126D9F] hover:underline"
                >
                    <ArrowLeft aria-hidden="true" className="size-4" />
                    Alterar valor
                </button>

                <div className="flex items-center gap-2 text-[#263748]">
                    <QrCode aria-hidden="true" className="size-5 text-[#1682C0]" />

                    <h2 className="font-serif text-xl font-semibold">Presentear via Pix</h2>
                </div>

                <p className="mt-2 text-[13px] leading-5 text-[#627489]">
                    Você escolheu presentear com{" "}
                    <strong className="text-[#263748]">{formatCurrency(numericAmount)}</strong>{" "}
                    referente ao presente <strong className="text-[#263748]">{giftName}</strong>.
                </p>

                <div className="mt-6 flex justify-center">
                    <PixQrCode amount={numericAmount} />
                </div>

                <button
                    type="button"
                    onClick={handlePaymentConfirmed}
                    className="mt-6 h-12 w-full rounded-[4px] bg-[#2D89BD] px-4 text-sm font-semibold text-white transition-colors hover:bg-[#2478A7]"
                >
                    Já realizei o Pix
                </button>

                <p className="mt-3 text-center text-[12px] leading-5 text-[#627489]">
                    Após realizar o pagamento, confirme seus dados para finalizar a confirmação do
                    presente.
                </p>
            </Card>
        );
    }

    const numericInputValue = getNumericAmount();

    const isValidAmount = isAmountValid(numericInputValue);

    return (
        <Card className="rounded-none border-[#C6DDEA] p-6 shadow-[0_1px_5px_rgba(38,55,72,0.05)] lg:p-8">
            <button
                type="button"
                onClick={onBack}
                className="mb-5 inline-flex items-center gap-1.5 text-sm font-medium text-[#1682C0] transition-colors hover:text-[#126D9F] hover:underline"
            >
                <ArrowLeft aria-hidden="true" className="size-4" />
                Voltar
            </button>

            <div className="flex items-center gap-2 text-[#263748]">
                <QrCode aria-hidden="true" className="size-5 text-[#1682C0]" />

                <h2 className="font-serif text-xl font-semibold">Presentear via Pix</h2>
            </div>

            {isFlexibleAmount ? (
                <p className="mt-2 text-[13px] leading-5 text-[#627489]">
                    Escolha o valor que deseja presentear. Você pode enviar qualquer quantia.
                </p>
            ) : (
                <p className="mt-2 text-[13px] leading-5 text-[#627489]">
                    O valor aproximado deste presente é{" "}
                    <strong className="text-[#263748]">
                        {estimatedPrice !== null ? formatCurrency(estimatedPrice) : "não definido"}
                    </strong>
                    .
                </p>
            )}

            <div className="mt-6">
                <label
                    htmlFor="pix-amount"
                    className="text-[12px] font-semibold uppercase text-[#263748]"
                >
                    Quanto deseja enviar?
                </label>

                <Input
                    id="pix-amount"
                    type="number"
                    inputMode="decimal"
                    min={isFlexibleAmount ? 0.01 : (estimatedPrice ?? 0.01)}
                    step="0.01"
                    value={amountInput}
                    onChange={handleAmountChange}
                    placeholder="0,00"
                    className="mt-1.5 h-12 rounded-[4px] border-[#B9D7E7] bg-[#F8FBFD] px-4 text-[15px]"
                    aria-describedby="pix-amount-help"
                />

                <p id="pix-amount-help" className="mt-2 text-[13px] leading-5 text-[#627489]">
                    {isFlexibleAmount
                        ? "Digite o valor que deseja enviar."
                        : "Você pode enviar o valor do presente ou uma quantia maior."}
                </p>

                {!isFlexibleAmount &&
                estimatedPrice !== null &&
                Number.isFinite(numericInputValue) &&
                numericInputValue > 0 &&
                numericInputValue < estimatedPrice ? (
                    <p role="alert" className="mt-2 text-sm text-[#B91C1C]">
                        O valor deve ser de pelo menos {formatCurrency(estimatedPrice)}.
                    </p>
                ) : null}

                {isFlexibleAmount &&
                amountInput !== "" &&
                (!Number.isFinite(numericInputValue) || numericInputValue <= 0) ? (
                    <p role="alert" className="mt-2 text-sm text-[#B91C1C]">
                        Informe um valor maior que R$ 0,00.
                    </p>
                ) : null}
            </div>

            <button
                type="button"
                disabled={!isValidAmount}
                onClick={handleContinue}
                className="mt-5 h-12 w-full rounded-[4px] bg-[#2D89BD] px-4 text-sm font-semibold text-white transition-colors hover:bg-[#2478A7] disabled:cursor-not-allowed disabled:opacity-50"
            >
                Gerar Pix
            </button>
        </Card>
    );
}
