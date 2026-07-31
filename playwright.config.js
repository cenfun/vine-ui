import { defineConfig, devices } from '@playwright/test';

const baseURL = 'http://localhost:8080/';

export default defineConfig({
    use: {
        baseURL
    },

    outputDir: '.temp/e2e',

    webServer: {
        command: 'npx vite --port 8080',
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
