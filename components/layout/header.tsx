'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, X, Search, Zap, BarChart3, BookOpen } from 'lucide-react'
import { useWebSocket } from '@/components/providers'

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { isConnected } = useWebSocket()

  const navigation = [
    { name: 'Scraper', href: '#scraper', icon: Search },
    { name: 'Stats', href: '#stats', icon: BarChart3 },
    { name: 'API Docs', href: '#api-docs', icon: BookOpen },
  ]

  return (
    <header className="bg-white/80 backdrop-blur-sm border-b border-secondary-200 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-pinterest-500 to-pinterest-700 rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-secondary-900">Pinterest Scraper</h1>
              <p className="text-xs text-secondary-500">API v4.0</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="flex items-center space-x-1 text-secondary-600 hover:text-pinterest-600 transition-colors duration-200"
              >
                <item.icon className="w-4 h-4" />
                <span>{item.name}</span>
              </Link>
            ))}
          </nav>

          {/* Connection Status & Mobile Menu Button */}
          <div className="flex items-center space-x-4">
            {/* Connection Status */}
            <div className="flex items-center space-x-2">
              <div
                className={`w-2 h-2 rounded-full ${
                  isConnected ? 'bg-green-500' : 'bg-red-500'
                }`}
              />
              <span className="text-sm text-secondary-600 hidden sm:inline">
                {isConnected ? 'Connected' : 'Disconnected'}
              </span>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="w-6 h-6 text-secondary-600" />
              ) : (
                <Menu className="w-6 h-6 text-secondary-600" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-secondary-200 py-4">
            <nav className="flex flex-col space-y-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="flex items-center space-x-2 text-secondary-600 hover:text-pinterest-600 transition-colors duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </Link>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}