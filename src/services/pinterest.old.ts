import { Builder, By, ThenableWebDriver } from 'selenium-webdriver';
const chrome = require('selenium-webdriver/chrome');
import chalk from 'chalk';
import PinterestError from './errorHandler';
import https from 'https';
import http from 'http';

/**
 * @class Pinterest
 * @description A class to collect images from Pinterest.
 * @public
 * @example const pinterest = new Pinterest("https://www.pinterest.com/pin/1234567890/");
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String}
 */
export default class Pinterest {

    private pinList: string[];
    private website: string;
    private userAgent: unknown;
    private driver: ThenableWebDriver;

    /**
     * @constructor
     * @description Creates an instance of Pinterest.
     * @param {string} websiteURL
     * @memberof Pinterest
     * @public
     * @example const pinterest = new Pinterest("https://www.pinterest.com/pin/1234567890/");
     * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String}
     */
    constructor(websiteURL: string) {
        this.pinList = [];
        this.website = websiteURL;
        this.driver = new Builder()
            .forBrowser('chrome')
            .setChromeOptions(
                new chrome.Options()
                    .windowSize({ width: 1920, height: 1080 })
                    .addArguments('--headless')
                    .addArguments('--disable-gpu', '--log-level=3')
            )
            .build();
        this.userAgent = this.driver.executeScript("return navigator.userAgent;");
    };


    /**
     * @method login
     * @description Logs in to the Pinterest account.
     * @param {string} email
     * @param {string} password
     * @param {number} [scrollCount=1]
     * @returns {Promise<string[] | any[]>}
     * @memberof Pinterest
     * @public
     * @example const images = await pinterest.login("[email protected]", "password", 5);
     * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String}
     * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number}
     * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise}
     * @see {@link https://seleniumhq.github.io/selenium/docs/api/javascript/module/selenium-webdriver/index_exports_ThenableWebDriver.html}
     */
    async login(email: string, password: string, scrollCount: number = 1): Promise<string[] | any[]> {
        try {

            await this.driver.get("https://pinterest.com/login");
            await this.driver.manage().setTimeouts({ implicit: 3000 });
            for (let i = 0; i < 3; i++) {
                try {
                    await this.driver.findElement(By.id("email"));
                    break;
                } catch (error) {
                    await this.driver.sleep(1000);
                }
            }
            const emailKey = await this.driver.findElement(By.id("email"));
            const passwordKey = await this.driver.findElement(By.id("password"));

            await emailKey.sendKeys(email);
            await passwordKey.sendKeys(password);
            await this.driver.sleep(1000);
            await this.driver.findElement(By.xpath("//button[@type='submit']")).click();
            await this.driver.sleep(5000);

            var images: string[] = await this.pinCollector(scrollCount, this.website);
            return images;

        } catch (error) {
            throw new PinterestError((error as Error).message);
        }
    };


    /**
     * @method mouseScrool
     * @description Scrolls the page to the end and collects the images.
     * @returns {Promise<void>}
     * @memberof Pinterest
     * @public
     * @example await pinterest.mouseScrool();
     * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String}
     */
    async mouseScrool(): Promise<void> {
        var timeout = 0;
        var height = await this.driver.executeScript("return document.body.scrollHeight");
        while (true) {

            await this.driver.executeScript("window.scrollTo(0, document.body.scrollHeight);");
            await this.driver.sleep(5000);
            var nowHeight: unknown = await this.driver.executeScript("return document.body.scrollHeight");

            if (nowHeight != height) {
                await this.returnImages();
                break;
            } else {
                timeout++;
                if (timeout >= 10) {
                    throw new PinterestError("The page could not be loaded due to your internet connection or we have reached the end of the page.");
                }
            }
        }
        await this.driver.sleep(3000);
    };


    /**
     * @method pinCollector
     * @description Collects the images from the given Pinterest URL.
     * @param {number} scrollCount
     * @param {string} [url=this.website]
     * @returns {Promise<string[] | any[]>}
     * @memberof Pinterest
     * @public
     * @example const images = await pinterest.pinCollector(5, "https://www.pinterest.com/pin/1234567890/");
     * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String}
     */
    async pinCollector(scrollCount: number, url: string = this.website): Promise<string[] | any[]> {
        if (scrollCount < 0) { scrollCount = 999; }

        await this.driver.get(url);
        await this.driver.manage().setTimeouts({ implicit: 3000 });

        for (let i = 0; i < scrollCount; i++) {
            try { await this.mouseScrool(); } catch (err) { console.error((err as Error).message); };
            console.log(chalk.green(`${(i+1)} Number of Pages Passed, Currently Collected Pin ${this.pinList.length} Count`));
        }

        console.log(chalk.green(`Total ${this.pinList.length} Number of Images Collected`));
        this.driver.quit();

        var returnedImages: string[] = this.getImages();
        if (returnedImages.length == 0) return [];
        
        // Filter out inaccessible images (403, 404, etc.)
        const accessibleImages = await this.filterAccessibleImages(returnedImages);
        return accessibleImages;
    };


