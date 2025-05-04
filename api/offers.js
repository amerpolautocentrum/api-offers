export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    res.status(200).end(); // preflight
    return;
  }

  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const { offset = 0, limit = 8 } = req.body;
  const page = Math.floor(offset / limit) + 1;

  const token = "021990a9e67cfd35389f867fc0cf5ee4322ca152407e35264fb01186d578cd8b";
  const apiUrl = "https://oferta.amer-pol.com/api/offers/list";

  const payload = {
    data: {
      visible: 1,
      sold: 0,
      page: page,
      limit: limit
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
