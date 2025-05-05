// Serwer proxy do API 44FOX z pełnym poziomem szczegółowości

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  const token = "021990a9e67cfd35389f867fc0cf5ee4322ca152407e35264fb01186d578cd8b";
  const login = "m.konieczny@amer-pol.com";
  const apiUrl = "https://oferta.amer-pol.com/api/offers/list";

  const { filters = {} } = req.body;

  const payload = {
    api: {
      version: 1
    },
    account: {
      login: login,
      token: token
    },
    data: {
      detaillevel: "full",
      visible: 1,
      sold: 0,
      source: "my",
      page: 1,
      limit: 200,
      ...filters // dynamiczne filtry z frontend
    }
  };

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
        "User-Agent": "Mozilla/5.0"
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    console.error("Błąd proxy FOX:", error);
    res.status(500).json({ error: "Błąd serwera proxy", details: error.message });
  }
}
