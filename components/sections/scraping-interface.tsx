'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, Settings, Download, Loader2, AlertCircle } from 'lucide-react'
import { ImageQuality, type ScrapingResult } from '@/types/pinterest'
import { useWebSocket } from '@/components/providers'

interface ScrapingInterfaceProps {
  onScrapingStart: () => void
  onScrapingComplete: (data: ScrapingResult) => void
  onScrapingError: () => void
  isLoading: boolean
}

export function ScrapingInterface({ 
  onScrapingStart, 
  onScrapingComplete, 
  onScrapingError, 
  isLoading 
}: ScrapingInterfaceProps) {
  const [category, setCategory] = useState('')
  const [imageCount, setImageCount] = useState(20)
  const [quality, setQuality] = useState<ImageQuality>(ImageQuality.MEDIUM)
  const [showAdvanced, setShowAdvanced] = useState(false)
  const { isConnected } = useWebSocket()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!category.trim()) {
      return
    }

    onScrapingStart()

    try {
      const response = await fetch('/api/scrape', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          category: category.trim(),
          imageCount,
          quality,
        }),
      })

      const data = await response.json()

      if (data.success) {
        onScrapingComplete(data.data)
      } else {
        onScrapingError()
      }
    } catch (error) {
      onScrapingError()
    }
  }

  const popularCategories = [
    'nature', 'food', 'travel', 'fashion', 'art', 'photography',
    'interior design', 'wedding', 'diy', 'beauty', 'fitness', 'pets'
  ]

  return (
    <section className="py-16">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-secondary-900 mb-4">
            Pinterest Image Scraper
          </h2>
          <p className="text-xl text-secondary-600 max-w-2xl mx-auto">
            Extract high-quality images from Pinterest with advanced filtering and real-time progress tracking.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="bg-white rounded-2xl shadow-xl border border-secondary-200 p-8"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Category Input */}
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Search Category
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-secondary-400" />
                <input
                  type="text"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="e.g., nature, food, travel..."
                  className="w-full pl-10 pr-4 py-3 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-pinterest-500 focus:border-transparent outline-none transition-all duration-200"
                  required
                />
              </div>
            </div>

            {/* Popular Categories */}
            <div>
              <p className="text-sm font-medium text-secondary-700 mb-3">Popular Categories:</p>
              <div className="flex flex-wrap gap-2">
                {popularCategories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCategory(cat)}
                    className="px-3 py-1 text-sm bg-secondary-100 hover:bg-pinterest-100 text-secondary-700 hover:text-pinterest-700 rounded-full transition-colors duration-200"
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Basic Settings */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Number of Images
                </label>
                <select
                  value={imageCount}
                  onChange={(e) => setImageCount(Number(e.target.value))}
                  className="w-full px-3 py-3 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-pinterest-500 focus:border-transparent outline-none transition-all duration-200"
                >
                  <option value={10}>10 images</option>
                  <option value={20}>20 images</option>
                  <option value={50}>50 images</option>
                  <option value={100}>100 images</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Image Quality
                </label>
                <select
                  value={quality}
                  onChange={(e) => setQuality(e.target.value as ImageQuality)}
                  className="w-full px-3 py-3 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-pinterest-500 focus:border-transparent outline-none transition-all duration-200"
                >
                  <option value={ImageQuality.LOW}>Low (Fast)</option>
                  <option value={ImageQuality.MEDIUM}>Medium (Balanced)</option>
                  <option value={ImageQuality.HIGH}>High (Quality)</option>
                  <option value={ImageQuality.ORIGINAL}>Original (Best)</option>
                </select>
              </div>
            </div>

            {/* Advanced Settings Toggle */}
            <div>
              <button
                type="button"
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="flex items-center space-x-2 text-sm text-secondary-600 hover:text-pinterest-600 transition-colors duration-200"
              >
                <Settings className="w-4 h-4" />
                <span>Advanced Settings</span>
              </button>

              {showAdvanced && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  transition={{ duration: 0.3 }}
                  className="mt-4 p-4 bg-secondary-50 rounded-lg space-y-4"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-secondary-700 mb-2">
                        Download Format
                      </label>
                      <select className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-pinterest-500 focus:border-transparent outline-none">
                        <option value="json">JSON (API Response)</option>
                        <option value="zip">ZIP (Image Archive)</option>
                        <option value="csv">CSV (Metadata)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-secondary-700 mb-2">
                        Rate Limit
                      </label>
                      <select className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-pinterest-500 focus:border-transparent outline-none">
                        <option value="standard">Standard (100/15min)</option>
                        <option value="premium">Premium (500/15min)</option>
                      </select>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Connection Status */}
            {!isConnected && (
              <div className="flex items-center space-x-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <AlertCircle className="w-5 h-5 text-yellow-600" />
                <span className="text-sm text-yellow-700">
                  WebSocket disconnected. Real-time updates unavailable.
                </span>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || !category.trim()}
              className="w-full btn-pinterest py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isLoading ? (
                <div className="flex items-center justify-center space-x-2">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Scraping Images...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center space-x-2">
                  <Download className="w-5 h-5" />
                  <span>Start Scraping</span>
                </div>
              )}
            </button>
          </form>
        </motion.div>
      </div>
    </section>
  )
}