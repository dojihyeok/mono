const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });
  await page.goto('file:///Users/yunhyeok/mono/web/public/strategy.html');
  await page.evaluate(() => {
    openBigModal('/images/tech_blue_worker.png', 'Test', 'Test');
  });
  await page.screenshot({ path: 'modal_test.png' });
  await browser.close();
})();
