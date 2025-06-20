'use client'

import { motion } from 'framer-motion'
import { ArrowDown, Zap, Shield, Gauge, Globe } from 'lucide-react'

export function Hero() {
  const features = [
    { icon: Zap, label: 'Lightning Fast' },
    { icon: Shield, label: 'Secure API' },
    { icon: Gauge, label: 'Real-time' },
    { icon: Globe, label: 'Global CDN' },
  ]

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-pinterest-50 via-secondary-50 to-primary-50 py-20 md:py-32">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-32 w-80 h-80 bg-pinterest-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse-soft" />
        <div className="absolute -bottom-40 -left-32 w-80 h-80 bg-primary-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse-soft" />
      </div>

      <div className="relative container mx-auto px-4">
        <div className="text-center max-w-4xl mx-auto">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm border border-pinterest-200 text-pinterest-700 text-sm font-medium mb-8"
          >
            <Zap className="w-4 h-4 mr-2" />
            Pinterest Scraper API v4.0 - Now Available
          </motion.div>

          {/* Main Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl md:text-6xl lg:text-7xl font-bold text-secondary-900 mb-6"
          >
            Next-Gen
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-pinterest-600 to-primary-600">
              Pinterest Scraper
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl md:text-2xl text-secondary-600 mb-12 max-w-3xl mx-auto leading-relaxed"
          >
            Advanced Pinterest scraping API with real-time capabilities, modern UI, 
            and enterprise-grade performance. Built with Next.js, Playwright, and TypeScript.
          </motion.p>

          {/* Features */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-wrap justify-center gap-6 mb-12"
          >
            {features.map((feature, index) => (
              <div key={index} className="flex items-center space-x-2 text-secondary-700">
                <feature.icon className="w-5 h-5 text-pinterest-600" />
                <span className="font-medium">{feature.label}</span>
              </div>
            ))}
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16"
          >
            <button
              onClick={() => document.getElementById('scraper')?.scrollIntoView({ behavior: 'smooth' })}
              className="btn-pinterest px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
            >
              Try Scraper Now
            </button>
            <button
              onClick={() => document.getElementById('api-docs')?.scrollIntoView({ behavior: 'smooth' })}
              className="btn-secondary px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
            >
              View API Docs
            </button>
          </motion.div>

          {/* Scroll Indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex justify-center"
          >
            <button
              onClick={() => document.getElementById('scraper')?.scrollIntoView({ behavior: 'smooth' })}
              className="text-secondary-600 hover:text-pinterest-600 transition-colors duration-200"
            >
              <ArrowDown className="w-6 h-6 animate-bounce" />
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  )
}