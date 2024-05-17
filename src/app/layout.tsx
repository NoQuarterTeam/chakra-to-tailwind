import type { Metadata } from "next"
import { Roboto_Mono as FontSans } from "next/font/google"
import "./globals.css"
import { Toaster } from "sonner"

const fontSans = FontSans({ subsets: ["latin"], variable: "--font-sans" })

export const metadata: Metadata = {
  title: "Chakra to Tailwind",
  description: "Convert chakra to tailwind",
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={fontSans.className}>
        {children}
        <Toaster />
      </body>
    </html>
  )
}
