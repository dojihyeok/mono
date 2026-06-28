const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('file:///Users/yunhyeok/mono/web/public/strategy.html');
  const result = await page.evaluate(() => {
    openBigModal('/images/tech_blue_worker.png', 'Test', 'Test');
    const dialog = document.getElementById('lightbox');
    return {
      open: dialog.open,
      display: window.getComputedStyle(dialog).display,
      visibility: window.getComputedStyle(dialog).visibility,
      opacity: window.getComputedStyle(dialog).opacity,
      width: dialog.offsetWidth,
      height: dialog.offsetHeight
    };
  });
  console.log(result);
  await browser.close();
})();
