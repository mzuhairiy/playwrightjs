import { type Page, expect } from '@playwright/test';
import LayoutElements from '../locators/layout-elements';

export default class LayoutActions {
    readonly page: Page;
    readonly pageElements: LayoutElements;

    constructor(page: Page) {
        this.page = page;
        this.pageElements = new LayoutElements(page);
    }

    async gotoAsync(url: string): Promise<void> {
        await this.page.goto(url);
    }

    async accessAllNavbarMenus(): Promise<void> {
        const links = this.pageElements.NAVBAR_LINKS;
        const total = await links.count();
        console.log(`Total Navbar Links: ${total}`);
        expect(total).toBeGreaterThan(0);

        for (let i = 0; i < total; i++) {
            const link = links.nth(i);
            const itemText = (await link.innerText()).trim();

            await Promise.all([
                this.page.waitForNavigation({ waitUntil: 'load' }),
                link.click(),
            ]);

            console.log(`Accessed Navbar Menu: ${itemText}`);
            await this.checkProductContent();
        }
    }

    async accessAllFooterMenus(): Promise<void> {
        const footerLinks = this.pageElements.FOOTER_LINKS;
        const count = await footerLinks.count();
        console.log(`Total footer links: ${count}`);

        for (let i = 0; i < count; i++) {
            const link = footerLinks.nth(i);
            const text = await link.textContent();

            await link.click();
            await this.page.waitForTimeout(1000);

            console.log(`✅ Accessed footer link: ${text}`);
        }
    }

    async accessAllSidebarMenus(): Promise<void> {
        const sidebarItems = this.pageElements.SIDEBAR_MENU;
        const itemCount = await sidebarItems.count();

        for (let i = 0; i < itemCount; i++) {
            const item = sidebarItems.nth(i);
            const itemText = await item.textContent();
            await item.click();
            await this.page.waitForTimeout(1000);
            console.log(`Accessed Sidebar Menu: ${itemText}`);
            await this.pageElements.HOME_ICON.click();
            await expect(this.pageElements.FEATURED_H1).toBeVisible();
        }
    }

    private async checkProductContent(): Promise<void> {
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
