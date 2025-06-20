'use client'

import { useState } from 'react'
import { Hero } from '@/components/sections/hero'
import { ScrapingInterface } from '@/components/sections/scraping-interface'
import { ResultsDisplay } from '@/components/sections/results-display'
import { StatsSection } from '@/components/sections/stats-section'
import { ApiDocumentation } from '@/components/sections/api-documentation'
import type { ScrapingResult } from '@/types/pinterest'

export default function HomePage() {
  const [results, setResults] = useState<ScrapingResult | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleScrapingStart = () => {
    setIsLoading(true)
    setResults(null)
  }

  const handleScrapingComplete = (data: ScrapingResult) => {
    setResults(data)
    setIsLoading(false)
  }

  const handleScrapingError = () => {
    setIsLoading(false)
    setResults(null)
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <Hero />

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12 space-y-16">
        {/* Scraping Interface */}
        <section id="scraper" className="scroll-mt-16">
          <ScrapingInterface
            onScrapingStart={handleScrapingStart}
            onScrapingComplete={handleScrapingComplete}
            onScrapingError={handleScrapingError}
            isLoading={isLoading}
          />
        </section>

        {/* Results Display */}
        {(results || isLoading) && (
          <section id="results" className="scroll-mt-16">
            <ResultsDisplay
              results={results}
              isLoading={isLoading}
            />
          </section>
        )}

        {/* Stats Section */}
        <section id="stats" className="scroll-mt-16">
          <StatsSection />
        </section>

        {/* API Documentation */}
        <section id="api-docs" className="scroll-mt-16">
          <ApiDocumentation />
        </section>
      </div>
    </div>
  )
}