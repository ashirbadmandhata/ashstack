import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { AuthProvider } from "@/contexts/auth-context"
import { Toaster } from "@/components/toaster"
import { SplashScreen } from "@/components/splash-screen" // ✅ Added
import { SpeedInsights } from "@vercel/speed-insights/next"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Ashstack - Premium Digital Assets",
  description: "Discover and purchase high-quality digital assets for your projects.",
  generator: "v0.dev",
  authors: [{ name: "Ashirbad Mandhata", url: "https://ashstack.dev" }],
  keywords: ["Digital Assets", "E-commerce", "Ashstack", "Web Development", "Next.js"],
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "Ashstack - Premium Digital Assets",
    description: "Explore premium digital assets crafted by Ashirbad Mandhata.",
    url: "https://ashstack.dev",
    siteName: "Ashstack",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Ashstack OG Image",
      },
    ],
    type: "website",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.className} bg-gray-950 text-white`}>
        <AuthProvider>
          <SplashScreen /> {/* ✅ Now active */}
          <Navigation />
          <main className="min-h-[calc(100vh-8rem)]">{children}</main>
          <SpeedInsights />
          <Footer />
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  )
}
