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

  const { offset = 0, limit = 8 } = req.body;
  const page = Math.floor(offset / limit) + 1;

  const listPayload = {
    api: { version: 1 },
    account: { login, token },
    data: {
      visible: 1,
      sold: 0,
      page,
      limit: 1000
    }
  };

  try {
    const listRes = await fetch(apiListUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json", "User-Agent": "Mozilla/5.0" },
      body: JSON.stringify(listPayload)
    });

    const listData = await listRes.json();
    const all = Object.values(listData.offers || {});
    const selected = all.sort(() => 0.5 - Math.random()).slice(0, limit);

    const full = await Promise.all(
      selected.map(async (offer) => {
        const getPayload = {
          api: { version: 1 },
          account: { login, token },
          id: offer.id
        };

        const getRes = await fetch(apiGetUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json", "User-Agent": "Mozilla/5.0" },
          body: JSON.stringify(getPayload)
        });

        const getData = await getRes.json();
        return getData;
      })
    );

    res.status(200).json({ full });
  } catch (error) {
    console.error("Błąd proxy FOX:", error);
    res.status(500).json({ error: "Błąd serwera proxy", details: error.message });
  }
}
