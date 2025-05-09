// api/offers.js

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { filters = {}, page = 1 } = req.body;

  const foxApiUrl = "https://oferta.amer-pol.com/api/offers/list";

  const body = {
    api: {
      version: 1
    },
    account: {
      login: process.env.FOX_LOGIN, // ustaw te zmienne w Vercel jako sekretne
      token: process.env.FOX_TOKEN
    },
    data: {
      ...filters,
      page,
      limit: 50,
      visible: 1,
      sold: 0,
      source: "my",
      detaillevel: "all"
    }
  };

  try {
    const response = await fetch(foxApiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "Mozilla/5.0 (compatible; amerpolautocentrum/1.0)"
      },
      body: JSON.stringify(body)
    });

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error("Błąd komunikacji z FOX API:", error);
    res.status(500).json({ error: "Błąd połączenia z FOX API" });
  }
}
