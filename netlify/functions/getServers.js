exports.handler = async function () {
  try {
    const res = await fetch("https://raw.githubusercontent.com/axsddlr/ThroneLiberty_api/main/server-status.json");
    const raw = await res.text();

    // 🔒 Vérifie que le texte est bien du JSON
    let data;
    try {
      data = JSON.parse(raw);
    } catch (err) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "Réponse non valide", details: raw.substring(0, 100) })
      };
    }

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    };

  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Erreur serveur", details: err.message })
    };
  }
};
