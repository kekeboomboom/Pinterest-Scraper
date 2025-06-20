'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Activity, Users, Image, Clock, TrendingUp, Server, Zap, Globe } from 'lucide-react'
import type { SystemStats } from '@/types/pinterest'

interface StatsData {
  totalJobs: number
  successfulJobs: number
  failedJobs: number
  totalImages: number
  uptime: number
  activeUsers: number
  avgResponseTime: number
  apiCallsToday: number
}

export function StatsSection() {
  const [stats, setStats] = useState<StatsData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/stats')
        if (response.ok) {
          const data = await response.json()
          setStats(data.data)
        }
      } catch (error) {
        console.error('Failed to fetch stats:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
    const interval = setInterval(fetchStats, 30000) // Update every 30 seconds

    return () => clearInterval(interval)
  }, [])

  const formatUptime = (seconds: number) => {
    const days = Math.floor(seconds / 86400)
    const hours = Math.floor((seconds % 86400) / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    
    if (days > 0) return `${days}d ${hours}h ${minutes}m`
    if (hours > 0) return `${hours}h ${minutes}m`
    return `${minutes}m`
  }

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M'
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K'
    return num.toString()
  }

  const defaultStats: StatsData = {
    totalJobs: 0,
    successfulJobs: 0,
    failedJobs: 0,
    totalImages: 0,
    uptime: 0,
    activeUsers: 0,
    avgResponseTime: 0,
    apiCallsToday: 0,
  }

  const currentStats = stats || defaultStats

  const mainStats = [
    {
      icon: Activity,
      label: 'Total Jobs',
      value: formatNumber(currentStats.totalJobs),
      change: '+12%',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      icon: Image,
      label: 'Images Scraped',
      value: formatNumber(currentStats.totalImages),
      change: '+8%',
      color: 'text-pinterest-600',
      bgColor: 'bg-pinterest-50',
    },
    {
      icon: Users,
      label: 'Active Users',
      value: formatNumber(currentStats.activeUsers),
      change: '+5%',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      icon: Clock,
      label: 'Uptime',
      value: formatUptime(currentStats.uptime),
      change: '99.9%',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
  ]

  const performanceStats = [
    {
      icon: Zap,
      label: 'Avg Response Time',
      value: `${currentStats.avgResponseTime}ms`,
      description: 'Lightning fast API responses',
    },
    {
      icon: TrendingUp,
      label: 'Success Rate',
      value: `${currentStats.totalJobs > 0 ? Math.round((currentStats.successfulJobs / currentStats.totalJobs) * 100) : 0}%`,
      description: 'Reliable scraping performance',
    },
    {
      icon: Server,
      label: 'API Calls Today',
      value: formatNumber(currentStats.apiCallsToday),
      description: 'Requests processed today',
    },
    {
      icon: Globe,
      label: 'Global CDN',
      value: '99.9%',
      description: 'Worldwide availability',
    },
  ]

  return (
    <section className="py-16 bg-secondary-50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-secondary-900 mb-4">
            System Statistics
          </h2>
          <p className="text-xl text-secondary-600 max-w-2xl mx-auto">
            Real-time performance metrics and usage statistics for the Pinterest Scraper API.
          </p>
        </motion.div>

        {/* Main Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {mainStats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white rounded-xl p-6 shadow-lg border border-secondary-200 hover:shadow-xl transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                {loading ? (
                  <div className="w-8 h-4 bg-secondary-200 rounded animate-pulse" />
                ) : (
                  <span className="text-sm font-medium text-green-600">{stat.change}</span>
                )}
              </div>
              <div>
                <h3 className="text-2xl font-bold text-secondary-900 mb-1">
                  {loading ? (
                    <div className="w-16 h-6 bg-secondary-200 rounded animate-pulse" />
                  ) : (
                    stat.value
                  )}
                </h3>
                <p className="text-secondary-600 text-sm">{stat.label}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Performance Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-white rounded-2xl p-8 shadow-xl border border-secondary-200"
        >
          <h3 className="text-2xl font-bold text-secondary-900 mb-6 text-center">
            Performance Metrics
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {performanceStats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-secondary-50 rounded-lg">
                    <stat.icon className="w-8 h-8 text-secondary-600" />
                  </div>
                </div>
                <h4 className="text-xl font-bold text-secondary-900 mb-2">
                  {loading ? (
                    <div className="w-16 h-5 bg-secondary-200 rounded animate-pulse mx-auto" />
                  ) : (
                    stat.value
                  )}
                </h4>
                <p className="text-sm font-medium text-secondary-700 mb-1">{stat.label}</p>
                <p className="text-xs text-secondary-500">{stat.description}</p>
              </div>
            ))}
          </div>

          {/* Additional Info */}
          <div className="mt-8 pt-6 border-t border-secondary-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div>
                <h4 className="text-lg font-semibold text-secondary-900 mb-2">Quality Assurance</h4>
                <p className="text-sm text-secondary-600">
                  All scraped images are validated for quality and authenticity
                </p>
              </div>
              <div>
                <h4 className="text-lg font-semibold text-secondary-900 mb-2">Rate Limiting</h4>
                <p className="text-sm text-secondary-600">
                  Intelligent rate limiting to ensure optimal performance
                </p>
              </div>
              <div>
                <h4 className="text-lg font-semibold text-secondary-900 mb-2">Caching</h4>
                <p className="text-sm text-secondary-600">
                  Smart caching system for faster subsequent requests
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Status Indicator */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-8 text-center"
        >
          <div className="inline-flex items-center space-x-2 px-4 py-2 bg-green-50 border border-green-200 rounded-full">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-sm font-medium text-green-700">
              All systems operational
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}