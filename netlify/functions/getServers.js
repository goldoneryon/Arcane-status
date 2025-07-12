const fs = require('fs');
const path = require('path');

exports.handler = async () => {
  try {
    const filePath = path.resolve(__dirname, '../../server-status.json');
    const raw = fs.readFileSync(filePath, 'utf8');
    const data = JSON.parse(raw);

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Erreur de parsing JSON", details: err.message }),
    };
  }
};
