import { type Page, expect } from '@playwright/test';
import PageElements from '../locators/main-page-elements';
import testData from '../../utils/data.json';

export default class ResistStorePage {
    readonly page: Page;
    readonly pageElements: PageElements;

    constructor(page: Page) {
        this.page = page;
        this.pageElements = new PageElements(page);
    }

    async gotoAsync(url: string): Promise<void> {
        await this.page.goto(url);
    }

    async goToLoginPage(): Promise<void> {
        await this.pageElements.MY_ACCOUNT_DROPDOWN.click();
        await this.pageElements.LOGIN_LINK.click();
        await this.pageElements.CONTINUE_REGISTER_BTN.click();
    }

    async loginFunctions(email: string, password: string): Promise<void> {
        await this.pageElements.MY_ACCOUNT_DROPDOWN.click();
        await this.pageElements.LOGIN_LINK.click();
        await this.pageElements.EMAIL_FIELD.fill(email);
        await this.pageElements.PASSWORD_FIELD.fill(password);
        await this.pageElements.LOGIN_BTN.click();
    }

    async loginToHomepage(email: string, password: string): Promise<void> {
        await this.pageElements.MY_ACCOUNT_DROPDOWN.click();
        await this.pageElements.LOGIN_LINK.click();
        await this.pageElements.EMAIL_FIELD.fill(email);
        await this.pageElements.PASSWORD_FIELD.fill(password);
        await this.pageElements.LOGIN_BTN.click();
        await expect(this.pageElements.MY_ACCOUNT_H2).toBeVisible();
        await this.pageElements.HOME_ICON.click();
        await expect(this.pageElements.FEATURED_H1).toBeVisible();
    }

    async forgottenPassword(email: string): Promise<void> {
        await this.pageElements.MY_ACCOUNT_DROPDOWN.click();
        await this.pageElements.LOGIN_LINK.click();
        await this.pageElements.FORGOTTEN_PASSWORD_LINK.click();
        await expect(this.pageElements.FORGOT_PASSWORD_H2).toBeVisible();
        await this.pageElements.FORGOT_PASSWORD_EMAIL_FIELD.fill(email);
        await this.pageElements.CONTINUE_FORGOT_PASSWORD.click();
        await this.page.waitForTimeout(1000);
    }

    async resetPassword(): Promise<string> {
        let resetLink: string | undefined;
        for (let i = 1; i <= 5; i++) {
            const res = await this.page.request.get('http://localhost:8025/api/v2/messages');
            const data = await res.json();
            if (data.total > 0) {
                const body: string = data.items[0].Content.Body;
                const htmlPartMatch = body.match(/Content-Type: text\/html;[^]*?base64\s+([^]*?)\r\n--/);
                if (htmlPartMatch) {
                    const base64Content = htmlPartMatch[1].trim();
                    const decodedHtml = Buffer.from(base64Content, 'base64').toString('utf8');
                    const match = decodedHtml.match(/http:\/\/[^\s"]+reset[^\s"]+/);
                    if (match) {
                        resetLink = match[0]
                            .replace(/<br\s*\/?>/gi, '')
                            .trim();
                        break;
                    }
                }
            }
            await this.page.waitForTimeout(1000);
        }

        await this.page.goto(resetLink!);
        const newPassword = 'password123';

        await expect(this.pageElements.FORGOT_PASSWORD_H2).toBeVisible();
        await this.pageElements.PASSWORD_FIELD.fill(newPassword);
        await this.pageElements.CONFIRM_PASSWORD_FIELD.fill(newPassword);
        await this.pageElements.CONTINUE_FORGOT_PASSWORD.click();

        return newPassword;
    }

    async registerFunctions(data: {
        firstName: string;
        lastName: string;
        email: string;
        password: string;
    }): Promise<void> {
        await this.pageElements.MY_ACCOUNT_DROPDOWN.click();
        await this.pageElements.REGISTER_LINK.click();
        await expect(this.pageElements.REGISTER_ACCOUNT_H1).toBeVisible();
        await this.pageElements.FIRST_NAME_FIELD.fill(data.firstName);
        await this.pageElements.LAST_NAME_FIELD.fill(data.lastName);
        await this.pageElements.REGISTER_EMAIL_FIELD.fill(data.email);
        await this.pageElements.REGISTER_PASSWORD_FIELD.fill(data.password);
        await this.pageElements.SUBS_NEWSLETTER_TOOGLE.click();
        await this.pageElements.PRIVACY_POLICY_TOOGLE.click();
        await this.pageElements.REGISTER_CONTINUE_BUTTON.click();
        await this.page.waitForTimeout(500);
    }

