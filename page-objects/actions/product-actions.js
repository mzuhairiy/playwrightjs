import { expect } from '@playwright/test';
import ProductElements from '../locators/product-page-elements.js';
import testData from '../../utils/data.json';
import { logger } from '../../utils/logger/logger.js';

/**
 * Class representing product-related actions in the application
 */
export default class ProductActions {
    /**
     * @param {import('@playwright/test').Page} page
     */
    constructor(page) {
        this.page = page;
        this.productElements = new ProductElements(page);
        this.logger = logger;
    }

    async gotoAsync(url) {
        await this.page.goto(url);
    }

    async selectRandomProductFromHomepage() {
        try {
            this.logger.info('Attempting to select a random product from homepage');
            const productCount = await this.productElements.PRODUCT_IMAGES.count();
            const randomIndex = Math.floor(Math.random() * productCount) + 1;
            const randomProductLocator = this.page.locator(`div:nth-child(${randomIndex}) > .product-thumb > .image`);
            this.logger.debug(`Selected product index: ${randomIndex} out of ${productCount} products`);
            await randomProductLocator.click();
            this.logger.info('Successfully selected random product');
        } catch (error) {
            this.logger.error(`Failed to select random product: ${error.message}`);
            throw new Error(`Failed to select random product: ${error.message}`);
        }
    }

    async CheckRemoveAProductFromCart() {
        await this.productElements.CART_BUTTON.click();
        await this.productElements.CART_CLOSE_BUTTON.click();
        await expect(this.productElements.SUCCESS_REMOVE_FROM_CART).toBeVisible();
        await this.productElements.CLOSE_SUCCESS_REMOVE_BTN.click();
        await this.productElements.CART_BUTTON.click();
        await expect(this.productElements.CART_IS_EMPTY_TEXT).toBeVisible();
    }

    async CheckRemoveProductsFromCart() {
        try {
            this.logger.info('Attempting to remove all products from cart');
            await this.productElements.CART_BUTTON.click();
            
            let removedCount = 0;
            while (await this.productElements.CART_CLOSE_BUTTON.count() > 0) {
                await this.productElements.CART_CLOSE_BUTTON.first().click();
                await expect(this.productElements.SUCCESS_REMOVE_FROM_CART).toBeVisible();
                await this.productElements.CLOSE_SUCCESS_REMOVE_BTN.click();
                await this.productElements.CART_BUTTON.click();
                removedCount++;
                this.logger.debug(`Removed product ${removedCount} from cart`);
            }
            
            await expect(this.productElements.CART_IS_EMPTY_TEXT).toBeVisible();
            this.logger.info(`Successfully removed ${removedCount} products from cart`);
        } catch (error) {
            this.logger.error(`Failed to remove products from cart: ${error.message}`);
            throw new Error(`Failed to remove products from cart: ${error.message}`);
        }
    }

    async compareRandomProduct() {
        const productCount = await this.productElements.PRODUCT_IMAGES.count();
        if (productCount < 2) {
            throw new Error('Need at least 2 products to compare');
        }
        // Pilih 2 index acak yang unik
        const indices = new Set();
        while (indices.size < 2) {
            const randomIndex = Math.floor(Math.random() * productCount) + 1;
            indices.add(randomIndex);
        }

        let clickCount = 0;
        for (const index of indices) {
            const compareBtnLocator = this.page.locator(
            `body > main:nth-child(4) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(4) > div:nth-child(${index}) > div:nth-child(1) > div:nth-child(2) > form:nth-child(2) > div:nth-child(1) > button:nth-child(3)`
            );
            await compareBtnLocator.click();
            clickCount++;
            if (clickCount === 1) {
            // Tunggu 1 detik setelah klik pertama
                await this.page.waitForTimeout(1000);
            }
        }
        await this.productElements.PRODUCT_COMPARISON_LINK.click();
    }

    async assertProductTitleAndAttributes() {
        const title = await this.productElements.PRODUCT_TITLE_HEADING.textContent(); // Get text from product title
        const productAttributes = await this.productElements.PRODUCT_ATTRIBUTES.textContent(); // Get text from product attributes
        console.log(`Selected Product: ${title}`); // Print product title
        return title;
    }

