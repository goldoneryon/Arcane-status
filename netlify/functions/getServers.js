const https = require("https");

exports.handler = async function () {
  try {
    const url = "https://raw.githubusercontent.com/goldoneryon/Arcane-status/main/server-status.json";

    const json = await new Promise((resolve, reject) => {
      https.get(url, res => {
        let data = "";
        res.on("data", chunk => data += chunk);
        res.on("end", () => resolve(data));
      }).on("error", reject);
    });

    const parsed = JSON.parse(json);

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(parsed)
    };

  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Erreur serveur",
        details: err.message
      })
    };
  }
};
