const cheerio = require("cheerio");
const https = require("https");

exports.handler = async function () {
  try {
    const url = "https://throneandliberty.gameslantern.com/server-status";

    const html = await new Promise((resolve, reject) => {
      https.get(url, res => {
        let data = "";
        res.on("data", chunk => data += chunk);
        res.on("end", () => resolve(data));
      }).on("error", reject);
    });

    const $ = cheerio.load(html);
    const servers = [];

    $("table tbody tr").each((_, el) => {
      const columns = $(el).find("td");
      const region = $(columns[1]).text().trim();

     // TEMP : affiche tous les serveurs pour debug
// if (!region.toLowerCase().includes("europe")) return;

      servers.push({
        name: $(columns[0]).text().trim(),
        region,
        status: $(columns[2]).text().trim(),
        population: $(columns[3]).text().trim(),
        weather: $(columns[4]).text().trim()
      });
    });

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ servers })
    };

  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Erreur serveur", details: err.message })
    };
  }
};
