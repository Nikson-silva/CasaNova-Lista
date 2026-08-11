import type { Metadata } from "next"
import { Inter } from "next/font/google"
import type { ReactNode } from "react"

import { AppProvider } from "@/components/providers/app-provider"
import { APP_DESCRIPTION, APP_NAME } from "@/constants/app"

import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: APP_NAME,
  description: APP_DESCRIPTION,
icons: {
    icon: "/favicon.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode
}>) {
  return (
    <html lang="pt-BR" className={inter.className}>
      <body>
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  )
}
