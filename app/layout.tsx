import type React from "react"
import { Inter } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/components/ui/toaster"
import { Providers } from '../utils/providers'
import { ThemeToggle } from "@/components/ThemeToggle"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Professional Portfolio",
  description: "A professional portfolio website with admin panel",
  generator: 'Manish sonawane'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <ThemeToggle />
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  )
}