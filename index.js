const puppeteer = require('puppeteer');
const CONFIG = rquire('./config.json');

// REACTIONS:
// 1 = 😂; 2 = 😮; 3 = 😍; 4 = 😢; 
// 5 = 👏; 6 = 🔥; 7 = 🎉; 8 = 💯;

const escapeXpathString = str => {
    const splitedQuotes = str.replace(/'/g, `', "'", '`);
    return `concat('${splitedQuotes}', '')`;
  };
  
  const clickByText = async (page, text) => {
    const escapedText = escapeXpathString(text);
    const linkHandlers = await page.$x(`//div[contains(text(), ${escapedText})]`);
    
    if (linkHandlers.length > 0) {
      await linkHandlers[0].click();
    } else {
      throw new Error(`Link not found: ${text}`);
    }
  };

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  await page.goto('https://www.instagram.com/accounts/login/', { waitUntil: 'networkidle0' });
  await page.type('input[name="username"]', CONFIG.user);
  await page.type('input[name="password"]', CONFIG.password);
  await page.click('button[type="submit"]');
  await page.waitForNavigation({ waitUntil: 'networkidle0' });
  await page.goto(CONFIG.storie_url, { waitUntil: 'networkidle0' });
  await clickByText(page, `View story`);
  await page.click('button._abl-');

  const reactionSelector = (() => {
    const grid = CONFIG.reaction > 4 ? 2 : 1;
    const item = CONFIG.reaction > 4 ? (CONFIG.reaction-4) : CONFIG.reaction; 
    return `div.x9f619.xjbqb8w.x78zum5.x168nmei.x13lgxp2.x5pf9jr.xo71vjh.x1n2onr6.x1plvlek.xryxfnj.x1c4vz4f.x2lah0s.xdt5ytf.xqjyukv.x6s0dn4.x1oa3qoh.x1nhvcw1 > div > div > div:nth-child(${grid}) > div:nth-child(${item}) > div`;
  })();


  const retro = async () => {
    await new Promise(function(resolve) { 
        setTimeout(resolve, 1000)
    });
    await page.focus("textarea");
    await page.click(reactionSelector);  
    await new Promise(function(resolve) { 
        setTimeout(resolve, 1000)
    });

    await retro();
  }


  await retro();
})();