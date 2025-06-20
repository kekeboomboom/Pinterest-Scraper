import Link from 'next/link'
import { Github, Heart, Zap } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-secondary-900 text-secondary-300">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-pinterest-500 to-pinterest-700 rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Pinterest Scraper</h3>
                <p className="text-xs text-secondary-400">API v4.0</p>
              </div>
            </div>
            <p className="text-sm text-secondary-400 mb-4">
              Next-generation Pinterest scraping API with modern architecture and real-time capabilities.
            </p>
            <div className="flex items-center space-x-2 text-sm">
              <span>Made with</span>
              <Heart className="w-4 h-4 text-red-500" />
              <span>by</span>
              <Link
                href="https://github.com/Bes-js"
                className="text-pinterest-400 hover:text-pinterest-300 transition-colors"
              >
                Bes-js
              </Link>
            </div>
          </div>

          {/* API */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">API</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/api/docs" className="hover:text-white transition-colors">
                  Documentation
                </Link>
              </li>
              <li>
                <Link href="/api/health" className="hover:text-white transition-colors">
                  Health Check
                </Link>
              </li>
              <li>
                <Link href="/api/stats" className="hover:text-white transition-colors">
                  System Stats
                </Link>
              </li>
              <li>
                <Link href="/api/qualities" className="hover:text-white transition-colors">
                  Image Qualities
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Resources</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="#scraper" className="hover:text-white transition-colors">
                  Try Scraper
                </Link>
              </li>
              <li>
                <Link href="#stats" className="hover:text-white transition-colors">
                  Statistics
                </Link>
              </li>
              <li>
                <Link href="#api-docs" className="hover:text-white transition-colors">
                  API Guide
                </Link>
              </li>
              <li>
                <Link
                  href="https://github.com/kekeboomboom/Pinterest-Scraper"
                  className="hover:text-white transition-colors"
                >
                  GitHub Repository
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/license" className="hover:text-white transition-colors">
                  GPL-3.0 License
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <span className="text-secondary-500">
                  Educational Use Only
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-secondary-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <p className="text-sm text-secondary-400">
              © 2024 Pinterest Scraper API v4.0. All rights reserved.
            </p>
            <div className="flex items-center space-x-4 mt-4 md:mt-0">
              <Link
                href="https://github.com/kekeboomboom/Pinterest-Scraper"
                className="text-secondary-400 hover:text-white transition-colors"
              >
                <Github className="w-5 h-5" />
              </Link>
              <div className="text-xs text-secondary-500">
                Built with Next.js, Playwright & TypeScript
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}