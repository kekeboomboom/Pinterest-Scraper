import { Request, Response } from 'express';
import { ScrapeResult, ApiResponse } from '../types/pinterest';
import { FileService } from '../services/fileService';
import chalk from 'chalk';

const FILENAME = 'top10_home.txt';

export class ScrapeController {
  constructor() {}

  /**
   * POST /api/scrape - Get scraped images
   */
  async getImages(req: Request, res: Response): Promise<void> {
    const startTime = Date.now();
    
    try {
      const { limit } = req.body;

      const allImages = FileService.read(FILENAME);
      const requestLimit = limit || 10;
      const images = allImages.slice(0, requestLimit);

      const processingTime = ((Date.now() - startTime) / 1000).toFixed(1) + 's';
      
      const response: ApiResponse<ScrapeResult> = {
        success: true,
        data: {
          totalImages: images.length,
          images: images,
          processingTime
        }
      };

      console.log(chalk.green(`Retrieved ${images.length} images from cache in ${processingTime}`));
      res.json(response);

    } catch (error) {
      console.error(chalk.red('Failed to retrieve images from cache:'), error);
      
      const errorResponse: ApiResponse = {
        success: false,
        error: {
          code: 'CACHE_READ_FAILED',
          message: 'Failed to read images from the cache',
          details: (error as Error).message,
          timestamp: new Date().toISOString()
        }
      };
      
      res.status(500).json(errorResponse);
    }
  }

  /**
   * GET /api/scrape - This endpoint will also use the cache
   */
  async getImagesGet(req: Request, res: Response): Promise<void> {
    const startTime = Date.now();
    
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;

      const allImages = FileService.read(FILENAME);
      const images = allImages.slice(0, limit);

      const processingTime = ((Date.now() - startTime) / 1000).toFixed(1) + 's';
      
      const response: ApiResponse<ScrapeResult> = {
        success: true,
        data: {
          totalImages: images.length,
          images: images,
          processingTime
        }
      };

      console.log(chalk.green(`Retrieved ${images.length} images from cache in ${processingTime}`));
      res.json(response);

    } catch (error) {
      console.error(chalk.red('Failed to retrieve images from cache:'), error);
      
      const errorResponse: ApiResponse = {
        success: false,
        error: {
          code: 'CACHE_READ_FAILED',
          message: 'Failed to read images from the cache',
          details: (error as Error).message,
          timestamp: new Date().toISOString()
        }
      };
      
      res.status(500).json(errorResponse);
    }
  }

  /**
   * GET /api/health - Health check endpoint
   */
  async healthCheck(req: Request, res: Response): Promise<void> {
    const response: ApiResponse = {
      success: true,
      data: {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        version: '2.0.0'
      }
    };
    
    res.json(response);
  }
} 
