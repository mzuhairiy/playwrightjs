import { test, expect } from '@playwright/test';
import ResistStorePage from '../page-objects/actions/main-actions';
import PageElements from '../page-objects/locators/main-page-elements';
import config from '../app-config/config.json';

test.describe('Login Scenarios POM', () => {
  let actions: ResistStorePage;
  let locators: PageElements;

  test.beforeEach(async ({ page }) => {
    actions = new ResistStorePage(page);
    locators = new PageElements(page);
    await actions.gotoAsync(config.baseURL);
    await expect(page).toHaveTitle(/Resist Store/);
  });

  test('User should be able to access all menus on the navbar', async ({}) => {
    await actions.loginFunctions(config.validUser.email, config.validUser.password);
    await expect(locators.MY_ACCOUNT_H1).toBeVisible();
    await actions.accessAllNavbarMenus();
  });

  test('User should be able to access all menus on the footer', async ({}) => {
    await actions.loginFunctions(config.validUser.email, config.validUser.password);
    await expect(locators.MY_ACCOUNT_H1).toBeVisible();
    await actions.accessAllFooterMenus();
  });
});
