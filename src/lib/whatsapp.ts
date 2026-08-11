function getWhatsAppDestination(): string | null {
  const configuredNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER

  if (!configuredNumber) {
    return null
  }

  const digits = configuredNumber.replace(/\D/g, "")

  return digits || null
}

export function createWhatsAppUrl(message: string): string | null {
  const destination = getWhatsAppDestination()

  if (!destination) {
    return null
  }

  const url = new URL(`https://wa.me/${destination}`)
  url.searchParams.set("text", message)

  return url.toString()
}
