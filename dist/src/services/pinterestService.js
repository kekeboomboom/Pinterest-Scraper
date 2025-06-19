"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const selenium_webdriver_1 = require("selenium-webdriver");
const chrome = require('selenium-webdriver/chrome');
const chalk_1 = __importDefault(require("chalk"));
const errorHandler_1 = __importDefault(require("./errorHandler"));
const https_1 = __importDefault(require("https"));
const http_1 = __importDefault(require("http"));
/**
 * @class PinterestService
 * @description A service to scrape images from Pinterest by category without authentication.
 */
class PinterestService {
    driver = null;
    pinList = [];
    constructor() { }
    /**
     * Main method to scrape Pinterest images by category
     */
    async scrapeByCategory(options) {
        const startTime = Date.now();
        try {
            this.pinList = []; // Reset pin list
            // Initialize browser
            await this.initializeBrowser();
            // Build search URL
            const searchUrl = this.buildSearchUrl(options.category);
            console.log(chalk_1.default.blue(`Navigating to: ${searchUrl}`));
            // Navigate to Pinterest search
            await this.driver.get(searchUrl);
            await this.driver.manage().setTimeouts({ implicit: 3000 });
            // Determine scroll count based on limit
            const scrollCount = this.determineScrollCount(options.limit || 20);
            // Perform scrolling and image collection
            for (let i = 0; i < scrollCount; i++) {
                try {
                    await this.scrollAndCollect();
                    console.log(chalk_1.default.green(`Scroll ${i + 1}/${scrollCount} completed. Collected ${this.pinList.length} images`));
                    // Break early if we have enough images
                    if (this.pinList.length >= (options.limit || 20)) {
                        break;
                    }
                }
                catch (error) {
                    console.warn(chalk_1.default.yellow(`Scroll ${i + 1} failed:`, error.message));
                }
            }
            // Clean up browser
            await this.cleanup();
            // Filter accessible images
            const accessibleImages = await this.filterAccessibleImages(this.pinList);
            // Apply limit
            const limitedImages = accessibleImages.slice(0, options.limit || 20);
            const processingTime = ((Date.now() - startTime) / 1000).toFixed(1) + 's';
            return {
                category: options.category,
                totalImages: limitedImages.length,
                images: limitedImages,
                processingTime
            };
        }
        catch (error) {
            await this.cleanup();
            throw new errorHandler_1.default(`Scraping failed: ${error.message}`);
        }
    }
    /**
     * Initialize browser with appropriate settings
     */
    async initializeBrowser() {
        const headless = process.env.CHROME_HEADLESS !== 'false';
        this.driver = new selenium_webdriver_1.Builder()
            .forBrowser('chrome')
            .setChromeOptions(new chrome.Options()
            .windowSize({ width: 1920, height: 1080 })
            .addArguments(headless ? '--headless' : '')
            .addArguments('--disable-gpu', '--log-level=3', '--no-sandbox', '--disable-dev-shm-usage'))
            .build();
    }
    /**
     * Build Pinterest search URL from category
     */
    buildSearchUrl(category) {
        const baseUrl = process.env.PINTEREST_BASE_URL || 'https://pinterest.com/search/pins/?q=';
        const encodedCategory = encodeURIComponent(category.trim());
        return `${baseUrl}${encodedCategory}`;
    }
    /**
     * Determine scroll count based on desired image limit
     */
    determineScrollCount(limit) {
        const defaultScrollCount = parseInt(process.env.DEFAULT_SCROLL_COUNT || '2');
        if (limit <= 20)
            return defaultScrollCount;
        if (limit <= 50)
            return Math.max(defaultScrollCount, 3);
        if (limit <= 100)
            return Math.max(defaultScrollCount, 5);
        return Math.max(defaultScrollCount, 7);
    }
    /**
     * Scroll page and collect images
     */
    async scrollAndCollect() {
        if (!this.driver)
            throw new Error('Driver not initialized');
        // Scroll to bottom
        await this.driver.executeScript("window.scrollTo(0, document.body.scrollHeight);");
        await this.driver.sleep(3000); // Wait for content to load
        // Collect images from current page
        await this.collectImagesFromPage();
        // Additional scroll for dynamic content
        await this.driver.executeScript("window.scrollTo(0, document.body.scrollHeight);");
        await this.driver.sleep(2000);
    }
    /**
     * Collect images from current page
     */
    async collectImagesFromPage() {
        if (!this.driver)
            return;
        try {
            const pageSource = await this.driver.getPageSource();
            const pins = pageSource.match(/<img.*?src=["'](.*?)["']/g);
            if (pins) {
                for (const pin of pins) {
                    const sourceMatch = pin.match(/src=["'](.*?)["']/);
                    if (sourceMatch) {
                        const source = sourceMatch[1];
                        // Filter Pinterest images and avoid duplicates
                        if (this.isPinterestImage(source) && !this.pinList.includes(source)) {
                            const cleanedUrl = this.cleanImageUrl(source);
                            this.pinList.push(cleanedUrl);
                        }
                    }
                }
            }
        }
        catch (error) {
            console.warn(chalk_1.default.yellow('Failed to collect images from page:', error.message));
        }
    }
    /**
     * Check if URL is a valid Pinterest image
     */
    isPinterestImage(url) {
        return url.includes('pinimg.com') &&
            !url.includes('75x75_RS') &&
            !url.includes('/30x30_RS/') &&
            !url.includes('avatar') &&
            (url.includes('originals') || url.includes('564x'));
    }
    /**
     * Clean and enhance image URL for better quality
     */
    cleanImageUrl(url) {
        // Convert to original size if possible
        if (url.includes('564x')) {
            return url.replace('/564x/', '/originals/').replace(/\/\d+x\d+\//, '/originals/');
        }
        return url;
    }
    /**
     * Filter accessible images (remove 403/404 responses)
     */
    async filterAccessibleImages(imageUrls) {
        console.log(chalk_1.default.blue(`Filtering ${imageUrls.length} images for accessibility...`));
        const accessibleImages = [];
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
            }
            catch (error) {
                console.warn(chalk_1.default.yellow('Batch accessibility check failed:', error.message));
                // Add URLs anyway if batch check fails
                accessibleImages.push(...batch);
            }
        }
        console.log(chalk_1.default.green(`${accessibleImages.length} accessible images found`));
        return accessibleImages;
    }
    /**
     * Check if URL is accessible
     */
    async checkUrlAccessibility(url) {
        return new Promise((resolve) => {
            const request = url.startsWith('https') ? https_1.default : http_1.default;
            const timeoutDuration = 5000; // 5 second timeout
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
    async cleanup() {
        if (this.driver) {
            try {
                await this.driver.quit();
                this.driver = null;
            }
            catch (error) {
                console.warn(chalk_1.default.yellow('Browser cleanup warning:', error.message));
            }
        }
    }
}
exports.default = PinterestService;
