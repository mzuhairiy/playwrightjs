import { type Page, expect } from '@playwright/test';
import ProductElements from '../locators/product-page-elements';

export default class CheckoutActions {
    readonly page: Page;
    readonly pageElements: ProductElements;

    constructor(page: Page) {
        this.page = page;
        this.pageElements = new ProductElements(page);
    }

    async gotoAsync(url: string): Promise<void> {
        await this.page.goto(url);
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
}
