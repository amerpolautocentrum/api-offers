
// Zwraca unikalne marki z FOX API, zbierając z kilku stron

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

  const fetchPage = async (page = 1) => {
    const payload = {
      api: { version: 1 },
      account: { login, token },
      data: {
        detaillevel: "full",
        visible: 1,
        sold: 0,
        source: "my",
        page: page,
        limit: 50
      }
    };

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
        "User-Agent": "Mozilla/5.0"
      },
      body: JSON.stringify(payload)
    });

    return await response.json();
  };

  try {
    const allBrands = new Set();
    const maxPages = 10;
    for (let page = 1; page <= maxPages; page++) {
      const result = await fetchPage(page);
      const offers = Object.values(result?.offers || {});
      if (offers.length === 0) break;

      for (const offer of offers) {
        const make = offer?.data?.id_make;
        if (typeof make === "string") {
          allBrands.add(make.toLowerCase());
        }
      }
    }

    res.status(200).json(Array.from(allBrands).sort());
  } catch (error) {
    console.error("Błąd pobierania marek:", error);
    res.status(500).json({ error: "Błąd serwera", details: error.message });
  }
}