    async logoutFunction(): Promise<void> {
        await this.pageElements.MY_ACCOUNT_DROPDOWN.click();
        await this.pageElements.LOGOUT_LINK.click();
    }

    async selectRandomProductFromHomepage(): Promise<void> {
        const productCount = await this.pageElements.PRODUCT_IMAGES.count();
        const randomIndex = Math.floor(Math.random() * productCount) + 1;
        const randomProductLocator = this.page.locator(`div:nth-child(${randomIndex}) > .product-thumb > .image`);
        await randomProductLocator.click();
    }

    async CheckRemoveAProductFromCart(): Promise<void> {
        await this.pageElements.CART_BUTTON.click();
        await this.pageElements.CART_CLOSE_BUTTON.click();
        await expect(this.pageElements.SUCCESS_REMOVE_FROM_CART).toBeVisible();
        await this.pageElements.CLOSE_SUCCESS_REMOVE_BTN.click();
        await this.pageElements.CART_BUTTON.click();
        await expect(this.pageElements.CART_IS_EMPTY_TEXT).toBeVisible();
    }

    async CheckRemoveProductsFromCart(): Promise<void> {
        await this.pageElements.CART_BUTTON.click();
        while (await this.pageElements.CART_CLOSE_BUTTON.count() > 0) {
            await this.pageElements.CART_CLOSE_BUTTON.first().click();
            await expect(this.pageElements.SUCCESS_REMOVE_FROM_CART).toBeVisible();
            await this.pageElements.CLOSE_SUCCESS_REMOVE_BTN.click();
            await this.pageElements.CART_BUTTON.click();
        }
        await expect(this.pageElements.CART_IS_EMPTY_TEXT).toBeVisible();
    }

    async compareRandomProduct(): Promise<void> {
        const productCount = await this.pageElements.PRODUCT_IMAGES.count();
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
        await this.pageElements.PRODUCT_COMPARISON_LINK.click();
    }

    async assertProductTitleAndAttributes(): Promise<string | null> {
        const title = await this.pageElements.PRODUCT_TITLE_HEADING.textContent();
        const productAttributes = await this.pageElements.PRODUCT_ATTRIBUTES.textContent();
        console.log(`Selected Product: ${title}`);
        return title;
    }

    async addARandomProductFromHomepageToCart(): Promise<number> {
        const addToCartIcon = this.page.locator('div.button-group:nth-child(1) > button:nth-child(1)');
        const validIndexes = [0, 1];
        const randomIndex = validIndexes[Math.floor(Math.random() * validIndexes.length)];

        await addToCartIcon.nth(randomIndex).click();
        await this.page.waitForTimeout(1000);
        await expect(this.pageElements.SUCCESS_ADD_TO_CART).toBeVisible();
        await this.pageElements.CLOSE_SUCCESS_ADD_TO_CART_BTN.click();
        return randomIndex;
    }

