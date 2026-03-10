import { type Page, expect } from '@playwright/test';
import AuthElements from '../locators/auth-page-elements';

export default class RegisterActions {
    readonly page: Page;
    readonly authElements: AuthElements;

    constructor(page: Page) {
        this.page = page;
        this.authElements = new AuthElements(page);
    }

    async gotoAsync(url: string): Promise<void> {
        await this.page.goto(url);
    }

    async registerFunctions(data: {
        firstName: string;
        lastName: string;
        email: string;
        password: string;
    }): Promise<void> {
        await this.authElements.MY_ACCOUNT_DROPDOWN.click();
        await this.authElements.REGISTER_LINK.click();
        await expect(this.authElements.REGISTER_ACCOUNT_H1).toBeVisible();
        await this.authElements.FIRST_NAME_FIELD.fill(data.firstName);
        await this.authElements.LAST_NAME_FIELD.fill(data.lastName);
        await this.authElements.REGISTER_EMAIL_FIELD.fill(data.email);
        await this.authElements.REGISTER_PASSWORD_FIELD.fill(data.password);
        await this.authElements.SUBS_NEWSLETTER_TOOGLE.click();
        await this.authElements.PRIVACY_POLICY_TOOGLE.click();
        await this.authElements.REGISTER_CONTINUE_BUTTON.click();
        await this.page.waitForTimeout(500);
    }
}
