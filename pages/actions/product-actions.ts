import { type Page, expect } from '@playwright/test';
import ProductElements from '../locators/product-page-elements';
import testData from '../../utils/data.json';
import { logger } from '../../utils/logger/logger';

export default class ProductActions {
    readonly page: Page;
    readonly productElements: ProductElements;
    readonly logger: typeof logger;
    productAttributes: string | null = null;

    constructor(page: Page) {
        this.page = page;
        this.productElements = new ProductElements(page);
        this.logger = logger;
    }

    async gotoAsync(url: string): Promise<void> {
        await this.page.goto(url);
    }

    async selectRandomProductFromHomepage(): Promise<void> {
        try {
            this.logger.info('Attempting to select a random product from homepage');
            const productCount = await this.productElements.PRODUCT_IMAGES.count();
            const randomIndex = Math.floor(Math.random() * productCount) + 1;
            const randomProductLocator = this.page.locator(`div:nth-child(${randomIndex}) > .product-thumb > .image`);
            this.logger.debug(`Selected product index: ${randomIndex} out of ${productCount} products`);
            await randomProductLocator.click();
            this.logger.info('Successfully selected random product');
        } catch (error) {
            this.logger.error(`Failed to select random product: ${(error as Error).message}`);
            throw new Error(`Failed to select random product: ${(error as Error).message}`);
        }
    }

    async CheckRemoveAProductFromCart(): Promise<void> {
        await this.productElements.CART_BUTTON.click();
        await this.productElements.CART_CLOSE_BUTTON.click();
        await expect(this.productElements.SUCCESS_REMOVE_FROM_CART).toBeVisible();
        await this.productElements.CLOSE_SUCCESS_REMOVE_BTN.click();
        await this.productElements.CART_BUTTON.click();
        await expect(this.productElements.CART_IS_EMPTY_TEXT).toBeVisible();
    }

