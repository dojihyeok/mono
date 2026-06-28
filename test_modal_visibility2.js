const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('file:///Users/yunhyeok/mono/web/public/strategy.html');
  const result = await page.evaluate(() => {
    const dialog = document.getElementById('si-investment-modal');
    dialog.showModal();
    return {
      open: dialog.open,
      display: window.getComputedStyle(dialog).display,
      width: dialog.offsetWidth,
      height: dialog.offsetHeight
    };
  });
  console.log(result);
  await browser.close();
})();
