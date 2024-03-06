const { test } = require('@playwright/test');
const MCR = require('monocart-coverage-reports');

test('e2e test', async ({ page }) => {

    await Promise.all([
        page.coverage.startJSCoverage({
            resetOnNavigation: false
        }),
        page.coverage.startCSSCoverage({
            resetOnNavigation: false
        })
    ]);

    await page.goto('/');

    const [jsCoverage, cssCoverage] = await Promise.all([
        page.coverage.stopJSCoverage(),
        page.coverage.stopCSSCoverage()
    ]);
    const coverageData = [... jsCoverage, ... cssCoverage];

    const coverageReport = MCR({

        logging: 'debug',

        name: 'My Coverage Report',
        outputDir: '.temp/coverage-reports',

        entryFilter: {
            '**/vine-ui/**': true,
            '**/vine-ui-app.js': true
        },

        sourceFilter: {
            '**/node_modules/**': false,
            '**/*.vue/**': false,
            '**/*.scss': false,
            '**/*.scss/**': false,
            '**/src/**': true
        },

        sourcePath: {
            'vine-ui/packages/vine-ui/': '',
            'vine-ui-app/packages/vine-ui/': '',
            'vine-ui-app/packages/': ''
        },

        reports: ['v8', 'console-details']
    });
    coverageReport.cleanCache();
    await coverageReport.add(coverageData);
    await coverageReport.generate();


});
