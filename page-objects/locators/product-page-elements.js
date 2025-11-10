export default class ProductElements {
    constructor(page) {
        this.page = page;
        // PRODUCT LIST / DETAILS
        this.PRODUCT_IMAGES = page.locator(".product-thumb");
        this.PRODUCT_TITLE_HEADING = page.locator('h1');
        this.FEATURED_H1 = page.getByRole('heading', { name: 'Featured' });
        this.PRICE_TEXT = page.locator("ul[class='list-unstyled'] li h2");
        this.PRODUCT_ATTRIBUTES = page.locator(`#product-info`);
        this.PRODUCT_PRICE = page.locator(".price > .price-new");
        this.FILTER_OPTIONS = page.locator('#input-sort');

        // ADD / REMOVE CART
        this.ADD_TO_CART_ICON = page.getByRole('button', { name: 'Add to Cart' });
        this.BUTTON_CART = page.locator(".btn.btn-lg.btn-inverse.btn-block.dropdown-toggle");
        this.CART_BUTTON = page.locator(".btn.btn-lg.btn-inverse.btn-block.dropdown-toggle");
        this.CART_DROPDOWN_MENU = page.locator(".dropdown-menu.dropdown-menu-end.p-2.show");
        this.VIEW_CART_DD_MENU = page.locator("body > header:nth-child(3) > div:nth-child(1) > div:nth-child(1) > div:nth-child(3) > div:nth-child(1) > ul:nth-child(2) > li:nth-child(1) > div:nth-child(2) > p:nth-child(2) > a:nth-child(1)");
        this.CHECKOUT_DD_MENU = page.locator("body > header:nth-child(3) > div:nth-child(1) > div:nth-child(1) > div:nth-child(3) > div:nth-child(1) > ul:nth-child(2) > li:nth-child(1) > div:nth-child(2) > p:nth-child(2) > a:nth-child(2)");
        this.REMOVE_FROM_CART_BTN = page.locator("button[title='Remove']");
        this.CART_CLOSE_BUTTON = page.locator(".btn.btn-danger");
        this.CART_IS_EMPTY_TEXT = page.locator('//li[contains(text(), "Your shopping cart is empty!")]');

        // SUCCESS / ALERT MESSAGES
        this.ALERT_CLOSE_BTN = page.locator('#alert').getByRole('button');
        this.SUCCESS_ADD_TO_CART = page.getByText("Success: You have added");
        this.SUCCESS_REMOVE_FROM_CART = page.getByText("Success: You have removed");
        this.CLOSE_SUCCESS_ADD_TO_CART_BTN = page.locator("button.btn-close");
        this.CLOSE_SUCCESS_REMOVE_BTN = page.locator("button.btn-close");

        // CHECKOUT PAGE
        this.CHECKOUT_H1 = page.getByRole('heading', { name: 'Checkout' });
        this.RADIO_REGISTER_ACCOUNT = page.getByLabel('Register Account');
        this.RADIO_GUEST_ACCOUNT = page.getByLabel('Guest Checkout');

        // Customer info
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
        this.TOGGLE_NEWSLETTER = page.getByLabel('I wish to subscribe to the');
        this.TOGGLE_PRIVACY_POLICY = page.locator('#input-register-agree');

        // Checkout actions
        this.CONTINUE_CO_BTN = page.getByRole('button', { name: 'Continue' });
        this.COMMENT_FIELD_CO = page.getByLabel('Add Comments About Your Order');
        this.DETAILS_FIELD_CO = page.getByRole('cell', { name: '1x MacBook - Reward Points:' });
        this.TOTAL_CO = page.locator('#checkout-confirm tbody').getByRole('cell', { name: '$' });
        this.CHOOSE_PAYMENT_METHOD_BTN = page.locator('#button-payment-methods');
        this.CHOOSE_SHIPPING_METHOD_BTN = page.locator('#button-shipping-methods');
        this.MODAL_DIALOG_PAYMENT_METHOD = page.locator('.modal-content', { has: page.locator('.modal-title', { hasText: 'Payment' }) });
        this.MODAL_DIALOG_SHIPPING_METHOD = page.locator('.modal-content', { has: page.locator('.modal-title', { hasText: 'Shipping' }) });
        this.RADIO_BANK_TRANSFER = page.locator('#input-payment-method-bank_transfer-bank-transfer');
        this.RADIO_FLAT_SHIPPING = page.locator('#input-shipping-method-flat-flat');
        this.CONTINUE_MODAL_PAYMENT = page.locator('#button-payment-method');
        this.CONTINUE_MODAL_SHIPPING = page.locator('#button-shipping-method');
        this.BANK_TRANSFER_INSTRUCTIONS = page.locator("div[id='checkout-payment'] fieldset");

        this.SUCCESS_GUEST_USER_INFORMATION = page.getByText("Success: Your guest account");
        this.SUCCESS_REGIST_USER_INFORMATION = page.getByText("Success: Your has been successfully created");
        this.SUCCESS_UPDATE_USER_INFORMATION = page.getByText("Success: Your has been successfully updated");

        // ORDER CONFIRMATION
        this.CONFIRM_ORDER_BTN = page.locator("//button[@id='button-confirm']");
        this.SUCCESS_ORDER_H1 = page.getByRole('heading', { name: 'Your order has been placed!'});
        this.CONTINUE_SUCCESS_ORDER_BTN = page.getByRole('link', { name: 'Continue' });

        // PRODUCT COMPARISON
        this.COMPARE_PRODUCT_BTN = page.locator('body > main:nth-child(4) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(4) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > form:nth-child(2) > div:nth-child(1) > button:nth-child(3)');
        this.PRODUCT_COMPARISON_LINK = page.locator('#alert .alert-success a:nth-of-type(2)');
        this.PRODUCT_COMPARISON_H1 = page.locator("div[id='content'] h1");
        this.PRODUCT_COMPARISON_CONTENT_TABLE = page.locator("#content table");
    }
}