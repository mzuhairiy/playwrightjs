import { type Page, expect } from '@playwright/test';
import AuthElements from '../locators/auth-page-elements';
import testData from '../../utils/data.json';
import { logger } from '../../utils/logger/logger';

export default class LoginActions {
    readonly page: Page;
    readonly authElements: AuthElements;
    readonly logger: typeof logger;

    constructor(page: Page) {
        this.page = page;
        this.authElements = new AuthElements(page);
        this.logger = logger;
    }

    async gotoAsync(url: string): Promise<void> {
        await this.page.goto(url);
    }

    async goToLoginPage(): Promise<void> {
        try {
            await this.authElements.MY_ACCOUNT_DROPDOWN.click();
            await this.authElements.LOGIN_LINK.click();
            await this.authElements.CONTINUE_REGISTER_BTN.click();
        } catch (error) {
            throw new Error(`Failed to navigate to login page: ${(error as Error).message}`);
        }
    }

    async loginFunctions(email: string, password: string): Promise<void> {
        try {
            await this.authElements.MY_ACCOUNT_DROPDOWN.click();
            await this.authElements.LOGIN_LINK.click();
            await this.authElements.EMAIL_FIELD.fill(email);
            await this.authElements.PASSWORD_FIELD.fill(password);
            this.logger.debug('Filled login credentials');
            await this.authElements.LOGIN_BTN.click();
            this.logger.info('Login attempt completed');
        } catch (error) {
            throw new Error(`Failed to login: ${(error as Error).message}`);
        }
    }

    async loginToHomepage(email: string, password: string): Promise<void> {
        try {
            await this.authElements.MY_ACCOUNT_DROPDOWN.click();
            await this.authElements.LOGIN_LINK.click();
            await this.authElements.EMAIL_FIELD.fill(email);
            await this.authElements.PASSWORD_FIELD.fill(password);
            await this.authElements.LOGIN_BTN.click();
            await expect(this.authElements.MY_ACCOUNT_H1).toBeVisible();
            await this.authElements.HOME_ICON.click();
            await expect(this.authElements.FEATURED_H1).toBeVisible();
        } catch (error) {
            throw new Error(`Failed to login and navigate to homepage: ${(error as Error).message}`);
        }
    }

    async forgottenPassword(email: string): Promise<void> {
        try {
            await this.authElements.MY_ACCOUNT_DROPDOWN.click();
            await this.authElements.LOGIN_LINK.click();
            await this.authElements.FORGOTTEN_PASSWORD_LINK.click();
            await expect(this.authElements.FORGOT_PASSWORD_H2).toBeVisible();
            await this.authElements.FORGOT_PASSWORD_EMAIL_FIELD.fill(email);
            await this.authElements.CONTINUE_FORGOT_PASSWORD.click();
        } catch (error) {
            throw new Error(`Failed to reset password: ${(error as Error).message}`);
        }
    }

    async logoutFunction(): Promise<void> {
        await this.authElements.MY_ACCOUNT_DROPDOWN.click();
        await this.authElements.LOGOUT_LINK.click();
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

        await expect(this.authElements.FORGOT_PASSWORD_H2).toBeVisible();
        await this.authElements.PASSWORD_FIELD.fill(newPassword);
        await this.authElements.CONTINUE_FORGOT_PASSWORD.click();

        return newPassword;
    }
}
