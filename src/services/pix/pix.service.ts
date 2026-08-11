type GeneratePixPayloadParams = {
    amount: number;
};

type PixPayload = {
    payload: string;
    amount: number;
};

const PIX_KEY = process.env.NEXT_PUBLIC_PIX_KEY;
const PIX_RECEIVER_NAME = process.env.NEXT_PUBLIC_PIX_RECEIVER_NAME;
const PIX_CITY = process.env.NEXT_PUBLIC_PIX_CITY;

function normalizeText(value: string): string {
    return value
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toUpperCase()
        .trim();
}

function formatField(id: string, value: string): string {
    const length = String(value.length).padStart(2, "0");

    return `${id}${length}${value}`;
}

function calculateCRC16(payload: string): string {
    let crc = 0xffff;

    for (let i = 0; i < payload.length; i++) {
        crc ^= payload.charCodeAt(i) << 8;

        for (let bit = 0; bit < 8; bit++) {
            if ((crc & 0x8000) !== 0) {
                crc = (crc << 1) ^ 0x1021;
            } else {
                crc <<= 1;
            }

            crc &= 0xffff;
        }
    }

    return crc.toString(16).toUpperCase().padStart(4, "0");
}

export function generatePixPayload({ amount }: GeneratePixPayloadParams): PixPayload {
    if (!PIX_KEY) {
        throw new Error("NEXT_PUBLIC_PIX_KEY não configurada.");
    }

    if (!PIX_RECEIVER_NAME) {
        throw new Error("NEXT_PUBLIC_PIX_RECEIVER_NAME não configurada.");
    }

    if (!PIX_CITY) {
        throw new Error("NEXT_PUBLIC_PIX_CITY não configurada.");
    }

    if (!Number.isFinite(amount) || amount <= 0) {
        throw new Error("O valor do Pix deve ser maior que zero.");
    }

    const receiverName = normalizeText(PIX_RECEIVER_NAME);
    const city = normalizeText(PIX_CITY);
    const pixKey = PIX_KEY.trim();

    if (receiverName.length > 25) {
        throw new Error("O nome do recebedor deve possuir no máximo 25 caracteres.");
    }

    if (city.length > 15) {
        throw new Error("A cidade deve possuir no máximo 15 caracteres.");
    }

    const formattedAmount = amount.toFixed(2);

    const merchantAccountInformation =
        formatField("00", "BR.GOV.BCB.PIX") + formatField("01", pixKey);

    const additionalDataField = formatField("05", "***");

    const payloadWithoutCRC =
        formatField("00", "01") +
        formatField("26", merchantAccountInformation) +
        formatField("52", "0000") +
        formatField("53", "986") +
        formatField("54", formattedAmount) +
        formatField("58", "BR") +
        formatField("59", receiverName) +
        formatField("60", city) +
        formatField("62", additionalDataField) +
        "6304";

    const crc = calculateCRC16(payloadWithoutCRC);

    return {
        payload: `${payloadWithoutCRC}${crc}`,
        amount,
    };
}
