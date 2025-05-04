
export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  const token = "021990a9e67cfd35389f867fc0cf5ee4322ca152407e35264fb01186d578cd8b";
  const email = "m.konieczny@amer-pol.com";
  const apiUrl = "https://oferta.amer-pol.com/api/offers/list";

  const payload = {
    api: { version: 1 },
    account: { login: email, token: token },
    data: {
      visible: 1,
      sold: 0,
      detaillevel: "simple",
      source: "my",
      page: 1,
      limit: 50
    }
  };

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "Mozilla/5.0"
      },
      body: JSON.stringify(payload)
    });

    const json = await response.json();
    console.log("=== Odpowiedź z FOX ===", JSON.stringify(json, null, 2));

    const offers = Object.values(json.offers || {});
    res.status(200).json({ full: offers });
  } catch (err) {
    console.error("Błąd proxy FOX:", err);
    res.status(500).json({ error: "Błąd proxy FOX", details: err.message });
  }
}
