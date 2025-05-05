// Serwer proxy do API 44FOX z pełnym poziomem szczegółowości + dane do filtrów

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
      limit: 50
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

    const foxData = await response.json();

    if (!foxData.offers || Object.keys(foxData.offers).length === 0) {
      return res.status(200).json({ full: [] });
    }

    const offers = Object.values(foxData.offers).slice(0, 6);
    const enriched = offers.map(o => {
      const data = o.data || {};
      return {
        id: o.id,
        data: {
          id_make: data.id_make || null,
          id_model: data.id_model || null,
          yearproduction: data.yearproduction || null,
          price: data.price || null,
          mileage: data.mileage || null,
          power: data.power || null,
          mainimage: data.mainimage || null
        }
      };
    });

    res.status(200).json({ full: enriched });
  } catch (error) {
    console.error("Błąd proxy FOX:", error);
    res.status(500).json({ error: "Błąd serwera proxy", details: error.message });
  }
}
