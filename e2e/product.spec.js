import { test, expect } from '@playwright/test';
import { generateUserCheckoutData } from '../utils/user-data-generator';
import ProductActions from '../page-objects/actions/product-actions';
import LoginAction from '../page-objects/actions/login-actions';
import ProductElements from '../page-objects/locators/product-page-elements';
import AuthElements from '../page-objects/locators/auth-page-elements';
import config from '../app-config/config.json';
import { logger } from '../utils/logger/logger.js';
import LoginActions from '../page-objects/actions/login-actions';

/**
 * @file Product test scenarios for Opencart application
 * @description Tests covering product functionality including viewing, searching, cart operations, and checkout
 */

test.describe('Product Functionality Tests', () => {
  /** @type {ProductActions} */
  let productActions;
  /** @type {LoginActions} */
  let loginActions;
  /** @type {ProductElements} */
  let productElements;
  /** @type {AuthElements} */
  let authElements ;

  test.beforeEach(async ({ page }) => {
    productActions = new ProductActions(page);
    loginActions = new LoginActions(page);
    productElements = new ProductElements(page);
    authElements = new AuthElements(page);
    await productActions.gotoAsync(config.baseURL);
    await expect(page).toHaveTitle(/Resist Store/, { timeout: 10000 });
    logger.info('Starting new test case');
  });

  test('should display product details when opened from homepage', async ({}) => {
    await loginActions.loginFunctions(config.validUser.email, config.validUser.password);
    await expect(authElements.MY_ACCOUNT_H1).toBeVisible();
    await authElements.OPENCART_LOGO.click();
    await expect(productElements.FEATURED_H1).toBeVisible();
    
    await productActions.selectRandomProductFromHomepage();
    const title = await productActions.assertProductTitleAndAttributes();
    
    await expect(productElements.PRODUCT_TITLE_HEADING).toBeVisible();
    await expect(productElements.PRODUCT_ATTRIBUTES).toBeVisible();
    expect(title).not.toBeNull();
    expect(productActions.productAttributes).not.toBeNull();
    logger.info(`Successfully viewed product details: ${title}`);
  });

  test('should add product to cart from homepage', async ({}) => {
    await loginActions.loginFunctions(config.validUser.email, config.validUser.password);
    await expect(authElements.MY_ACCOUNT_H1).toBeVisible();
    await authElements.OPENCART_LOGO.click();
    await expect(productElements.FEATURED_H1).toBeVisible();
    await productActions.addARandomProductFromHomepageToCart();
    logger.info('Successfully added product to cart from homepage');
  });

  test('should add product to cart from product page', async ({}) => {
    await loginActions.loginFunctions(config.validUser.email, config.validUser.password);
    await expect(authElements.MY_ACCOUNT_H1).toBeVisible();
    await authElements.OPENCART_LOGO.click();
    await expect(productElements.FEATURED_H1).toBeVisible();
    await productElements.NAV_DESKTOPS.click();
    await expect(productElements.NAV_DESKTOPS_H2).toBeVisible();
    await productElements.PRODUCT_PAGE_ADD_TO_CART_BTN.click();
    await expect(productElements.H1_PRODUCT).toBeVisible();
    logger.info('Successfully added product to cart from product page');
  });

  test('should complete guest checkout process', async ({ page }) => {
    const userData = generateUserCheckoutData();
    logger.info('Starting guest checkout process');
    
    const randomIndex = await productActions.addARandomProductFromHomepageToCart();
    await productActions.guestCheckoutFromHomepage(userData);
    await productActions.selectRandomCountry();
    await productActions.selectRandomRegion();
    await productElements.CONTINUE_CO_BTN.click();
    await expect(productElements.SUCCESS_GUEST_USER_INFORMATION).toBeVisible();

    if (randomIndex === 0) {
      await productActions.choosePaymentMethod();
    } else if (randomIndex === 1) {
      await productActions.chooseShippingMethod();
      await productActions.choosePaymentMethod();
    }
    
    await productElements.COMMENT_FIELD_CO.fill("test checkout");
    await page.waitForTimeout(3000);
    await productElements.CONFIRM_ORDER_BTN.click();
    await expect(productElements.SUCCESS_ORDER_H1).toBeVisible();
    await expect(productElements.SUCCESS_ORDER_H1).toHaveText('Your order has been placed!');
    logger.info('Successfully completed guest checkout');
  });

  test('should compare multiple products', async ({}) => {
    await loginActions.loginFunctions(config.validUser.email, config.validUser.password);
    await expect(authElements.MY_ACCOUNT_H1).toBeVisible();
    await authElements.OPENCART_LOGO.click();
    await expect(productElements.FEATURED_H1).toBeVisible();
    
    await productActions.compareRandomProduct();
    await expect(productElements.PRODUCT_COMPARISON_H1).toBeVisible();
    await expect(productElements.PRODUCT_COMPARISON_CONTENT_TABLE).toBeVisible();
    logger.info('Successfully compared products');
  });

  test('should remove single product from cart', async ({}) => {
    await loginActions.loginFunctions(config.validUser.email, config.validUser.password);
    await expect(authElements.MY_ACCOUNT_H1).toBeVisible();
    await authElements.OPENCART_LOGO.click();
    await expect(productElements.FEATURED_H1).toBeVisible();
    
    await productActions.addARandomProductFromHomepageToCart();
    await productActions.CheckRemoveAProductFromCart();
    logger.info('Successfully removed single product from cart');
  });

  test('should remove multiple products from cart', async ({}) => {
    await loginActions.loginFunctions(config.validUser.email, config.validUser.password);
    await expect(authElements.MY_ACCOUNT_H1).toBeVisible();
    await authElements.OPENCART_LOGO.click();
    await expect(productElements.FEATURED_H1).toBeVisible();
    
    await productActions.addMultipleProductsFromHomepageToCart(2);
    await productActions.CheckRemoveProductsFromCart();
    logger.info('Successfully removed multiple products from cart');
  });

  test('should search and find existing products', async ({}) => {
    await loginActions.loginFunctions(config.validUser.email, config.validUser.password);
    await expect(authElements.MY_ACCOUNT_H1).toBeVisible();
    await authElements.OPENCART_LOGO.click();
    await expect(productElements.FEATURED_H1).toBeVisible();
    
    const searchResult = await productActions.searchForProduct();
    logger.info(`Successfully searched for product: ${searchResult}`);
  });

  test('should show not found message for non-existing products', async ({}) => {
    await loginActions.loginFunctions(config.validUser.email, config.validUser.password);
    await expect(authElements.MY_ACCOUNT_H1).toBeVisible();
    await authElements.OPENCART_LOGO.click();
    
    await productActions.searchNonExistingProduct('skincare');
    logger.info('Successfully verified not found message for non-existing product');
  });

  test('should sort products by price low to high', async ({}) => {
    await loginActions.loginFunctions(config.validUser.email, config.validUser.password);
    await expect(productElements.MY_ACCOUNT_H1).toBeVisible();
    await authElements.OPENCART_LOGO.click();
    await expect(productElements.FEATURED_H1).toBeVisible();
    
    await productActions.searchForProduct();
    await productActions.selectSortOption('Price (Low > High)');
    await expect(productElements.PRODUCT_PRICE.first()).toBeVisible();
    
    const prices = await productActions.getAllPrices();
    const sortedAscending = productActions.isSortedAscending(prices);
    expect(sortedAscending).toBeTruthy();
    logger.info('Successfully verified price sorting (low to high)');
  });

  test('should sort products by price high to low', async ({}) => {
    await loginActions.loginFunctions(config.validUser.email, config.validUser.password);
    await expect(productElements.MY_ACCOUNT_H1).toBeVisible();
    await authElements.OPENCART_LOGO.click();
    await expect(productElements.FEATURED_H1).toBeVisible();
    
    await productActions.searchForProduct();
    await productActions.selectSortOption('Price (High > Low)');
    await expect(productElements.PRODUCT_PRICE.first()).toBeVisible();
    
    const prices = await productActions.getAllPrices();
    const sortedDescending = productActions.isSortedDescending(prices);
    expect(sortedDescending).toBeTruthy();
    logger.info('Successfully verified price sorting (high to low)');
  });

  test('should access all sidebar items on product page', async ({}) => {
    await loginActions.loginFunctions(config.validUser.email, config.validUser.password);
    await expect(productElements.MY_ACCOUNT_H1).toBeVisible();
    await productActions.accessAllNavbarMenus(true);
    await productActions.accessAllSidebarMenus();
    logger.info('Successfully accessed all sidebar menus');
});
});