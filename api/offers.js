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
  const apiListUrl = "https://oferta.amer-pol.com/api/offers/list";
  const apiGetUrl = "https://oferta.amer-pol.com/api/offers/get";

  try {
    const listResponse = await fetch(apiListUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "Mozilla/5.0"
      },
      body: JSON.stringify({
        api: { version: 1 },
        account: { login, token },
        data: {
          visible: 1,
          sold: 0,
          page: 1,
          limit: 1000
        }
      })
    });

    if (!listResponse.ok) {
      throw new Error(`Błąd przy pobieraniu listy ofert: ${listResponse.status}`);
    }

    const listData = await listResponse.json();
    const allOffers = Object.values(listData.offers || {});
    const selected = allOffers.sort(() => 0.5 - Math.random()).slice(0, 8);

    const fullOffers = await Promise.all(
      selected.map(async (offer) => {
        try {
          const detailResponse = await fetch(apiGetUrl, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "User-Agent": "Mozilla/5.0"
            },
            body: JSON.stringify({
              api: { version: 1 },
              account: { login, token },
              id: offer.id
            })
          });

          if (!detailResponse.ok) {
            console.warn("Nie udało się pobrać oferty:", offer.id);
            return null;
          }

          const detailData = await detailResponse.json();
          return detailData;
        } catch (err) {
          console.error("Błąd pobierania szczegółów oferty:", err);
          return null;
        }
      })
    );

    const filtered = fullOffers.filter(x => x !== null);
    res.status(200).json({ full: filtered });
  } catch (err) {
    console.error("Błąd główny w handlerze:", err);
    res.status(500).json({ error: "Błąd serwera proxy", details: err.message });
  }
}
