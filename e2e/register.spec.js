import { test, expect } from '@playwright/test';
import { generateUserCreds } from '../utils/user-data-generator.js';
import ResistStorePage from '../page-objects/actions/main-actions';
import PageElements from '../page-objects/locators/main-page-elements';
import testNameData from '../tests/test-data/register-data-name-validation';
import testPasswordData from '../tests/test-data/register-data-password-validation';
import config from '../app-config/config.json'
import { checkUserDataInDatabase } from '../utils/db-helper.js';
import { getRandomExistingEmail } from '../utils/db-helper.js';
import { faker } from '@faker-js/faker';

test.describe('Register Scenarios POM', () => {
   /** @type {ResistStorePage} */
  let actions;
  /** @type {PageElements} */
  let locators;

  test.beforeEach(async ({ page }) => {
    actions = new ResistStorePage(page);
    locators = new PageElements(page);
    await actions.gotoAsync(config.baseURL)
    await expect(page).toHaveTitle(/Resist Store/);
  });

  test('User should be able to register with valid data', async ({}) => {
    const userCreds = generateUserCreds();
    await actions.registerFunctions(userCreds);
    await expect(locators.REGISTRATION_SUCCESSFUL_TEXT).toBeVisible();
    await locators.REGISTER_CONTINUE_TO_ACCOUNT_BTN.click();
    await expect(locators.MY_ACCOUNT_H1).toBeVisible();

    // Checking database
    const userData = await checkUserDataInDatabase(userCreds.email);
    expect(userData[0].firstname).toBe(userCreds.firstName);
    expect(userData[0].lastname).toBe(userCreds.lastName);
    expect(userData[0].email).toBe(userCreds.email);
    // console.log(`The user has been successfully registered and stored in the database.`);
    // console.log('--------------------------------------------------------------------')
    // console.log(`User Data\nFirst Name: ${userData[0].firstname}\nLast Name: ${userData[0].lastname}\nEmail: ${userData[0].email}`);
  });
  
  test('User should not be able to register with existing email address', async ({}) => {
    const existingEmail = await getRandomExistingEmail();
    const userCreds = generateUserCreds();
    userCreds.email = existingEmail;

    await actions.registerFunctions(userCreds);
    await expect(locators.REGISTRATION_FAILURE_TEXT).toBeVisible();
  });

    // Verify validation name errors are displayed when attempting to register with invalid values.
  testNameData.forEach(({ firstName, lastName, expected, validationField }, index) => {
    test(`Validation name errors ${index + 1}: First Name: "${firstName}", Last Name: "${lastName}"`, async () => {
      const randomEmail = faker.internet.email();
      await actions.registerFunctions({ 
        firstName, 
        lastName, 
        email: randomEmail, 
        password: 'admin1234' 
      });
      await expect(locators[validationField]).toHaveText(expected);
    })
  })

  testPasswordData.forEach(({ password, expected, validationField }, index) => {
    test(`Validation password errors ${index + 1}: Password: "${password}"`, async () => {
      const firstName = faker.person.firstName();
      const lastName = faker.person.lastName();
      await actions.registerFunctions({
        firstName,
        lastName,
        email: faker.internet.email(),
        password
      });
      await expect(locators[validationField]).toHaveText(expected);
    })
  });

  test('User should not be able to register with an invalid email', async ({ page }) => {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    await actions.registerFunctions({
      firstName, 
      lastName, 
      email: 'logan@login',
      password: 'admin1234'
    })
    await expect(locators.EMAIL_WARNING).toBeVisible();
  });

  test('System should display an error for invalid email format', async ({ page }) => {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    await actions.registerFunctions({
      firstName,
      lastName,
      email: 'eee',
      password: 'admin1234'
    });
    const emailField = locators.REGISTER_EMAIL_FIELD;
    const validationMessage = await emailField.evaluate(input => input.validationMessage);
    expect(validationMessage).toContain("Please include an '@' in the email address.");
    });

    test('User should not be able to register with an invalid password', async ({ page }) => {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    await actions.registerFunctions({
      firstName, 
      lastName,
      email: faker.internet.email(),
      password: '123'
    });
  });
});