    async CheckRemoveProductsFromCart(): Promise<void> {
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
            this.logger.error(`Failed to remove products from cart: ${(error as Error).message}`);
            throw new Error(`Failed to remove products from cart: ${(error as Error).message}`);
        }
    }

    async compareRandomProduct(): Promise<void> {
        const productCount = await this.productElements.PRODUCT_IMAGES.count();
        if (productCount < 2) {
            throw new Error('Need at least 2 products to compare');
        }
        const indices = new Set<number>();
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
                await this.page.waitForTimeout(1000);
            }
        }
        await this.productElements.PRODUCT_COMPARISON_LINK.click();
    }

    async assertProductTitleAndAttributes(): Promise<string | null> {
        const title = await this.productElements.PRODUCT_TITLE_HEADING.textContent();
        this.productAttributes = await this.productElements.PRODUCT_ATTRIBUTES.textContent();
        console.log(`Selected Product: ${title}`);
        return title;
    }

    async addARandomProductFromHomepageToCart(): Promise<number> {
        const addToCartButtons = this.productElements.ADD_TO_CART_ICON;
        await addToCartButtons.first().waitFor({ state: 'visible' });

        const productCount = await addToCartButtons.count();

        if (productCount === 0) {
            throw new Error("No 'Add to Cart' buttons found on the homepage.");
        }

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

    async addMultipleProductsFromHomepageToCart(totalAdd: number): Promise<void> {
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
            this.logger.error(`Failed to add multiple products to cart: ${(error as Error).message}`);
            throw new Error(`Failed to add multiple products to cart: ${(error as Error).message}`);
        }
    }

    async guestCheckoutFromHomepage(data: {
        firstName: string;
        lastName: string;
        email: string;
        company: string;
        address1: string;
        address2: string;
        city: string;
        postcode: string;
    }): Promise<void> {
        await this.productElements.BUTTON_CART.click();
        await expect(this.productElements.CART_DROPDOWN_MENU).toBeVisible();
        await this.productElements.CHECKOUT_DD_MENU.click();
        await expect(this.productElements.CHECKOUT_H1).toBeVisible();
        await this.productElements.RADIO_GUEST_ACCOUNT.click();
        await this.productElements.FIRSTNAME_FIELD_CO.fill(data.firstName);
        await this.productElements.LASTNAME_FIELD_CO.fill(data.lastName);
        await this.productElements.EMAIL_FIELD_CO.fill(data.email);
        await this.productElements.COMPANY_FIELD_CO.fill(data.company);
        await this.productElements.ADDRESS1_FIELD_CO.fill(data.address1);
        await this.productElements.ADDRESS2_FIELD_CO.fill(data.address2);
        await this.productElements.CITY_FIELD_CO.fill(data.city);
        await this.productElements.POSTCODE_FIELD_CO.fill(data.postcode);
    }

    async selectRandomCountry(): Promise<void> {
        const countryDropdown = this.productElements.COUNTRY_DROPDOWN_CO;
        const countryOptions = await countryDropdown.locator('option').filter({ hasText: /^(?!0|.*Please Select).*$/ }).all();
        const countryRandomOption = countryOptions[Math.floor(Math.random() * countryOptions.length)];
        const countryRandomValue = await countryRandomOption.getAttribute('value');
        await countryDropdown.selectOption(countryRandomValue!);
    }

    async selectRandomRegion(): Promise<void> {
        const regionDropdown = this.productElements.REGION_DROPDOWN_CO;
        await this.productElements.REGION_DROPDOWN_CO.click();
        const regionOptions = await regionDropdown.locator('option').filter({ hasText: /^(?!.*Please Select).*$/ }).all();
        const regionRandomOption = regionOptions[Math.floor(Math.random() * regionOptions.length)];
        const regionRandomValue = await regionRandomOption.getAttribute('value');
        await regionDropdown.selectOption(regionRandomValue!);
    }

    async choosePaymentMethod(): Promise<void> {
        await this.productElements.CHOOSE_PAYMENT_METHOD_BTN.click();
        await expect(this.productElements.MODAL_DIALOG_PAYMENT_METHOD).toBeVisible();
        await this.productElements.RADIO_BANK_TRANSFER.click();
        await this.productElements.CONTINUE_MODAL_PAYMENT.click();
        await expect(this.productElements.BANK_TRANSFER_INSTRUCTIONS).toBeVisible();
    }

    async chooseShippingMethod(): Promise<void> {
        await this.productElements.CHOOSE_SHIPPING_METHOD_BTN.click();
        await expect(this.productElements.MODAL_DIALOG_SHIPPING_METHOD).toBeVisible();
        await this.productElements.RADIO_FLAT_SHIPPING.click();
        await this.productElements.CONTINUE_MODAL_SHIPPING.click();
    }

    async checkProductContent(): Promise<void> {
        const products = this.page.locator('#product-list .product-thumb');
        const count = await products.count();

        if (count === 0) {
            await expect(this.productElements.NOT_FOUND_RESULT).toBeVisible();
            const notFoundText = await this.productElements.NOT_FOUND_RESULT.textContent();
            console.log(`❌ No products found. Message: ${notFoundText?.trim()}`);
            return;
        }

        const randomIndex = Math.floor(Math.random() * count);
        const randomProduct = products.nth(randomIndex);

        const title = randomProduct.locator('h4 a');
        const description = randomProduct.locator('.description p');
        const price = randomProduct.locator('.price');

        await expect(title).toBeVisible();
        await expect(description).toBeVisible();
        await expect(price).toBeVisible();

        console.log(`✅ Checked product content:
            Title: ${await title.textContent()}
            Description: ${await description.textContent()}
            Price: ${await price.textContent()}
        `);
    }

    async searchForProduct(): Promise<string> {
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
            this.logger.error(`Failed to search for product: ${(error as Error).message}`);
            throw new Error(`Failed to search for product: ${(error as Error).message}`);
        }
    }

    async searchNonExistingProduct(productName: string): Promise<void> {
        await this.productElements.SEARCH_INPUT.fill(productName);
        await this.productElements.SEARCH_BUTTON.click();
        await expect(this.productElements.NOT_FOUND_RESULT).toHaveText("There is no product that matches the search criteria.");
    }

    async selectSortOption(optionText: string): Promise<void> {
        await this.productElements.FILTER_OPTIONS.selectOption({ label: optionText });
    }

    async getAllPrices(): Promise<number[]> {
        const prices = await this.productElements.PRODUCT_PRICE.allTextContents();
        return prices.map(p => parseFloat(p.replace(/[^0-9.]/g, '')));
    }

    isSortedAscending(values: number[]): boolean {
        return values.every((val, i, arr) => i === 0 || arr[i - 1] <= val);
    }

    isSortedDescending(values: number[]): boolean {
        return values.every((val, i, arr) => i === 0 || arr[i - 1] >= val);
    }

    async accessAllNavbarMenus(random: boolean = false): Promise<void> {
        const links = this.productElements.NAVBAR_LINKS;
        const total = await links.count();
        console.log(`Total Navbar Links: ${total}`);
        expect(total).toBeGreaterThan(0);

        if (random) {
            const randomIndex = Math.floor(Math.random() * total);
            const link = links.nth(randomIndex);

            await Promise.all([
                this.page.waitForNavigation({ waitUntil: 'load' }),
                link.click(),
            ]);

            await this.accessAllSidebarMenus();
        } else {
            for (let i = 0; i < total; i++) {
                const link = links.nth(i);

                await Promise.all([
                    this.page.waitForNavigation({ waitUntil: 'load' }),
                    link.click(),
                ]);
                await this.checkProductContent();
            }
        }
    }

    async accessAllSidebarMenus(): Promise<void> {
        const sidebarLinks = this.productElements.SIDE_BAR_LINKS_ON_PRODUCT_PAGE;
        const count = await sidebarLinks.count();
        console.log(`Sidebar menu count: ${count}`);

        for (let i = 0; i < count; i++) {
            const link = sidebarLinks.nth(i);
            const text = await link.textContent();

            await Promise.all([
                this.page.waitForNavigation({ waitUntil: 'load' }),
                link.click(),
            ]);
            console.log(`✅ Accessed Sidebar Menu: ${text}`);
            await this.checkProductContent();
        }
    }
}
