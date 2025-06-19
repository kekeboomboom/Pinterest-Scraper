import { Request, Response } from 'express';
import { ScrapeOptions, ScrapeResult, ApiResponse } from '../types/pinterest';
import PinterestService from '../services/pinterestService';
import chalk from 'chalk';

export class ScrapeController {
  private pinterestService: PinterestService;

  constructor() {
    this.pinterestService = new PinterestService();
  }

  /**
   * POST /api/scrape - Scrape Pinterest images by category
   */
  async scrapeByCategory(req: Request, res: Response): Promise<void> {
    const startTime = Date.now();
    
    try {
      const { category, limit, quality }: ScrapeOptions = req.body;

      // Validate request
      if (!category || typeof category !== 'string' || category.trim().length === 0) {
        const errorResponse: ApiResponse = {
          success: false,
          error: {
            code: 'INVALID_CATEGORY',
            message: 'The provided category is invalid or empty',
            details: 'Category must be a non-empty string with alphanumeric characters',
            timestamp: new Date().toISOString()
          }
        };
        res.status(400).json(errorResponse);
        return;
      }

      // Validate limit
      const requestLimit = limit || parseInt(process.env.DEFAULT_IMAGE_LIMIT || '20');
      const maxLimit = parseInt(process.env.MAX_IMAGES_PER_REQUEST || '100');
      
      if (requestLimit > maxLimit) {
        const errorResponse: ApiResponse = {
          success: false,
          error: {
            code: 'LIMIT_EXCEEDED',
            message: `Requested image limit exceeds maximum allowed (${maxLimit})`,
            details: `Please request ${maxLimit} or fewer images`,
            timestamp: new Date().toISOString()
          }
        };
        res.status(400).json(errorResponse);
        return;
      }

      console.log(chalk.blue(`Starting scrape for category: ${category}, limit: ${requestLimit}`));

      // Perform scraping
      const result = await this.pinterestService.scrapeByCategory({
        category: category.trim(),
        limit: requestLimit,
        quality: quality || 'high'
      });

      const processingTime = ((Date.now() - startTime) / 1000).toFixed(1) + 's';
      
      const response: ApiResponse<ScrapeResult> = {
        success: true,
        data: {
          ...result,
          processingTime
        }
      };

      console.log(chalk.green(`Scraping completed. Found ${result.totalImages} images in ${processingTime}`));
      res.json(response);

    } catch (error) {
      console.error(chalk.red('Scraping failed:'), error);
      
      const errorResponse: ApiResponse = {
        success: false,
        error: {
          code: 'SCRAPING_FAILED',
          message: 'Pinterest scraping operation failed',
          details: (error as Error).message,
          timestamp: new Date().toISOString()
        }
      };
      
      res.status(500).json(errorResponse);
    }
  }

  /**
   * GET /api/scrape/:category - Alternative GET endpoint for category scraping
   */
  async scrapeByCategoryGet(req: Request, res: Response): Promise<void> {
    const startTime = Date.now();
    
    try {
      const { category } = req.params;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
      const quality = req.query.quality as 'high' | 'medium' | 'low' | undefined;

      // Validate category
      if (!category || category.trim().length === 0) {
        const errorResponse: ApiResponse = {
          success: false,
          error: {
            code: 'INVALID_CATEGORY',
            message: 'The provided category is invalid or empty',
            details: 'Category must be a non-empty string',
            timestamp: new Date().toISOString()
          }
        };
        res.status(400).json(errorResponse);
        return;
      }

      // Validate limit
      const requestLimit = limit || parseInt(process.env.DEFAULT_IMAGE_LIMIT || '20');
      const maxLimit = parseInt(process.env.MAX_IMAGES_PER_REQUEST || '100');
      
      if (requestLimit > maxLimit) {
        const errorResponse: ApiResponse = {
          success: false,
          error: {
            code: 'LIMIT_EXCEEDED',
            message: `Requested image limit exceeds maximum allowed (${maxLimit})`,
            details: `Please request ${maxLimit} or fewer images`,
            timestamp: new Date().toISOString()
          }
        };
        res.status(400).json(errorResponse);
        return;
      }

      console.log(chalk.blue(`Starting GET scrape for category: ${category}, limit: ${requestLimit}`));

      // Perform scraping
      const result = await this.pinterestService.scrapeByCategory({
        category: category.trim(),
        limit: requestLimit,
        quality: quality || 'high'
      });

      const processingTime = ((Date.now() - startTime) / 1000).toFixed(1) + 's';
      
      const response: ApiResponse<ScrapeResult> = {
        success: true,
        data: {
          ...result,
          processingTime
        }
      };

      console.log(chalk.green(`GET scraping completed. Found ${result.totalImages} images in ${processingTime}`));
      res.json(response);

    } catch (error) {
      console.error(chalk.red('GET scraping failed:'), error);
      
      const errorResponse: ApiResponse = {
        success: false,
        error: {
          code: 'SCRAPING_FAILED',
          message: 'Pinterest scraping operation failed',
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
