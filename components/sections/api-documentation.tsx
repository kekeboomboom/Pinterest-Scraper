'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Copy, Check, Code, BookOpen, Zap, Shield, Terminal, ExternalLink } from 'lucide-react'

export function ApiDocumentation() {
  const [copiedCode, setCopiedCode] = useState<string | null>(null)

  const copyToClipboard = (code: string, id: string) => {
    navigator.clipboard.writeText(code)
    setCopiedCode(id)
    setTimeout(() => setCopiedCode(null), 2000)
  }

  const endpoints = [
    {
      method: 'POST',
      path: '/api/scrape',
      description: 'Scrape Pinterest images by category',
      parameters: [
        { name: 'category', type: 'string', required: true, description: 'Search category (e.g., "nature", "food")' },
        { name: 'imageCount', type: 'number', required: false, description: 'Number of images to scrape (default: 20)' },
        { name: 'quality', type: 'string', required: false, description: 'Image quality: LOW, MEDIUM, HIGH, ORIGINAL' },
        { name: 'userId', type: 'string', required: false, description: 'User ID for tracking' },
      ],
      example: `{
  "category": "nature",
  "imageCount": 50,
  "quality": "HIGH"
}`,
      response: `{
  "success": true,
  "data": {
    "id": "scrape_123",
    "category": "nature",
    "totalImages": 50,
    "images": [
      {
        "id": "img_1",
        "url": "https://i.pinimg.com/564x/...",
        "originalUrl": "https://pinterest.com/pin/...",
        "title": "Beautiful Nature Scene",
        "width": 564,
        "height": 846,
        "quality": "HIGH"
      }
    ],
    "timestamp": "2024-01-15T10:30:00Z",
    "duration": 12.5
  }
}`
    },
    {
      method: 'GET',
      path: '/api/health',
      description: 'Check API health status',
      parameters: [],
      example: '',
      response: `{
  "success": true,
  "status": "healthy",
  "timestamp": "2024-01-15T10:30:00Z",
  "uptime": 86400,
  "version": "4.0.0"
}`
    },
    {
      method: 'GET',
      path: '/api/stats',
      description: 'Get system statistics',
      parameters: [],
      example: '',
      response: `{
  "success": true,
  "data": {
    "totalJobs": 1250,
    "successfulJobs": 1180,
    "failedJobs": 70,
    "totalImages": 25000,
    "uptime": 86400,
    "activeUsers": 45
  }
}`
    },
    {
      method: 'GET',
      path: '/api/qualities',
      description: 'Get available image quality options',
      parameters: [],
      example: '',
      response: `{
  "success": true,
  "data": [
    {
      "value": "LOW",
      "label": "Low Quality (Fast)",
      "description": "Optimized for speed"
    },
    {
      "value": "MEDIUM",
      "label": "Medium Quality (Balanced)",
      "description": "Good balance of quality and speed"
    },
    {
      "value": "HIGH",
      "label": "High Quality",
      "description": "High resolution images"
    },
    {
      "value": "ORIGINAL",
      "label": "Original Quality",
      "description": "Highest quality available"
    }
  ]
}`
    }
  ]

  const codeExamples = [
    {
      language: 'JavaScript',
      title: 'JavaScript/Node.js',
      code: `// Using fetch API
const response = await fetch('/api/scrape', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    category: 'nature',
    imageCount: 20,
    quality: 'HIGH'
  })
});

const data = await response.json();
console.log(data);`
    },
    {
      language: 'Python',
      title: 'Python',
      code: `import requests

url = 'https://your-api-domain.com/api/scrape'
payload = {
    'category': 'nature',
    'imageCount': 20,
    'quality': 'HIGH'
}

response = requests.post(url, json=payload)
data = response.json()
print(data)`
    },
    {
      language: 'cURL',
      title: 'cURL',
      code: `curl -X POST https://your-api-domain.com/api/scrape \\
  -H "Content-Type: application/json" \\
  -d '{
    "category": "nature",
    "imageCount": 20,
    "quality": "HIGH"
  }'`
    }
  ]

  const features = [
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Optimized scraping with Playwright for maximum performance'
    },
    {
      icon: Shield,
      title: 'Secure & Reliable',
      description: 'Built-in rate limiting, error handling, and security measures'
    },
    {
      icon: Code,
      title: 'Developer Friendly',
      description: 'Clean REST API with comprehensive documentation and examples'
    },
    {
      icon: Terminal,
      title: 'Real-time Updates',
      description: 'WebSocket support for live progress tracking'
    }
  ]

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-secondary-900 mb-4">
            API Documentation
          </h2>
          <p className="text-xl text-secondary-600 max-w-2xl mx-auto">
            Comprehensive guide to integrate the Pinterest Scraper API into your applications.
          </p>
        </motion.div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white rounded-lg p-6 shadow-md border border-secondary-200"
            >
              <div className="flex items-center justify-center w-12 h-12 bg-pinterest-50 rounded-lg mb-4">
                <feature.icon className="w-6 h-6 text-pinterest-600" />
              </div>
              <h3 className="text-lg font-semibold text-secondary-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-secondary-600 text-sm">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* API Endpoints */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-16"
        >
          <h3 className="text-2xl font-bold text-secondary-900 mb-8 text-center">
            API Endpoints
          </h3>
          
          <div className="space-y-8">
            {endpoints.map((endpoint, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-lg border border-secondary-200">
                <div className="flex items-center space-x-4 mb-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    endpoint.method === 'POST' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                  }`}>
                    {endpoint.method}
                  </span>
                  <code className="text-lg font-mono bg-secondary-100 px-3 py-1 rounded">
                    {endpoint.path}
                  </code>
                </div>
                
                <p className="text-secondary-600 mb-4">{endpoint.description}</p>
                
                {endpoint.parameters.length > 0 && (
                  <div className="mb-4">
                    <h4 className="font-semibold text-secondary-900 mb-2">Parameters:</h4>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left py-2">Name</th>
                            <th className="text-left py-2">Type</th>
                            <th className="text-left py-2">Required</th>
                            <th className="text-left py-2">Description</th>
                          </tr>
                        </thead>
                        <tbody>
                          {endpoint.parameters.map((param, i) => (
                            <tr key={i} className="border-b border-secondary-100">
                              <td className="py-2 font-mono text-pinterest-600">{param.name}</td>
                              <td className="py-2 text-secondary-600">{param.type}</td>
                              <td className="py-2">
                                <span className={`px-2 py-1 rounded-full text-xs ${
                                  param.required ? 'bg-red-100 text-red-700' : 'bg-secondary-100 text-secondary-700'
                                }`}>
                                  {param.required ? 'Yes' : 'No'}
                                </span>
                              </td>
                              <td className="py-2 text-secondary-600">{param.description}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {endpoint.example && (
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-secondary-900">Request Example:</h4>
                        <button
                          onClick={() => copyToClipboard(endpoint.example, `request-${index}`)}
                          className="p-1 hover:bg-secondary-100 rounded"
                        >
                          {copiedCode === `request-${index}` ? (
                            <Check className="w-4 h-4 text-green-600" />
                          ) : (
                            <Copy className="w-4 h-4 text-secondary-600" />
                          )}
                        </button>
                      </div>
                      <pre className="bg-secondary-50 p-4 rounded-lg overflow-x-auto text-sm">
                        <code>{endpoint.example}</code>
                      </pre>
                    </div>
                  )}
                  
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-secondary-900">Response Example:</h4>
                      <button
                        onClick={() => copyToClipboard(endpoint.response, `response-${index}`)}
                        className="p-1 hover:bg-secondary-100 rounded"
                      >
                        {copiedCode === `response-${index}` ? (
                          <Check className="w-4 h-4 text-green-600" />
                        ) : (
                          <Copy className="w-4 h-4 text-secondary-600" />
                        )}
                      </button>
                    </div>
                    <pre className="bg-secondary-50 p-4 rounded-lg overflow-x-auto text-sm">
                      <code>{endpoint.response}</code>
                    </pre>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Code Examples */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-16"
        >
          <h3 className="text-2xl font-bold text-secondary-900 mb-8 text-center">
            Code Examples
          </h3>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {codeExamples.map((example, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-lg border border-secondary-200">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold text-secondary-900">{example.title}</h4>
                  <button
                    onClick={() => copyToClipboard(example.code, `code-${index}`)}
                    className="p-2 hover:bg-secondary-100 rounded"
                  >
                    {copiedCode === `code-${index}` ? (
                      <Check className="w-4 h-4 text-green-600" />
                    ) : (
                      <Copy className="w-4 h-4 text-secondary-600" />
                    )}
                  </button>
                </div>
                <pre className="bg-secondary-50 p-4 rounded-lg overflow-x-auto text-sm">
                  <code>{example.code}</code>
                </pre>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Additional Resources */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="bg-gradient-to-r from-pinterest-50 to-primary-50 rounded-2xl p-8 text-center"
        >
          <h3 className="text-2xl font-bold text-secondary-900 mb-4">
            Need More Help?
          </h3>
          <p className="text-secondary-600 mb-6 max-w-2xl mx-auto">
            Explore additional resources, examples, and community support to get the most out of the Pinterest Scraper API.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://github.com/kekeboomboom/Pinterest-Scraper"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-pinterest px-6 py-3 rounded-lg flex items-center justify-center"
            >
              <BookOpen className="w-5 h-5 mr-2" />
              Full Documentation
            </a>
            <a
              href="https://github.com/kekeboomboom/Pinterest-Scraper/issues"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary px-6 py-3 rounded-lg flex items-center justify-center"
            >
              <ExternalLink className="w-5 h-5 mr-2" />
              GitHub Issues
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  )
}