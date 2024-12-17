const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
    testDir: './tests',
    use: {
        baseURL: 'http://localhost:3002',
        headless: true
    }
});
