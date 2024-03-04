const { defineConfig, devices } = require('@playwright/test');

const baseURL = 'http://localhost:8080/';

module.exports = defineConfig({
    use: {
        baseURL
    },

    webServer: {
        command: 'sf dev app --silent',
        url: baseURL,
        reuseExistingServer: !process.env.CI
    },

    projects: [{
        name: 'chromium',
        use: {
            ... devices['Desktop Chrome']
        }
    }]
});
