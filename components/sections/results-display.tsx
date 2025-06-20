'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { Download, ExternalLink, Eye, X, Clock, CheckCircle, AlertCircle } from 'lucide-react'
import type { ScrapingResult, PinterestImage } from '@/types/pinterest'

interface ResultsDisplayProps {
  results: ScrapingResult | null
  isLoading: boolean
}

export function ResultsDisplay({ results, isLoading }: ResultsDisplayProps) {
  const [selectedImage, setSelectedImage] = useState<PinterestImage | null>(null)
  const [imageLoadErrors, setImageLoadErrors] = useState<Set<string>>(new Set())

  const handleImageError = (imageId: string) => {
    setImageLoadErrors(prev => new Set(prev).add(imageId))
  }

  const handleDownloadAll = () => {
    if (!results) return
    
    const dataStr = JSON.stringify(results, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    
    const link = document.createElement('a')
    link.href = url
    link.download = `pinterest-${results.category}-${results.timestamp}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const handleDownloadImage = (image: PinterestImage) => {
    const link = document.createElement('a')
    link.href = image.url
    link.download = `pinterest-${image.id}.jpg`
    link.target = '_blank'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  if (isLoading) {
    return (
      <section className="py-16">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-secondary-900 mb-4">
              Scraping in Progress...
            </h2>
            <p className="text-lg text-secondary-600 mb-8">
              Please wait while we fetch the images for you.
            </p>
            
            {/* Loading Animation */}
            <div className="flex justify-center mb-8">
              <div className="w-16 h-16 border-4 border-pinterest-200 border-t-pinterest-600 rounded-full animate-spin" />
            </div>
          </motion.div>

          {/* Skeleton Grid */}
          <div className="masonry-grid">
            {Array.from({ length: 12 }).map((_, index) => (
              <div key={index} className="masonry-item">
                <div className={`skeleton rounded-lg ${
                  index % 3 === 0 ? 'h-64' : index % 3 === 1 ? 'h-48' : 'h-56'
                }`} />
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (!results) return null

  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center space-x-2 mb-4">
            {results.success ? (
              <CheckCircle className="w-8 h-8 text-green-600" />
            ) : (
              <AlertCircle className="w-8 h-8 text-red-600" />
            )}
            <h2 className="text-3xl font-bold text-secondary-900">
              Scraping Results
            </h2>
          </div>

          {/* Results Summary */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg p-6 shadow-md border border-secondary-200">
              <h3 className="text-2xl font-bold text-pinterest-600">{results.totalImages}</h3>
              <p className="text-secondary-600">Images Found</p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-md border border-secondary-200">
              <h3 className="text-2xl font-bold text-pinterest-600">{results.category}</h3>
              <p className="text-secondary-600">Category</p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-md border border-secondary-200">
              <h3 className="text-2xl font-bold text-pinterest-600">{results.quality}</h3>
              <p className="text-secondary-600">Quality</p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-md border border-secondary-200">
              <div className="flex items-center justify-center space-x-1">
                <Clock className="w-5 h-5 text-pinterest-600" />
                <h3 className="text-2xl font-bold text-pinterest-600">{results.duration}s</h3>
              </div>
              <p className="text-secondary-600">Duration</p>
            </div>
          </div>

          {/* Download Button */}
          <button
            onClick={handleDownloadAll}
            className="btn-pinterest px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
          >
            <Download className="w-5 h-5 mr-2" />
            Download All Results
          </button>
        </motion.div>

        {/* Images Grid */}
        {results.images.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="masonry-grid"
          >
            {results.images.map((image, index) => (
              <motion.div
                key={image.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="masonry-item group cursor-pointer"
                onClick={() => setSelectedImage(image)}
              >
                <div className="relative bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden">
                  {!imageLoadErrors.has(image.id) ? (
                    <Image
                      src={image.url}
                      alt={image.title}
                      width={image.width}
                      height={image.height}
                      className="w-full h-auto object-cover"
                      onError={() => handleImageError(image.id)}
                    />
                  ) : (
                    <div className="w-full h-48 bg-secondary-100 flex items-center justify-center">
                      <AlertCircle className="w-8 h-8 text-secondary-400" />
                    </div>
                  )}
                  
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <div className="flex space-x-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          setSelectedImage(image)
                        }}
                        className="p-2 bg-white rounded-full shadow-lg hover:bg-secondary-100 transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDownloadImage(image)
                        }}
                        className="p-2 bg-white rounded-full shadow-lg hover:bg-secondary-100 transition-colors"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  
                  {/* Image Info */}
                  <div className="p-4">
                    <h3 className="font-medium text-secondary-900 mb-1 truncate">
                      {image.title}
                    </h3>
                    <p className="text-sm text-secondary-600">
                      {image.width} × {image.height}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Image Preview Modal */}
        <AnimatePresence>
          {selectedImage && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4"
              onClick={() => setSelectedImage(null)}
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="bg-white rounded-lg max-w-4xl max-h-[90vh] overflow-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between p-4 border-b">
                  <h3 className="text-lg font-semibold text-secondary-900">
                    {selectedImage.title}
                  </h3>
                  <button
                    onClick={() => setSelectedImage(null)}
                    className="p-2 hover:bg-secondary-100 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="p-4">
                  <Image
                    src={selectedImage.url}
                    alt={selectedImage.title}
                    width={selectedImage.width}
                    height={selectedImage.height}
                    className="w-full h-auto max-h-96 object-contain rounded-lg"
                  />
                  
                  <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-secondary-700">Dimensions:</span>
                      <span className="ml-2 text-secondary-600">
                        {selectedImage.width} × {selectedImage.height}
                      </span>
                    </div>
                    <div>
                      <span className="font-medium text-secondary-700">Quality:</span>
                      <span className="ml-2 text-secondary-600">{selectedImage.quality}</span>
                    </div>
                  </div>
                  
                  <div className="mt-4 flex space-x-2">
                    <button
                      onClick={() => handleDownloadImage(selectedImage)}
                      className="btn-pinterest px-4 py-2 rounded-lg"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </button>
                    <a
                      href={selectedImage.originalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-secondary px-4 py-2 rounded-lg flex items-center"
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      View Original
                    </a>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}