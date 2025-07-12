const fs = require("fs");
const path = require("path");
const { chromium } = require("playwright");

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto("https://throneandliberty.gameslantern.com/server-status", { waitUntil: "networkidle" });

  const servers = await page.$$eval("table tbody tr", rows =>
    rows.map(row => {
      const cols = row.querySelectorAll("td");
      return {
        name: cols[0]?.innerText.trim(),
        region: cols[1]?.innerText.trim(),
        status: cols[2]?.innerText.trim(),
        population: cols[3]?.innerText.trim(),
        weather: cols[4]?.innerText.trim(),
      };
    })
  );

  await browser.close();

  // Sauvegarde avec timestamp et encodage UTF-8
  const output = {
    servers,
    generatedAt: new Date().toISOString(),
  };

  fs.writeFileSync(
    path.join(__dirname, "server-status.json"),
    JSON.stringify(output, null, 2),
    "utf8"
  );

  console.log(`✅ ${servers.length} serveurs exportés dans server-status.json`);
})();
