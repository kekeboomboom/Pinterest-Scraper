import { NextRequest, NextResponse } from 'next/server'
import { chromium } from 'playwright'
import { ImageQuality, type ScrapingResult, type PinterestImage } from '@/types/pinterest'

interface ScrapeRequest {
  category: string
  imageCount?: number
  quality?: ImageQuality
  userId?: string
}

export async function POST(request: NextRequest) {
  const startTime = Date.now()
  
  try {
    const body: ScrapeRequest = await request.json()
    
    // Validate request
    if (!body.category || typeof body.category !== 'string') {
      return NextResponse.json({
        success: false,
        error: 'Category is required and must be a string',
        timestamp: new Date().toISOString(),
      }, { status: 400 })
    }

    const {
      category,
      imageCount = 20,
      quality = ImageQuality.MEDIUM,
      userId
    } = body

    // Validate parameters
    if (imageCount < 1 || imageCount > 100) {
      return NextResponse.json({
        success: false,
        error: 'Image count must be between 1 and 100',
        timestamp: new Date().toISOString(),
      }, { status: 400 })
    }

    // Launch browser
    const browser = await chromium.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
      ]
    })

    const context = await browser.newContext({
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      viewport: { width: 1920, height: 1080 },
    })

    const page = await context.newPage()

    try {
      // Navigate to Pinterest search
      const searchUrl = `https://www.pinterest.com/search/pins/?q=${encodeURIComponent(category)}`
      await page.goto(searchUrl, { waitUntil: 'networkidle', timeout: 30000 })

      // Wait for initial content to load
      await page.waitForSelector('[data-test-id="pin"]', { timeout: 10000 })

      // Scroll to load more images
      const scrollCount = Math.ceil(imageCount / 20)
      for (let i = 0; i < scrollCount; i++) {
        await page.evaluate(() => {
          window.scrollTo(0, document.body.scrollHeight)
        })
        await page.waitForTimeout(2000)
      }

      // Extract image data
      const images: PinterestImage[] = await page.evaluate((params) => {
        const { imageCount, quality } = params
        const pins = document.querySelectorAll('[data-test-id="pin"]')
        const results: PinterestImage[] = []

        for (let i = 0; i < pins.length && results.length < imageCount; i++) {
          const pin = pins[i]
          const img = pin.querySelector('img')
          const link = pin.querySelector('a')
          
          if (!img || !link) continue

          const src = img.src
          const alt = img.alt || 'Pinterest Image'
          const href = link.href

          // Extract dimensions from image or use defaults
          const naturalWidth = img.naturalWidth || 564
          const naturalHeight = img.naturalHeight || 846

          // Generate quality-appropriate URL
          let qualityUrl = src
          if (quality === 'LOW' && src.includes('/564x/')) {
            qualityUrl = src.replace('/564x/', '/236x/')
          } else if (quality === 'HIGH' && src.includes('/564x/')) {
            qualityUrl = src.replace('/564x/', '/736x/')
          } else if (quality === 'ORIGINAL') {
            qualityUrl = src.replace(/\/\d+x\//, '/originals/')
          }

          results.push({
            id: `img_${Date.now()}_${i}`,
            url: qualityUrl,
            originalUrl: href.startsWith('http') ? href : `https://pinterest.com${href}`,
            title: alt,
            description: alt,
            width: naturalWidth,
            height: naturalHeight,
            quality: quality,
            source: 'pinterest.com'
          })
        }

        return results
      }, { imageCount, quality })

      const duration = (Date.now() - startTime) / 1000

      // Create result object
      const result: ScrapingResult = {
        id: `scrape_${Date.now()}`,
        category,
        totalImages: images.length,
        images,
        quality,
        timestamp: new Date().toISOString(),
        duration,
        success: true
      }

      await browser.close()

      return NextResponse.json({
        success: true,
        data: result,
        timestamp: new Date().toISOString(),
      })

    } catch (error) {
      await browser.close()
      throw error
    }

  } catch (error) {
    console.error('Scraping error:', error)
    
    const duration = (Date.now() - startTime) / 1000
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'An unexpected error occurred',
      duration,
      timestamp: new Date().toISOString(),
    }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const category = searchParams.get('category')
  
  if (!category) {
    return NextResponse.json({
      success: false,
      error: 'Category parameter is required',
      timestamp: new Date().toISOString(),
    }, { status: 400 })
  }

  const imageCount = parseInt(searchParams.get('imageCount') || '20')
  const quality = (searchParams.get('quality') || ImageQuality.MEDIUM) as ImageQuality

  // Convert GET request to POST-like processing
  const body = {
    category,
    imageCount,
    quality
  }

  // Reuse POST logic
  const postRequest = new NextRequest(request.url, {
    method: 'POST',
    headers: request.headers,
    body: JSON.stringify(body)
  })

  return POST(postRequest)
}