import { test, expect, request } from '@playwright/test';
import { URL, USERS, MESSAGES } from './constants.js';

test.describe('API Endpoint Tests', () => {
    let apiContext;

    test.beforeAll(async ({ playwright }) => {
        apiContext = await request.newContext({
            baseURL: URL.BASE_URL
        });
    });

    test('login successfully with valid credentials', async () => {
        const response = await apiContext.post(URL.LOGIN_URL, {
            data: { username: USERS.VALID_USER.USERNAME, password: USERS.VALID_USER.PASSWORD}
        });
        expect(response.ok()).toBeTruthy();
        const responseBody = await response.json();
        expect(responseBody.message).toBe(MESSAGES.LOGIN_SUCCESSFUL);
    });

    test('login not successful with incorrect username', async () => {
        const response = await apiContext.post(URL.LOGIN_URL, {
            data: { username: USERS.INVALID_USER.USERNAME, password: USERS.VALID_USER.PASSWORD}
        });
        expect(response.status()).toBe(400);
        const responseBody = await response.json();
        expect(responseBody.message).toBe(MESSAGES.INVALID_CREDENTIALS);
    });

    test('login not successful with incorrect password', async () => {
        const response = await apiContext.post(URL.LOGIN_URL, {
            data: { username: USERS.VALID_USER.USERNAME, password: USERS.INVALID_USER.PASSWORD}
        });
        expect(response.status()).toBe(400);
        const responseBody = await response.json();
        expect(responseBody.message).toBe(MESSAGES.INVALID_CREDENTIALS);
    });

    test.afterAll(async () => {
        await apiContext.dispose();
    });
});
