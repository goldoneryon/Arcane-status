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

    $(".server-card").each((_, el) => {
      const region = $(el).find(".server-region").text().trim();
      if (!region.toLowerCase().includes("europe")) return;

      servers.push({
        name: $(el).find(".server-name").text().trim(),
        region,
        status: $(el).find(".server-status").text().trim(),
        weather: $(el).find(".server-weather").text().trim(),
        population: $(el).find(".server-population").text().trim()
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
