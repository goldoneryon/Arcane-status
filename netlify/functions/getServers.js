exports.handler = async function () {
  try {
    const res = await fetch("https://raw.githubusercontent.com/axsddlr/ThroneLiberty_api/main/server-status.json");
    const raw = await res.text();

    // 🔍 Extraction prudente : recherche le 1er { ou [ dans le texte
    const jsonStart = Math.min(
      ...["{", "["].map(sym => raw.indexOf(sym)).filter(i => i >= 0)
    );

    if (jsonStart === -1) {
      throw new Error("Aucun début JSON trouvé dans la réponse");
    }

    const cleaned = raw.slice(jsonStart).trim();
    const data = JSON.parse(cleaned);

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
      body: JSON.stringify({
        error: "Erreur serveur",
        details: err.message
      })
    };
  }
};

