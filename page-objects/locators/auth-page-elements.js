export default class AuthElements {
    constructor(page) {
        this.page = page;
        // LINKS / NAVIGATION
        this.REGISTER_LINK = this.page.locator("//a[normalize-space()='Register']");
        this.LOGIN_LINK = this.page.locator("//a[normalize-space()='Login']");
        this.MY_ACCOUNT_DROPDOWN = page.locator("//span[normalize-space()='My Account']");
        this.HOME_ICON = page.locator('.breadcrumb-item').first();
        this.LOGIN_PAGE_LINK_REG = page.getByRole('link', { name: 'login page' });
        this.PRIVACY_POLICY_LINK = page.locator('#form-register').getByRole('link', { name: 'Privacy Policy' });

        // HEADINGS / TITLES
        this.OPENCART_LOGO = page.getByRole('img', { name: 'Resist Store' })
        this.H2_RETURNING_CUSTOMER = page.locator("form[id='form-login'] h2");
        this.MY_ACCOUNT_H1 = page.locator(`//h1[normalize-space()='My Account']`);
        this.REGISTER_ACCOUNT_H1 = page.locator("//h1[normalize-space()='Register Account']");
        this.FORGOT_PASSWORD_H2 = page.getByRole('heading', { name: 'Forgot Your Password?' });
        this.REGISTRATION_SUCCESSFUL_TEXT = page.getByRole('heading', { name: 'Your Account Has Been Created!' });

        // LOGIN FORM
        this.EMAIL_FIELD = page.locator("#input-email");
        this.PASSWORD_FIELD = page.locator("#input-password");
        this.LOGIN_BTN = page.locator("//button[normalize-space()='Login']");
        this.FORGOTTEN_PASSWORD_LINK = page.locator('#form-login').getByRole('link', { name: 'Forgotten Password' });

        // REGISTER FORM
        this.FIRST_NAME_FIELD = page.getByPlaceholder('First Name');
        this.LAST_NAME_FIELD = page.getByPlaceholder('Last Name');
        this.REGISTER_EMAIL_FIELD = page.getByPlaceholder('E-Mail');
        this.REGISTER_PASSWORD_FIELD = page.getByPlaceholder('Password');
        this.SUBS_NEWSLETTER_TOOGLE = page.locator('#input-newsletter');
        this.PRIVACY_POLICY_TOOGLE = page.locator('input[name="agree"]');
        this.REGISTER_CONTINUE_BUTTON = page.getByRole('button', { name: 'Continue' });
        this.REGISTER_CONTINUE_TO_ACCOUNT_BTN = page.locator("//a[normalize-space()='Continue']");
        this.CONTINUE_REGISTER_BTN = page.locator("//a[normalize-space()='Continue']");

        // FORGOT PASSWORD FORM
        this.FORGOT_PASSWORD_EMAIL_FIELD = page.getByPlaceholder('E-Mail Address');
        this.CONTINUE_FORGOT_PASSWORD = page.getByRole('button', { name: 'Continue' });

        // SUCCESS / FAILURE MESSAGES
        this.ERROR_ALERT = page.getByText('Warning: No match for E-Mail');
        this.SUCCESS_FORGOT_PASSWORD = page.getByText('Success: Your password has been successfully updated.');
        this.FAILED_FORGOT_PASSWORD = page.getByText('Warning: The E-Mail Address was not found in our records!');
        this.REGISTRATION_FAILURE_TEXT = page.getByText('Warning: E-Mail Address is already registered!');

        // WARNINGS (VALIDATION)
        this.FIRST_NAME_WARNING = page.getByText('First Name must be between 1 and 32 characters!');
        this.LAST_NAME_WARNING = page.getByText('Last Name must be between 1 and 32 characters!');
        this.EMAIL_WARNING = page.getByText('E-Mail Address does not appear to be valid!');
        this.PASSWORD_WARNING = page.getByText('Password must be between 4 and 20 characters!');
        this.PRIVACY_POLICY_WARNING = page.getByText('Warning: You must agree to the Privacy Policy!');

        // LOGOUT
        this.LOGOUT_LINK = page.locator('//ul[@class="dropdown-menu dropdown-menu-right show"]//a[text()="Logout"]')
        this.SUCCESSFULLY_LOGOUT_H1 = page.locator("//h1[normalize-space()='Account Logout']");
    }
}