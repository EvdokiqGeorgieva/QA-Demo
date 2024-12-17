const { test, expect } = require('@playwright/test');
const locators = require('./locators.js');
const { URL, USERS, MESSAGES } = require('./constants.js');

test.describe('Login Page UI Tests', () => {
    test('login form is displayed', async ({ page }) => {
        await page.goto(URL.LOGIN_URL);
        await expect(page.locator(locators.loginForm)).toBeVisible();
        await expect(page.locator(locators.usernameInput)).toBeVisible();
        await expect(page.locator(locators.passwordInput)).toBeVisible();
        await expect(page.locator(locators.submitButton)).toBeVisible();
    });

    test('login successfully with valid credentials', async ({ page }) => {
        await page.goto(URL.LOGIN_URL);
        await page.fill(locators.usernameInput, USERS.VALID_USER.USERNAME);
        await page.fill(locators.passwordInput, USERS.VALID_USER.PASSWORD);
        await page.click(locators.submitButton);

        await expect(page.locator(locators.responseMessage)).toHaveText(MESSAGES.LOGIN_SUCCESSFUL);
    });

    test('display error message on login with invalid credentials', async ({ page }) => {
        await page.goto(URL.LOGIN_URL);
        await page.fill(locators.usernameInput, USERS.INVALID_USER.USERNAME);
        await page.fill(locators.passwordInput, USERS.INVALID_USER.PASSWORD);
        await page.click(locators.submitButton);

        await expect(page.locator(locators.responseMessage)).toHaveText(MESSAGES.INVALID_CREDENTIALS);
    });
});
