import type React from "react"
import "./globals.css"
import { Inter, Roboto_Mono } from "next/font/google"
import { Providers } from "./providers"
import { Toaster } from "react-hot-toast"

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
})

const robotoMono = Roboto_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-roboto-mono",
})

export const metadata = {
  title: "cPOP Pass - Proof of Participation",
  description: "Mint and claim ZK-compressed Proof-of-Participation NFTs on Solana",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${robotoMono.variable}`}>
      <body className="min-h-screen font-sans">
        <Providers>
          {children}
          <Toaster position="bottom-right" />
        </Providers>
      </body>
    </html>
  )
}
