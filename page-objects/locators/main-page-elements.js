export default class PageElements {
    constructor(page) {

        // Register and Login Elements
        this.page = page;
        this.REGISTER_LINK = page.locator("//a[normalize-space()='Register']")
        this.LOGIN_LINK = page.locator('//ul[@class="dropdown-menu dropdown-menu-right show"]//a[text()="Login"]')
        this.LOGOUT_LINK = page.locator('//ul[@class="dropdown-menu dropdown-menu-right show"]//a[text()="Logout"]')
        this.SUCCESSFULLY_LOGOUT_H1 = page.locator("//h1[normalize-space()='Account Logout']");
        this.MY_ACCOUNT_DROPDOWN = page.locator("//span[normalize-space()='My Account']");
        this.H2_RETURNING_CUSTOMER = page.locator("form[id='form-login'] h2");
        this.EMAIL_FIELD = page.locator("#input-email");
        this.PASSWORD_FIELD = page.locator("#input-password");
        this.CONFIRM_PASSWORD_FIELD = page.locator("#input-confirm");
        this.LOGIN_BTN = page.locator("//button[normalize-space()='Login']");
        this.MY_ACCOUNT_H1 = page.locator(`//h1[normalize-space()='My Account']`);
        this.ERROR_ALERT = page.getByText('Warning: No match for E-Mail');
        this.CONTINUE_REGISTER_BTN = page.locator("//a[normalize-space()='Continue']");
        this.FORGOTTEN_PASSWORD_LINK = page.locator('#form-login').getByRole('link', { name: 'Forgotten Password' });
        this.FORGOT_PASSWORD_H2 = page.getByRole('heading', { name: 'Forgot Your Password?' });
        this.FORGOT_PASSWORD_EMAIL_FIELD = page.getByPlaceholder('E-Mail Address');
        this.CONTINUE_FORGOT_PASSWORD = page.getByRole('button', { name: 'Continue' });
        this.SUCCESS_FORGOT_PASSWORD = page.getByText('Success: Your password has been successfully updated.');
        this.FAILED_FORGOT_PASSWORD = page.getByText('Warning: The E-Mail Address was not found in our records!')
        this.REGISTER_ACCOUNT_H1 = page.locator("//h1[normalize-space()='Register Account']");
        this.FIRST_NAME_FIELD = page.getByPlaceholder('First Name')
        this.LAST_NAME_FIELD = page.getByPlaceholder('Last Name')
        this.REGISTER_EMAIL_FIELD = page.getByPlaceholder('E-Mail')
        this.REGISTER_PASSWORD_FIELD = page.getByPlaceholder('Password')
        this.SUBS_NEWSLETTER_TOOGLE = page.locator('#input-newsletter')
        this.PRIVACY_POLICY_TOOGLE = page.locator('input[name="agree"]')
        this.REGISTER_CONTINUE_BUTTON = page.getByRole('button', { name: 'Continue' })
        this.LOGIN_PAGE_LINK_REG = page.getByRole('link', { name: 'login page' })
        this.PRIVACY_POLICY_LINK = page.locator('#form-register').getByRole('link', { name: 'Privacy Policy' })
        this.REGISTRATION_SUCCESSFUL_TEXT = page.getByRole('heading', { name: 'Your Account Has Been Created!' });
        this.REGISTRATION_FAILURE_TEXT = page.getByText('Warning: E-Mail Address is already registered!');
        this.FIRST_NAME_WARNING = page.getByText('First Name must be between 1 and 32 characters!')
        this.LAST_NAME_WARNING = page.getByText('Last Name must be between 1 and 32 characters!')
        this.EMAIL_WARNING = page.getByText('E-Mail Address does not appear to be valid!')
        this.PASSWORD_WARNING = page.getByText('Password must be between 4 and 20 characters!')
        this.PRIVACY_POLICY_WARNING = page.getByText('Warning: You must agree to the Privacy Policy!')
        this.REGISTER_CONTINUE_TO_ACCOUNT_BTN = page.locator("//a[normalize-space()='Continue']")
        this.HOME_ICON = page.locator(`//i[@class='fas fa-home']`);
        this.ENTER_NEW_PASSWORD = page.getByText('Enter the new password you wish to use.', { exact: true });

        // Products, Checkout Elements
        this.PRODUCT_IMAGES = page.locator(".product-thumb");
        this.ADD_TO_CART_ICON = page.getByLabel('Add to Cart').nth(0);
        this.ALERT_CLOSE_BTN = page.locator('#alert').getByRole('button');
        this.PRODUCT_TITLE_HEADING = page.locator('h1');
        this.FEATURED_H1 = page.getByRole('heading', { name: 'Featured' });
        this.PRICE_TEXT = page.locator("ul[class='list-unstyled'] li h2");
        this.PRODUCT_ATTRIBUTES = page.locator("body > main:nth-child(4) > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > ul:nth-child(2)");
        this.SUCCESS_ADD_TO_CART = page.getByText("Success: You have added");
        this.BUTTON_CART = page.locator(".btn.btn-lg.btn-inverse.btn-block.dropdown-toggle");
        this.CART_DROPDOWN_MENU = page.locator(".dropdown-menu.dropdown-menu-end.p-2.show");
        this.CHECKOUT_DD_MENU = page.locator("body > header:nth-child(3) > div:nth-child(1) > div:nth-child(1) > div:nth-child(3) > div:nth-child(1) > ul:nth-child(2) > li:nth-child(1) > div:nth-child(2) > p:nth-child(2) > a:nth-child(2)");
        this.VIEW_CART_DD_MENU = page.locator("body > header:nth-child(3) > div:nth-child(1) > div:nth-child(1) > div:nth-child(3) > div:nth-child(1) > ul:nth-child(2) > li:nth-child(1) > div:nth-child(2) > p:nth-child(2) > a:nth-child(1)")
        this.REMOVE_FROM_CART_BTN = page.locator("button[title='Remove']");
        this.SUCCESS_REMOVE_FROM_CART = page.getByText("Success: You have removed");
        this.CHECKOUT_H1 = page.getByRole('heading', { name: 'Checkout' });
        this.RADIO_REGISTER_ACCOUNT = page.getByLabel('Register Account');
        this.RADIO_GUEST_ACCOUNT = page.getByLabel('Guest Checkout');
        this.FIRSTNAME_FIELD_CO = page.getByPlaceholder('First Name');
        this.LASTNAME_FIELD_CO = page.getByPlaceholder('Last Name');
        this.EMAIL_FIELD_CO = page.getByPlaceholder('E-Mail');
        this.COMPANY_FIELD_CO = page.getByPlaceholder('Company');
        this.ADDRESS1_FIELD_CO = page.getByPlaceholder('Address 1');
        this.ADDRESS2_FIELD_CO = page.getByPlaceholder('Address 2');
        this.CITY_FIELD_CO = page.getByPlaceholder('City');
        this.POSTCODE_FIELD_CO = page.getByPlaceholder('Post Code');
        this.COUNTRY_DROPDOWN_CO = page.getByLabel('Country');
        this.REGION_DROPDOWN_CO = page.getByLabel('Region');
        this.PASSWORD_FOR_REGISTERED_ACC = page.getByPlaceholder('Password');
        this.TOGGLE_NEWSLETTER = page.getByLabel('I wish to subscribe to the')
        this.TOGGLE_PRIVACY_POLICY = page.locator('#input-register-agree')
        this.CONTINUE_CO_BTN = page.getByRole('button', { name: 'Continue' })
        this.COMMENT_FIELD_CO = page.getByLabel('Add Comments About Your Order')
        this.DETAILS_FIELD_CO = page.getByRole('cell', { name: '1x MacBook - Reward Points:' })
        this.TOTAL_CO = page.locator('#checkout-confirm tbody').getByRole('cell', { name: '$' })
        this.SUCCESS_GUEST_USER_INFORMATION = page.getByText("Success: Your guest account");
        this.SUCCESS_REGIST_USER_INFORMATION = page.getByText("Success: Your has been successfully created");
        this.SUCCESS_UPDATE_USER_INFORMATION = page.getByText("Success: Your has been successfully updated");
        this.CHOOSE_PAYMENT_METHOD_BTN = page.locator('#button-payment-methods')
        this.CHOOSE_SHIPPING_METHOD_BTN = page.locator('#button-shipping-methods')
        this.MODAL_DIALOG_PAYMENT_METHOD = page.locator('.modal-content', { has: page.locator('.modal-title', { hasText: 'Payment' }) })
        this.MODAL_DIALOG_SHIPPING_METHOD = page.locator('.modal-content', { has: page.locator('.modal-title', { hasText: 'Shipping' }) });
        this.RADIO_BANK_TRANSFER = page.locator('#input-payment-method-bank_transfer-bank-transfer')
        this.RADIO_FLAT_SHIPPING = page.locator('#input-shipping-method-flat-flat')
        this.CONTINUE_MODAL_PAYMENT = page.locator('#button-payment-method')
        this.CONTINUE_MODAL_SHIPPING = page.locator('#button-shipping-method')
        this.BANK_TRANSFER_INSTRUCTIONS = page.locator("div[id='checkout-payment'] fieldset")
        this.CONFIRM_ORDER_BTN = page.locator("//button[@id='button-confirm']")
        this.SUCCESS_ORDER_H1 = page.getByRole('heading', { name: 'Your order has been placed!'})
        this.CONTINUE_SUCCESS_ORDER_BTN = page.getByRole('link', { name: 'Continue' })
        this.COMPARE_PRODUCT_BTN = page.locator('body > main:nth-child(4) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(4) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > form:nth-child(2) > div:nth-child(1) > button:nth-child(3)');
        this.PRODUCT_COMPARISON_LINK = page.locator('#alert .alert-success a:nth-of-type(2)');
        this.PRODUCT_COMPARISON_H1 = page.locator("div[id='content'] h1");
        this.PRODUCT_COMPARISON_CONTENT_TABLE = page.locator("#content table");
        this.CART_BUTTON = page.locator(".btn.btn-lg.btn-inverse.btn-block.dropdown-toggle");
        this.CART_CLOSE_BUTTON = page.locator(".btn.btn-danger");
        this.CLOSE_SUCCESS_ADD_TO_CART_BTN = page.locator("button.btn-close");
        this.CLOSE_SUCCESS_REMOVE_BTN = page.locator("button.btn-close");
        this.CART_IS_EMPTY_TEXT = page.locator('//li[contains(text(), "Your shopping cart is empty!")]');
        this.FILTER_OPTIONS = page.locator('#input-sort');
        this.PRODUCT_PRICE = page.locator(".price > .price-new");

        //Nav-Bar menus
        this.NAVBAR_MENU = page.locator("//nav[@id='menu']")
        this.NAVBAR_LINKS = page.locator('#menu .nav-link');
        this.FOOTER_LINKS = page.locator('footer .row .col-sm-3 ul.list-unstyled li a');
        this.NAV_DESKTOPS = page.locator('main li:nth-child(1) a:nth-child(1)');
        this.NAV_LAPTOPS = page.locator('main li:nth-child(2) a:nth-child(1)');
        this.NAV_COMPONENTS = page.locator('main li:nth-child(3) a:nth-child(1)');
        this.NAV_TABLETS = page.locator('main li:nth-child(4) a:nth-child(1)');
        this.NAV_SOFTWARE = page.locator('main li:nth-child(5) a:nth-child(1)');
        this.NAV_PHONES = page.locator('main li:nth-child(6) a:nth-child(1)');
        this.NAV_CAMERAS = page.locator('main li:nth-child(7) a:nth-child(1)');
        this.NAV_MP3 = page.locator('main li:nth-child(8) a:nth-child(1)');
        this.NAV_DESKTOPS_H2 = page.locator("//h2[contains(text(),'Desktops')]");
        this.PRODUCT_PAGE_ADD_TO_CART_BTN = page.locator('div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > form:nth-child(2) > div:nth-child(1) > button:nth-child(1)');
        this.H1_PRODUCT = page.locator("//h1[contains(text(),'Apple Cinema 30\"')]");
        this.SEARCH_INPUT = page.locator('#search input[name="search"]');
        this.SEARCH_BUTTON = page.locator("//button[@class='btn btn-light btn-lg']");
        this.SEARCH_RESULT_H1 = page.locator("div[id='content'] h1");
        this.NOT_FOUND_RESULT = page.locator("div[id='content'] p");
        this.PRODUCT_DESCRIPTION = page.locator("div[class='description'] p");
        this.PRODUCT_TITLE = page.locator("div[class='description'] h4 a")
        this.PRODUCT_CARD = page.locator('#product-list .product-thumb');
        this.PRODUCT_TITLE = page.locator('#product-list .product-thumb h4 a');
        this.PRODUCT_DESCRIPTION = page.locator('#product-list .product-thumb .description p');
        this.PRODUCT_PRICE = page.locator('#product-list .product-thumb .price');
        this.NOT_FOUND_RESULT = page.locator("//p[normalize-space()='There are no products to list in this category.']");
        this.NOT_FOUND_RESULT_BY_SEARCH = page.locator("//p[normalize-space()='There is no product that matches the search criteria.']");
        this.SIDE_BAR_LINKS_ON_PRODUCT_PAGE = page.locator("#column-left .list-group .list-group-item");
    }   
}