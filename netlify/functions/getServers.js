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

      // Vérifie qu'on ignore les lignes d’en-tête
      const name = $(columns[0]).text().trim();
      if (/name/i.test(name)) return;

      // ⚠️ Tu peux ajouter un filtre ici pour "Europe" si nécessaire
      servers.push({
        name,
        region: $(columns[1]).text().trim(),
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
