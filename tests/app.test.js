const { test } = require('@playwright/test');
const MCR = require('monocart-coverage-reports');
const CDPClient = MCR.CDPClient;

test('e2e test', async ({ page }) => {

    const session = await page.context().newCDPSession(page);
    const client = await CDPClient({
        session
    });

    await client.startCoverage();

    await page.goto('/');

    const coverageData = await client.stopCoverage();

    // add url for anonymous
    let anonymous = 1;
    coverageData.forEach((it) => {
        if (!it.url) {
            it.url = `anonymous-${anonymous++}`;
        }
    });


    await client.close();

    const coverageReport = MCR({

        // logging: 'debug',

        name: 'My Coverage Report',
        outputDir: '.temp/coverage-reports',

        entryFilter: {
            '**/anonymous-*': true,
            '**/vine-ui/**': true,
            '**/vine-ui-app.js': true
        },

        sourceFilter: {
            '**/node_modules/**': false,
            '**/*.vue/**': false,
            '**/*.scss': false,
            '**/*.scss/**': false,
            'vue?': false,
            '**/src/**': true
        },

        sourcePath: {
            'vine-ui/packages/vine-ui/': '',
            'vine-ui-app/packages/vine-ui/': '',
            'vine-ui-app/packages/': ''
        },

        reports: [
            ['console-details', {
                metrics: ['bytes', 'functions']
            }],
            'v8'
        ]
    });
    coverageReport.cleanCache();
    await coverageReport.add(coverageData);
    await coverageReport.generate();


});
