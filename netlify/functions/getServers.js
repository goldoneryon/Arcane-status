exports.handler = async function () {
  try {
    const res = await fetch("https://throneandliberty.gameslantern.com/api/server-status");
    const data = await res.json();

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
