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
      limit: 100
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

    const apiData = await response.json();
    const offers = Object.values(apiData?.offers || {});
    const processedOffers = offers.map(offer => ({
      id: offer.id,
      data: {
        id_make: offer.id_make || null,
        id_model: offer.id_model || null,
        yearproduction: offer.yearproduction || null,
        mileage: offer.mileage || null,
        power: offer.power || null,
        price: offer.price || null,
        mainimage: offer.mainimage || null,
        id_kategoria: offer.id_kategoria || null
      }
    }));

    res.status(200).json({ full: processedOffers });
  } catch (error) {
    console.error("Błąd proxy FOX:", error);
    res.status(500).json({ error: "Błąd serwera proxy", details: error.message });
  }
}
