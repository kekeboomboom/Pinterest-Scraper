import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  // In a real application, these would come from your database
  // For demo purposes, we'll return mock data with some randomization
  const baseStats = {
    totalJobs: 1250 + Math.floor(Math.random() * 100),
    successfulJobs: 1180 + Math.floor(Math.random() * 50),
    failedJobs: 70 + Math.floor(Math.random() * 10),
    totalImages: 25000 + Math.floor(Math.random() * 1000),
    uptime: Math.floor(process.uptime()),
    activeUsers: 45 + Math.floor(Math.random() * 20),
    avgResponseTime: 150 + Math.floor(Math.random() * 50),
    apiCallsToday: 850 + Math.floor(Math.random() * 200),
  }

  return NextResponse.json({
    success: true,
    data: baseStats,
    timestamp: new Date().toISOString(),
  })
}