import { Builder, By, ThenableWebDriver, until } from 'selenium-webdriver';
const chrome = require('selenium-webdriver/chrome');
import chalk from 'chalk';
import PinterestError from './errorHandler';
import { ScrapeOptions, ScrapeResult } from '../types/pinterest';
import https from 'https';
import http from 'http';

/**
 * @class PinterestService
 * @description A service to scrape images from Pinterest by category without authentication.
 */
export default class PinterestService {
  private driver: ThenableWebDriver | null = null;
  private pinList: string[] = [];
  private static instance: PinterestService;
  private initializationPromise: Promise<void> | null = null;

  private constructor() {}

  public static getInstance(): PinterestService {
    if (!PinterestService.instance) {
      PinterestService.instance = new PinterestService();
    }
    return PinterestService.instance;
  }

  /**
   * Main method to scrape images from Pinterest.
   * This method is now deprecated and will be removed in a future version.
   * @deprecated Please use scrapeHomepage instead.
   */
  async scrapeByCategory(options: ScrapeOptions): Promise<ScrapeResult> {
    console.warn(chalk.yellow('The scrapeByCategory method is deprecated and will be removed. Please use scrapeHomepage.'));
    // Forward to scrapeHomepage, ignoring category.
    const result = await this.scrapeHomepage(options);
    return {
      ...result,
      category: options.category, // for backward compatibility of the return type
    };
  }

  /**
   * Main method to scrape Pinterest homepage
   */
  async scrapeHomepage(options: Pick<ScrapeOptions, 'limit'>): Promise<ScrapeResult> {
    const startTime = Date.now();
    
    try {
      await this.initializeBrowser();
      
      this.pinList = []; // Reset pin list
      
      const baseUrl = process.env.PINTEREST_BASE_URL || 'https://pinterest.com/';
      console.log(chalk.blue(`Navigating to: ${baseUrl}`));
      
      // Navigate to Pinterest home
      await this.driver!.get(baseUrl);
      await this.driver!.manage().setTimeouts({ implicit: 1500 });
      
      // Perform scrolling and image collection until the limit is reached
      if (this.driver) {
        let lastHeight = await this.driver.executeScript('return document.body.scrollHeight');
        while (this.pinList.length < (options.limit || 20)) {
          await this.scrollAndCollect();
          console.log(chalk.green(`Collected ${this.pinList.length} images so far...`));
  
          // Break if we have enough images
          if (this.pinList.length >= (options.limit || 20)) {
            break;
          }
  
          const newHeight = await this.driver.executeScript('return document.body.scrollHeight');
          if (newHeight === lastHeight) {
            console.warn(chalk.yellow('No more content to load. Stopping scroll.'));
            break; // Exit if the page height isn't changing, indicating no new content
          }
          lastHeight = newHeight;
        }
      }
      
      // Filter accessible images
      const accessibleImages = await this.filterAccessibleImages(this.pinList);
      
      // Apply limit
      const limitedImages = accessibleImages.slice(0, options.limit || 20);
      
      return {
        totalImages: limitedImages.length,
        images: limitedImages
      };
      
    } catch (error) {
      // No longer quitting browser here to allow reuse
      throw new PinterestError(`Scraping failed: ${(error as Error).message}`);
    }
  }

  /**
   * Initialize browser with appropriate settings
   */
  private initializeBrowser(): Promise<void> {
    if (!this.initializationPromise) {
      console.log(chalk.yellow('Browser not initialized. Initializing...'));
      this.initializationPromise = this._initializeBrowser();
    }
    return this.initializationPromise;
  }

  private async _initializeBrowser(): Promise<void> {
    const headless = process.env.CHROME_HEADLESS !== 'false';
    const serviceBuilder = new chrome.ServiceBuilder('/opt/homebrew/bin/chromedriver');

    console.log(chalk.blue(`Initializing Chrome driver... Headless: ${headless}`));

    try {
      this.driver = new Builder()
        .forBrowser('chrome')
        .setChromeService(serviceBuilder)
        .setChromeOptions(
          new chrome.Options()
            .windowSize({ width: 1920, height: 1080 })
            .addArguments(headless ? '--headless' : '')
            .addArguments('--disable-gpu', '--log-level=3', '--no-sandbox', '--disable-dev-shm-usage')
        )
        .build();
      
      console.log(chalk.green('Browser initialized successfully.'));
      await this.login();
    } catch (error) {
      console.error(chalk.red('Failed to initialize browser:'), error);
      this.initializationPromise = null; // Reset promise on failure
      throw error;
    }
  }

  /**
   * Login to Pinterest
   */
  private async login(): Promise<void> {
    const email = process.env.PINTEREST_EMAIL;
    const password = process.env.PINTEREST_PASSWORD;

    if (!email || !password) {
      console.warn(chalk.yellow('Pinterest email or password not provided in .env file. Skipping login.'));
      return;
    }

    if (!this.driver) throw new Error('Driver not initialized');

    try {
      console.log(chalk.blue('Navigating to Pinterest homepage...'));
      await this.driver.get('https://www.pinterest.com/');
      await this.driver.wait(until.elementLocated(By.xpath('//div[text()="Log in"]')), 15000);
      const loginButton = await this.driver.findElement(By.xpath('//div[text()="Log in"]'));
      await loginButton.click();

      console.log(chalk.blue('Entering credentials...'));
      await this.driver.wait(until.elementLocated(By.id('email')), 10000);
      await this.driver.findElement(By.id('email')).sendKeys(email);
      await this.driver.findElement(By.id('password')).sendKeys(password);
      await this.driver.sleep(500);

      console.log(chalk.blue('Submitting login form...'));
      const submitButton = await this.driver.findElement(By.css('button[type="submit"]'));
      await submitButton.click();
      
      await this.driver.wait(until.urlContains('/feed/'), 20000);
      console.log(chalk.green('Login successful! Waiting for page to load...'));
      await this.driver.sleep(5000); // Wait for the feed to load
      
    } catch (error) {
      console.error(chalk.red('Failed to log in to Pinterest:'), error);
      throw new PinterestError('Login failed. Please check your credentials and network connection.');
    }
  }

