const { chromium } = require('playwright');

(async () => {
  console.log('Starting Playwright test...');
  try {
    const browser = await chromium.launch();
    console.log('Browser launched successfully');
    const page = await browser.newPage();
    await page.goto('https://example.com');
    console.log('Page title:', await page.title());
    await browser.close();
    console.log('Playwright test passed');
  } catch (err) {
    console.error('Playwright test failed:', err);
    process.exit(1);
  }
})();
