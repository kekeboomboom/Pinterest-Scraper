import { NextRequest, NextResponse } from 'next/server'
import { ImageQuality } from '@/types/pinterest'

export async function GET(request: NextRequest) {
  const qualities = [
    {
      value: ImageQuality.LOW,
      label: 'Low Quality (Fast)',
      description: 'Optimized for speed - 236x or smaller',
      maxWidth: 236,
      recommended: 'For quick previews and testing'
    },
    {
      value: ImageQuality.MEDIUM,
      label: 'Medium Quality (Balanced)',
      description: 'Good balance of quality and speed - 564x',
      maxWidth: 564,
      recommended: 'Most common use case'
    },
    {
      value: ImageQuality.HIGH,
      label: 'High Quality',
      description: 'High resolution images - 736x or larger',
      maxWidth: 736,
      recommended: 'For high-quality displays'
    },
    {
      value: ImageQuality.ORIGINAL,
      label: 'Original Quality',
      description: 'Highest quality available - original size',
      maxWidth: null,
      recommended: 'For professional use and printing'
    }
  ]

  return NextResponse.json({
    success: true,
    data: qualities,
    timestamp: new Date().toISOString(),
  })
}