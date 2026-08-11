"use client";

import { useState } from "react";
import { PixQrCode } from "@/components/pix/PixQrCode";

export default function PixTestPage() {
    const [amount, setAmount] = useState(250);

    return (
        <main
            style={{
                maxWidth: 600,
                margin: "0 auto",
                padding: 40,
            }}
        >
            <h1>Teste Pix</h1>

            <p>Escolha o valor do Pix:</p>

            <input
                type="number"
                min="1"
                step="0.01"
                value={amount}
                onChange={(event) => setAmount(Number(event.target.value))}
                style={{
                    width: "100%",
                    padding: 12,
                    marginBottom: 24,
                }}
            />

            <p>
                Valor atual: <strong>R$ {amount.toFixed(2).replace(".", ",")}</strong>
            </p>

            <PixQrCode amount={amount} />
        </main>
    );
}
