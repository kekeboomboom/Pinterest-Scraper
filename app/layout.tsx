import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/providers'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Toaster } from '@/components/ui/toaster'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Pinterest Scraper API v4.0',
  description: 'Next-Gen Pinterest Scraper API - Full-stack application with real-time scraping, caching, and modern UI',
  keywords: 'pinterest, scraper, api, nextjs, react, typescript, real-time',
  authors: [{ name: 'Bes-js', url: 'https://github.com/Bes-js' }],
  openGraph: {
    title: 'Pinterest Scraper API v4.0',
    description: 'Next-Gen Pinterest Scraper with modern UI and real-time capabilities',
    type: 'website',
    url: 'https://github.com/kekeboomboom/Pinterest-Scraper',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Pinterest Scraper API v4.0',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pinterest Scraper API v4.0',
    description: 'Next-Gen Pinterest Scraper with modern UI and real-time capabilities',
    images: ['/og-image.png'],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} h-full bg-gradient-to-br from-secondary-50 to-primary-50`}>
        <Providers>
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1">
              {children}
            </main>
            <Footer />
          </div>
          <Toaster />
        </Providers>
      </body>
    </html>
  )
}