    async addMultipleProductsFromHomepageToCart(totalAdd: number): Promise<void> {
        const addToCartIcon = this.page.locator('div.button-group:nth-child(1) > button:nth-child(1)');
        const validIndexes = [0, 1];

        for (let i = 0; i < totalAdd; i++) {
            const index = validIndexes[i % validIndexes.length];
            await addToCartIcon.nth(index).click();
            await this.page.waitForTimeout(1000);
            await expect(this.pageElements.SUCCESS_ADD_TO_CART).toBeVisible();
            await this.pageElements.CLOSE_SUCCESS_ADD_TO_CART_BTN.click();
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
        await this.pageElements.BUTTON_CART.click();
        await expect(this.pageElements.CART_DROPDOWN_MENU).toBeVisible();
        await this.pageElements.CHECKOUT_DD_MENU.click();
        await expect(this.pageElements.CHECKOUT_H1).toBeVisible();
        await this.pageElements.RADIO_GUEST_ACCOUNT.click();
        await this.pageElements.FIRSTNAME_FIELD_CO.fill(data.firstName);
        await this.pageElements.LASTNAME_FIELD_CO.fill(data.lastName);
        await this.pageElements.EMAIL_FIELD_CO.fill(data.email);
        await this.pageElements.COMPANY_FIELD_CO.fill(data.company);
        await this.pageElements.ADDRESS1_FIELD_CO.fill(data.address1);
        await this.pageElements.ADDRESS2_FIELD_CO.fill(data.address2);
        await this.pageElements.CITY_FIELD_CO.fill(data.city);
        await this.pageElements.POSTCODE_FIELD_CO.fill(data.postcode);
    }

    async selectRandomCountry(): Promise<void> {
        const countryDropdown = this.pageElements.COUNTRY_DROPDOWN_CO;
        const countryOptions = await countryDropdown.locator('option').filter({ hasText: /^(?!0|.*Please Select).*$/ }).all();
        const countryRandomOption = countryOptions[Math.floor(Math.random() * countryOptions.length)];
        const countryRandomValue = await countryRandomOption.getAttribute('value');
        await countryDropdown.selectOption(countryRandomValue!);
    }

    async selectRandomRegion(): Promise<void> {
        const regionDropdown = this.pageElements.REGION_DROPDOWN_CO;
        await this.pageElements.REGION_DROPDOWN_CO.click();
        const regionOptions = await regionDropdown.locator('option').filter({ hasText: /^(?!.*Please Select).*$/ }).all();
        const regionRandomOption = regionOptions[Math.floor(Math.random() * regionOptions.length)];
        const regionRandomValue = await regionRandomOption.getAttribute('value');
        await regionDropdown.selectOption(regionRandomValue!);
    }

    async choosePaymentMethod(): Promise<void> {
        await this.pageElements.CHOOSE_PAYMENT_METHOD_BTN.click();
        await expect(this.pageElements.MODAL_DIALOG_PAYMENT_METHOD).toBeVisible();
        await this.pageElements.RADIO_BANK_TRANSFER.click();
        await this.pageElements.CONTINUE_MODAL_PAYMENT.click();
        await expect(this.pageElements.BANK_TRANSFER_INSTRUCTIONS).toBeVisible();
    }

    async chooseShippingMethod(): Promise<void> {
        await this.pageElements.CHOOSE_SHIPPING_METHOD_BTN.click();
        await expect(this.pageElements.MODAL_DIALOG_SHIPPING_METHOD).toBeVisible();
        await this.pageElements.RADIO_FLAT_SHIPPING.click();
        await this.pageElements.CONTINUE_MODAL_SHIPPING.click();
    }

    async searchForProduct(): Promise<string> {
        const products = testData.search.products;
        const randomProduct = products[Math.floor(Math.random() * products.length)];
        await this.pageElements.SEARCH_INPUT.fill(randomProduct);
        await this.pageElements.SEARCH_BUTTON.click();
        await expect(this.pageElements.SEARCH_RESULT_H1).toBeVisible();
        await expect(this.pageElements.SEARCH_RESULT_H1).toHaveText(`Search - ${randomProduct}`);
        await expect(this.pageElements.PRODUCT_TITLE.first()).toContainText(randomProduct);
        return randomProduct;
    }

    async searchNonExistingProduct(productName: string): Promise<void> {
        await this.pageElements.SEARCH_INPUT.fill(productName);
        await this.pageElements.SEARCH_BUTTON.click();
        await expect(this.pageElements.NOT_FOUND_RESULT_BY_SEARCH).toHaveText("There is no product that matches the search criteria.");
    }

    async selectSortOption(optionText: string): Promise<void> {
        await this.pageElements.FILTER_OPTIONS.selectOption({ label: optionText });
    }

    async getAllPrices(): Promise<number[]> {
        const prices = await this.pageElements.PRODUCT_PRICE.allTextContents();
        return prices.map(p => parseFloat(p.replace(/[^0-9.]/g, '')));
    }

    isSortedAscending(values: number[]): boolean {
        return values.every((val, i, arr) => i === 0 || arr[i - 1] <= val);
    }

    isSortedDescending(values: number[]): boolean {
        return values.every((val, i, arr) => i === 0 || arr[i - 1] >= val);
    }

    async accessAllNavbarMenus(random: boolean = false): Promise<void> {
        const links = this.pageElements.NAVBAR_LINKS;
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

    async accessAllFooterMenus(): Promise<void> {
        const footerLinks = this.pageElements.FOOTER_LINKS;
        const count = await footerLinks.count();

        for (let i = 0; i < count; i++) {
            const link = footerLinks.nth(i);
            await link.click();
            await this.page.waitForTimeout(1000);
        }
    }

    async accessAllSidebarMenus(): Promise<void> {
        const sidebarLinks = this.pageElements.SIDE_BAR_LINKS_ON_PRODUCT_PAGE;
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

    async checkProductContent(): Promise<void> {
        const products = this.page.locator('#product-list .product-thumb');
        const count = await products.count();

        if (count === 0) {
            await expect(this.pageElements.NOT_FOUND_RESULT).toBeVisible();
            const notFoundText = await this.pageElements.NOT_FOUND_RESULT.textContent();
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
}
