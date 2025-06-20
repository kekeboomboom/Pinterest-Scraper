export interface PinterestImage {
  id: string
  url: string
  originalUrl: string
  title: string
  description?: string
  width: number
  height: number
  dominant_color?: string
  size?: number
  quality: ImageQuality
  source?: string
}

export interface ScrapingResult {
  id: string
  category: string
  totalImages: number
  images: PinterestImage[]
  quality: ImageQuality
  timestamp: string
  duration: number
  success: boolean
  error?: string
}

export interface ScrapingJob {
  id: string
  userId: string
  category: string
  imageCount: number
  quality: ImageQuality
  status: JobStatus
  progress: number
  results?: ScrapingResult
  error?: string
  createdAt: string
  updatedAt: string
  completedAt?: string
}

export interface User {
  id: string
  email: string
  name?: string
  apiKey: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface ApiCall {
  id: string
  userId: string
  endpoint: string
  method: string
  statusCode: number
  duration: number
  userAgent?: string
  ip?: string
  createdAt: string
}

export interface SystemStats {
  id: string
  totalJobs: number
  successfulJobs: number
  failedJobs: number
  totalImages: number
  uptime: number
  lastReset: string
  createdAt: string
  updatedAt: string
}

export interface CachedResult {
  id: string
  category: string
  quality: ImageQuality
  data: ScrapingResult
  expiresAt: string
  createdAt: string
}

export enum JobStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED'
}

export enum ImageQuality {
  ORIGINAL = 'ORIGINAL',
  HIGH = 'HIGH',
  MEDIUM = 'MEDIUM',
  LOW = 'LOW'
}

export interface ScrapingRequest {
  category: string
  imageCount?: number
  quality?: ImageQuality
  userId?: string
}

export interface ScrapingResponse {
  success: boolean
  data?: ScrapingResult
  error?: string
  jobId?: string
}

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
  timestamp: string
}

export interface WebSocketMessage {
  type: 'JOB_STARTED' | 'JOB_PROGRESS' | 'JOB_COMPLETED' | 'JOB_FAILED' | 'JOB_CANCELLED'
  jobId: string
  data?: any
  progress?: number
  error?: string
  timestamp: string
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
}

export interface SearchFilters {
  category?: string
  quality?: ImageQuality
  status?: JobStatus
  dateFrom?: string
  dateTo?: string
  userId?: string
}