const fs = require("fs");
const { chromium } = require("playwright");

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto("https://throneandliberty.gameslantern.com/server-status");

  const servers = await page.$$eval("table tbody tr", rows =>
    rows.map(row => {
      const columns = row.querySelectorAll("td");
      const name = columns[0]?.textContent.trim();
      if (/name/i.test(name)) return null;
      return {
        name,
        region: columns[1]?.textContent.trim(),
        status: columns[2]?.textContent.trim(),
        population: columns[3]?.textContent.trim(),
        weather: columns[4]?.textContent.trim()
      };
    }).filter(Boolean)
  );

  await browser.close();

  // ✅ Bien écrire le JSON pur
  fs.writeFileSync("server-status.json", JSON.stringify({ servers }, null, 2));
})();
