// /api/models.js

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  const token = "487f9d3f22584fe60927315cc5955f2cd94ba4e3cecb61abd61740ef288e1006";
  const login = "m.konieczny@amer-pol.com";
  const apiUrl = "https://oferta.amer-pol.com/api/offers/list";

  const { brand } = req.query;
  if (!brand) {
    res.status(400).json({ error: "Brakuje parametru 'brand' w zapytaniu" });
    return;
  }

  const fetchPage = async (page = 1) => {
    const payload = {
      api: { version: 1 },
      account: { login, token },
      data: {
        detaillevel: "full",
        visible: 1,
        sold: 0,
        source: "all",
        page: page,
        limit: 50
      }
    };

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        "User-Agent": "Mozilla/5.0"
      },
      body: JSON.stringify(payload)
    });

    try {
      return await response.json();
    } catch (e) {
      console.error("Błąd parsowania odpowiedzi z FOX API:", e);
      return {};
    }
  };

  try {
    const allModels = new Set();
    const maxPages = 5;

    for (let page = 1; page <= maxPages; page++) {
      const result = await fetchPage(page);
      const offers = Object.values(result?.offers || {});

      for (const offer of offers) {
        if ((offer.id_make || '').toLowerCase() === brand.toLowerCase()) {
          const model = offer?.id_model || offer?.model || offer?.title || offer?.description;
          if (typeof model === "string") {
            allModels.add(model.toLowerCase());
          }
        }
      }
    }

    const modelList = Array.from(allModels).sort();
    res.status(200).json(modelList);
  } catch (error) {
    console.error("Błąd końcowy w /api/models:", error);
    res.status(500).json({ error: "Błąd serwera", details: error.message });
  }
}
