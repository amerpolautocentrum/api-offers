export default async function handler(req, res) {
  // Konfiguracja CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();

  // Bezpieczne pobieranie danych z env variables
  const token = process.env.FOX44_TOKEN;
  const login = process.env.FOX44_LOGIN;

  try {
    const response = await fetch("https://api.44fox.com/offers", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({
        account: { login, token },
        data: {
          detaillevel: "basic",
          visible: 1,
          limit: 500 // Większy limit dla pełnej listy filtrów
        }
      })
    });

    const data = await response.json();
    res.status(200).json(data.offers || []);
    
  } catch (error) {
    console.error("API Error:", error);
    res.status(500).json({ error: "Failed to fetch offers" });
  }
}