    async addARandomProductFromHomepageToCart() {
    const addToCartButtons = this.productElements.ADD_TO_CART_ICON;
    const productCount = await addToCartButtons.count();

    if (productCount === 0) {
        throw new Error("No 'Add to Cart' buttons found on the homepage.");
    }

    // All Product
    // const randomIndex = Math.floor(Math.random() * productCount);

    // First two products only:
    const validIndexes = [0, 1].filter(i => i < productCount);
    const randomIndex = validIndexes[Math.floor(Math.random() * validIndexes.length)];

    const selectedButton = addToCartButtons.nth(randomIndex);

    await selectedButton.click();
    await expect(this.productElements.SUCCESS_ADD_TO_CART).toBeVisible({
        timeout: 5000,
    });

    if (await this.productElements.CLOSE_SUCCESS_ADD_TO_CART_BTN.isVisible()) {
        await this.productElements.CLOSE_SUCCESS_ADD_TO_CART_BTN.click();
    }

    return randomIndex;
}

    async addMultipleProductsFromHomepageToCart(totalAdd) {
        try {
            this.logger.info(`Attempting to add ${totalAdd} products to cart`);
            const addToCartIcon = this.page.locator('div.button-group:nth-child(1) > button:nth-child(1)');
            const validIndexes = [0, 1];

            for (let i = 0; i < totalAdd; i++) {
                const index = validIndexes[i % validIndexes.length];
                await addToCartIcon.nth(index).click();
                await this.page.waitForTimeout(1000);
                await expect(this.productElements.SUCCESS_ADD_TO_CART).toBeVisible();
                await this.productElements.CLOSE_SUCCESS_ADD_TO_CART_BTN.click();
                this.logger.debug(`Added product ${i + 1} of ${totalAdd} to cart`);
            }
            this.logger.info(`Successfully added ${totalAdd} products to cart`);
        } catch (error) {
            this.logger.error(`Failed to add multiple products to cart: ${error.message}`);
            throw new Error(`Failed to add multiple products to cart: ${error.message}`);
        }
    }

    async checkProductContent() {
        const products = this.page.locator('#product-list .product-thumb');
        const count = await products.count();

        if (count === 0) {
            await expect(this.productElements.NOT_FOUND_RESULT).toBeVisible();
            const notFoundText = await this.productElements.NOT_FOUND_RESULT.textContent();
            console.log(`❌ No products found. Message: ${notFoundText?.trim()}`);
            return;
        }

        // pilih index random
        const randomIndex = Math.floor(Math.random() * count);
        const randomProduct = products.nth(randomIndex);

        // ambil title, description, dan price dari produk random
        const title = randomProduct.locator('h4 a');
        const description = randomProduct.locator('.description p');
        const price = randomProduct.locator('.price');

        // assertions
        await expect(title).toBeVisible();
        await expect(description).toBeVisible();
        await expect(price).toBeVisible();

        // logging ke console (optional)
        console.log(`✅ Checked product content:
            Title: ${await title.textContent()}
            Description: ${await description.textContent()}
            Price: ${await price.textContent()}
        `);
    }

    async searchForProduct() {
        try {
            this.logger.info('Attempting to search for a random product');
            const products = testData.search.products;
            const randomProduct = products[Math.floor(Math.random() * products.length)];
            await this.productElements.SEARCH_INPUT.fill(randomProduct);
            await this.productElements.SEARCH_BUTTON.click();
            await expect(this.productElements.SEARCH_RESULT_H1).toBeVisible();
            await expect(this.productElements.SEARCH_RESULT_H1).toHaveText(`Search - ${randomProduct}`);
            await expect(this.productElements.PRODUCT_TITLE.first()).toContainText(randomProduct);
            this.logger.info(`Successfully searched for product: ${randomProduct}`);
            return randomProduct;
        } catch (error) {
            this.logger.error(`Failed to search for product: ${error.message}`);
            throw new Error(`Failed to search for product: ${error.message}`);
        }
    }

    async searchNonExistingProduct(productName) {
        await this.productElements.SEARCH_INPUT.fill(productName);
        await this.productElements.SEARCH_BUTTON.click();
        await expect(this.productElements.NOT_FOUND_RESULT).toHaveText("There is no product that matches the search criteria.");
    }

    async selectSortOption(optionText) {
        await this.productElements.FILTER_OPTIONS.selectOption({ label: optionText });
    }

    async getAllPrices() {
        const prices = await this.productElements.PRODUCT_PRICE.allTextContents();
        return prices.map(p => parseFloat(p.replace(/[^0-9.]/g, '')));
    }

     isSortedAscending(values) {
        return values.every((val, i, arr) => i === 0 || arr[i - 1] <= val);
    }

    isSortedDescending(values) {
        return values.every((val, i, arr) => i === 0 || arr[i - 1] >= val);
    }
}
