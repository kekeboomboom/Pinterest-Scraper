import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const startTime = process.uptime()
  
  return NextResponse.json({
    success: true,
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: Math.floor(startTime),
    version: '4.0.0',
    environment: process.env.NODE_ENV || 'development',
    node_version: process.version,
    memory: {
      used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
      total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024),
      external: Math.round(process.memoryUsage().external / 1024 / 1024),
    }
  })
}