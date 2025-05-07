
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

    try {
      return await response.json();
    } catch (e) {
      console.error("Nie udało się sparsować odpowiedzi JSON z FOX API:", e);
      return {};
    }
  };

  try {
    const allBrands = new Set();
    const maxPages = 3;
    for (let page = 1; page <= maxPages; page++) {
      const result = await fetchPage(page);

      if (!result || !result.offers) {
        console.warn("Brak danych z FOX na stronie", page);
        break;
      }

      const offers = Object.values(result.offers || []);
      console.log(`Strona ${page}: znaleziono ${offers.length} ofert`);

      for (let i = 0; i < offers.length; i++) {
        const offer = offers[i];
        if (i === 0) {
          console.log("Przykładowa oferta:", JSON.stringify(offer, null, 2));
        }
        const make = offer?.id_make;
        console.log("Znaleziono markę:", make);
        if (typeof make === "string") {
          allBrands.add(make.toLowerCase());
        }
      }
    }

    const brandList = Array.from(allBrands).sort();
    console.log("Zebrano marek:", brandList.length);
    res.status(200).json(brandList);
  } catch (error) {
    console.error("Błąd końcowy w /api/brands:", error);
    res.status(500).json({ error: "Błąd serwera", details: error.message });
  }
}