  /**
   * Build Pinterest search URL from category
   */
  private buildSearchUrl(category: string): string {
    const baseUrl = process.env.PINTEREST_BASE_URL || 'https://pinterest.com/search/pins/?q=';
    const encodedCategory = encodeURIComponent(category.trim());
    return `${baseUrl}${encodedCategory}`;
  }

  /**
   * Scroll page and collect images
   */
  private async scrollAndCollect(): Promise<void> {
    if (!this.driver) throw new Error('Driver not initialized');

    // Scroll to bottom and collect
    await this.driver.executeScript('window.scrollTo(0, document.body.scrollHeight);');
    await this.driver.sleep(2000); // Wait for images to load
    await this.collectImagesFromPage();
  }

  /**
   * Collect images from current page
   */
  private async collectImagesFromPage(): Promise<void> {
    if (!this.driver) return;

    try {
      // Use a more specific and efficient selector for Pinterest image elements
      const imageElements = await this.driver.findElements(By.css('img[src*="i.pinimg.com"]'));

      for (const imageElement of imageElements) {
        try {
          const source = await imageElement.getAttribute('src');
          if (source) {
            // Filter Pinterest images and avoid duplicates
            if (this.isPinterestImage(source) && !this.pinList.includes(source)) {
              const cleanedUrl = this.cleanImageUrl(source);
              this.pinList.push(cleanedUrl);
            }
          }
        } catch (error) {
          if ((error as Error).name !== 'StaleElementReferenceError') {
            // A stale element reference means the element was removed from the DOM. We can safely ignore this.
            console.warn(chalk.yellow('Error getting image source:', (error as Error).message));
          }
        }
      }
    } catch (error) {
      console.warn(chalk.yellow('Failed to collect images from page:', (error as Error).message));
    }
  }

  /**
   * Check if URL is a valid Pinterest image
   */
  private isPinterestImage(url: string): boolean {
    return url.includes('pinimg.com') && 
           !url.includes('75x75_RS') && 
           !url.includes('/30x30_RS/') &&
           !url.includes('avatar') &&
           (url.includes('originals') || url.includes('564x'));
  }

  /**
   * Clean and enhance image URL for better quality
   */
  private cleanImageUrl(url: string): string {
    // Convert to original size if possible
    if (url.includes('564x')) {
      return url.replace('/564x/', '/originals/').replace(/\/\d+x\d+\//, '/originals/');
    }
    
    return url;
  }

  /**
   * Filter accessible images (remove 403/404 responses)
   */
  private async filterAccessibleImages(imageUrls: string[]): Promise<string[]> {
    console.log(chalk.blue(`Filtering ${imageUrls.length} images for accessibility...`));
    
    const accessibleImages: string[] = [];
    const batchSize = 10; // Process in batches to avoid overwhelming
    
    for (let i = 0; i < imageUrls.length; i += batchSize) {
      const batch = imageUrls.slice(i, i + batchSize);
      const promises = batch.map(url => this.checkUrlAccessibility(url));
      
      try {
        const results = await Promise.allSettled(promises);
        
        results.forEach((result, index) => {
          if (result.status === 'fulfilled' && result.value) {
            accessibleImages.push(batch[index]);
          }
        });
      } catch (error) {
        console.warn(chalk.yellow('Batch accessibility check failed:', (error as Error).message));
        // Add URLs anyway if batch check fails
        accessibleImages.push(...batch);
      }
    }
    
    console.log(chalk.green(`${accessibleImages.length} accessible images found`));
    return accessibleImages;
  }

  /**
   * Check if URL is accessible
   */
  private async checkUrlAccessibility(url: string): Promise<boolean> {
    return new Promise((resolve) => {
      const request = url.startsWith('https') ? https : http;
      const timeoutDuration = 2000; // 2 second timeout
      
      const req = request.request(url, { method: 'HEAD', timeout: timeoutDuration }, (res) => {
        resolve(res.statusCode !== undefined && res.statusCode >= 200 && res.statusCode < 400);
      });
      
      req.on('error', () => resolve(false));
      req.on('timeout', () => {
        req.destroy();
        resolve(false);
      });
      
      req.setTimeout(timeoutDuration, () => {
        req.destroy();
        resolve(false);
      });
      
      req.end();
    });
  }

  /**
   * Clean up browser resources
   */
  public async cleanup(): Promise<void> {
    if (this.driver) {
      try {
        await this.driver.quit();
        this.driver = null;
        this.initializationPromise = null;
        console.log(chalk.yellow('Browser instance cleaned up.'));
      } catch (error) {
        console.warn(chalk.yellow('Browser cleanup warning:', (error as Error).message));
      }
    }
  }

  /**
   * Gracefully shuts down the browser instance
   */
  async shutdown(): Promise<void> {
    await this.cleanup();
  }
} 