    /**
     * @method returnImages
     * @description Returns the collected images.
     * @returns {Promise<string[] | any[]>}
     * @memberof Pinterest
     * @public
     * @example const images = await pinterest.returnImages();
     * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String}
     */
    async returnImages(): Promise<string[] | any[]> {
        const request: string = await this.driver.getPageSource();
        const pins: RegExpMatchArray | null = request.match(/<img.*?src=["'](.*?)["']/g);
        if (pins === null) return [];

        for (const pin of pins) {
            var source: RegExpMatchArray | null | string = pin.match(/src=["'](.*?)["']/);
            if (source == null) continue;
            source = source[1] as string;

            if (!source.includes("75x75_RS") && !source.includes("/30x30_RS/") && !this.pinList.includes(source)) {
                this.pinList.push(this.replacer(source));
            }
        }

        return this.pinList;
    };



    /**
     * @method getImages
     * @description Returns the collected images.
     * @returns {string[]}
     * @memberof Pinterest
     * @public
     * @example const images = pinterest.getImages();
     * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String}
     */
    getImages(): string[] {
        return this.pinList;
    };



    /**
     * @method getDriver
     * @description Returns the driver object.
     * @returns {ThenableWebDriver}
     * @memberof Pinterest
     * @public
     * @example const driver = pinterest.getDriver();
     * @see {@link https://seleniumhq.github.io/selenium/docs/api/javascript/module/selenium-webdriver/index_exports_ThenableWebDriver.html}
     */
    getDriver(): ThenableWebDriver {
        return this.driver;
    };

    /**
     * @method checkUrlAccessibility
     * @description Checks if a URL is accessible (not returning 403 or other error codes).
     * @param {string} url
     * @returns {Promise<boolean>}
     * @memberof Pinterest
     * @private
     * @example const isAccessible = await pinterest.checkUrlAccessibility("https://i.pinimg.com/originals/1d/88/15/1d88157b506a254dbc1b7b1bfb0d9684.jpg");
     */
    private async checkUrlAccessibility(url: string): Promise<boolean> {
        return new Promise((resolve) => {
            const request = url.startsWith('https:') ? https : http;
            const options = {
                method: 'HEAD',
                timeout: 5000,
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
                }
            };

            const req = request.get(url, options, (res) => {
                // Consider 200-299 as successful, anything else as inaccessible
                const isAccessible = res.statusCode !== undefined && res.statusCode >= 200 && res.statusCode < 300;
                resolve(isAccessible);
            });

            req.on('error', () => {
                resolve(false);
            });

            req.on('timeout', () => {
                req.destroy();
                resolve(false);
            });

            req.setTimeout(5000);
        });
    }

    /**
     * @method filterAccessibleImages
     * @description Filters out inaccessible image URLs (403, 404, etc.)
     * @param {string[]} imageUrls
     * @returns {Promise<string[]>}
     * @memberof Pinterest
     * @private
     * @example const accessibleImages = await pinterest.filterAccessibleImages(imageUrls);
     */
    private async filterAccessibleImages(imageUrls: string[]): Promise<string[]> {
        console.log(chalk.yellow(`Checking accessibility of ${imageUrls.length} images...`));
        const accessibleImages: string[] = [];
        let checkedCount = 0;

        // Check URLs in batches to avoid overwhelming the server
        const batchSize = 10;
        for (let i = 0; i < imageUrls.length; i += batchSize) {
            const batch = imageUrls.slice(i, i + batchSize);
            const promises = batch.map(async (url) => {
                const isAccessible = await this.checkUrlAccessibility(url);
                checkedCount++;
                
                if (checkedCount % 10 === 0 || checkedCount === imageUrls.length) {
                    console.log(chalk.blue(`Checked ${checkedCount}/${imageUrls.length} images`));
                }
                
                return { url, isAccessible };
            });

            const results = await Promise.all(promises);
            for (const result of results) {
                if (result.isAccessible) {
                    accessibleImages.push(result.url);
                }
            }

            // Small delay between batches to be respectful to the server
            if (i + batchSize < imageUrls.length) {
                await new Promise(resolve => setTimeout(resolve, 500));
            }
        }

        console.log(chalk.green(`Filtered ${accessibleImages.length} accessible images out of ${imageUrls.length} total`));
        return accessibleImages;
    }

    /**
    * @method replacer
    * @description Replaces the image size with the original size.
    * @param {string} str
    * @returns {string}
    * @memberof Pinterest
    * @public
    * @example const originalSize = pinterest.replacer("https://i.pinimg.com/236x/0d/7e/3e/0d7e3e3e3e3e3e3e3e3e3e3e3e3e3e3e.jpg");
    * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String}
    */
    replacer(str: string): string {
        return str.replace("/236x/", "/originals/")
            .replace("/474x/", "/originals/")
            .replace("/736x/", "/originals/")
            .replace("/564x/", "/originals/")
    };



};
