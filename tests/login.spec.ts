import { test, expect } from '@playwright/test';
import LoginActions from '../pages/actions/login-actions';
import AuthElements from '../pages/locators/auth-page-elements';
import config from '../app-config/config.json';
import { logger } from '../utils/logger/logger';

/**
 * Login test scenarios for Opencart application
 * Tests covering login functionality including positive and negative cases
 */

test.describe('Login Functionality Tests', () => {
  let loginActions: LoginActions;
  let authElements: AuthElements;

  test.beforeEach(async ({ page }) => {
    loginActions = new LoginActions(page);
    authElements = new AuthElements(page);
    await loginActions.gotoAsync(config.baseURL);
    await expect(page).toHaveTitle(/Resist Store/, { timeout: 10000 });
  });

  test.describe('Positive Scenarios', () => {
    test('should successfully login with valid credentials', async ({}) => {
      await loginActions.loginFunctions(config.validUser.email, config.validUser.password);
      await expect(authElements.MY_ACCOUNT_H1).toBeVisible();
    });

    test('should successfully reset password and login', async ({}) => {
      const email = 'qahucyc@mailinator.com';
      await loginActions.forgottenPassword(email);
      const newPassword = await loginActions.resetPassword();
      await expect(authElements.SUCCESS_FORGOT_PASSWORD).toBeVisible();
      await loginActions.loginFunctions(email, newPassword);
      await expect(authElements.MY_ACCOUNT_H1).toBeVisible();
    });

    test('should redirect to Register Page from login', async ({}) => {
      await loginActions.goToLoginPage();
      await expect(authElements.REGISTER_ACCOUNT_H1).toBeVisible();
    });

    test('should successfully logout after login', async ({}) => {
      await loginActions.loginFunctions(config.validUser.email, config.validUser.password);
      await expect(authElements.MY_ACCOUNT_H1).toBeVisible();
      await loginActions.logoutFunction();
      await expect(authElements.SUCCESSFULLY_LOGOUT_H1).toBeVisible();
    });
  });

  test.describe('Negative Scenarios', () => {
    test('should not login with unregistered credentials', async ({}) => {
      await loginActions.loginFunctions('yz@mailinator.com', 'ngadmin');
      await expect(authElements.ERROR_ALERT).toBeVisible();
    });

    test('should not reset password with unregistered email', async ({}) => {
      await loginActions.forgottenPassword('admin@aaaa.com');
      await expect(authElements.FAILED_FORGOT_PASSWORD).toBeVisible();
    });

    test('should not login with incorrect password', async ({}) => {
      await loginActions.loginFunctions(config.validUser.email, 'wrongpassword');
      await expect(authElements.ERROR_ALERT).toBeVisible();
    });

    test('should not login with invalid email format', async ({}) => {
      await loginActions.loginFunctions('invalid@email', config.validUser.password);
      await expect(authElements.ERROR_ALERT).toBeVisible();
    });

    test('should not login with empty credentials', async ({}) => {
      await loginActions.loginFunctions('', '');
      await expect(authElements.ERROR_ALERT).toBeVisible();
    });
  });
});
