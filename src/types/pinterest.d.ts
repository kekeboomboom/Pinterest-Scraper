export interface PinterestDeclaration {
  websiteURL: string;
  email: string;
  password: string;
  scrollCount: number;
}

// API Types
export interface ScrapeOptions {
  category?: string;
  limit?: number;
  quality?: 'high' | 'medium' | 'low';
}

export interface ScrapeResult {
  category?: string;
  totalImages: number;
  images: string[];
  processingTime?: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: string;
    timestamp: string;
  };
}

export interface HealthResponse {
  status: 'healthy' | 'unhealthy';
  timestamp: string;
  version: string;
}
