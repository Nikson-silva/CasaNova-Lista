"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { generatePixPayload } from "@/services/pix/pix.service";

type PixQrCodeProps = {
    amount: number;
};

export function PixQrCode({ amount }: PixQrCodeProps) {
    const [payload, setPayload] = useState("");
    const [qrCode, setQrCode] = useState("");
    const [copied, setCopied] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        let cancelled = false;

        async function generate() {
            try {
                setError("");
                setCopied(false);

                const pix = generatePixPayload({
                    amount,
                });

                const dataUrl = await QRCode.toDataURL(pix.payload, {
                    width: 280,
                    margin: 2,
                    errorCorrectionLevel: "M",
                    color: {
                        dark: "#243746",
                        light: "#FFFFFF",
                    },
                });

                if (!cancelled) {
                    setPayload(pix.payload);
                    setQrCode(dataUrl);
                }
            } catch (error) {
                console.error("Erro ao gerar Pix:", error);

                if (!cancelled) {
                    setError("Não foi possível gerar o código Pix.");
                }
            }
        }

        generate();

        return () => {
            cancelled = true;
        };
    }, [amount]);

    async function handleCopy() {
        try {
            await navigator.clipboard.writeText(payload);

            setCopied(true);

            setTimeout(() => {
                setCopied(false);
            }, 2000);
        } catch (error) {
            console.error("Erro ao copiar Pix:", error);
        }
    }

    if (error) {
        return (
            <div>
                <p>{error}</p>
            </div>
        );
    }

    return (
        <div>
            <div>
                {qrCode ? (
                    <img
                        src={qrCode}
                        alt={`QR Code Pix no valor de R$ ${amount.toFixed(2).replace(".", ",")}`}
                        width={280}
                        height={280}
                    />
                ) : (
                    <div
                        style={{
                            width: 280,
                            height: 280,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        Gerando QR Code...
                    </div>
                )}
            </div>

            <div style={{ marginTop: 24 }}>
                <p>Pix Copia e Cola</p>

                <textarea
                    value={payload}
                    readOnly
                    rows={4}
                    style={{
                        width: "100%",
                        resize: "none",
                    }}
                    aria-label="Código Pix Copia e Cola"
                />

                <button
                    type="button"
                    onClick={handleCopy}
                    disabled={!payload}
                    style={{
                        marginTop: 12,
                    }}
                >
                    {copied ? "Pix copiado!" : "Copiar código Pix"}
                </button>
            </div>
        </div>
    );
}
