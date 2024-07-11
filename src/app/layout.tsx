import type { Metadata } from "next"
import { ThemeProvider } from "next-themes"
import { Roboto_Mono as FontSans } from "next/font/google"
import "./globals.css"
import { Analytics } from "@vercel/analytics/react"
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
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {children}
          <Toaster />
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
