// api/offers.js

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET");

  const token = "021990a9e67cfd35389f867fc0cf5ee4322ca152407e35264fb01186d578cd8b";
  const baseUrl = "https://oferta.amer-pol.com/m/openapi/offers";

  const {
    offset = 0,
    limit = 8,
    brand,
    model,
    yearFrom,
    yearTo,
    priceMin,
    priceMax
  } = req.query;

  const params = new URLSearchParams();
  params.append("offset", offset);
  params.append("limit", limit);
  if (brand) params.append("brand", brand);
  if (model) params.append("model", model);
  if (yearFrom) params.append("yearFrom", yearFrom);
  if (yearTo) params.append("yearTo", yearTo);
  if (priceMin) params.append("priceFrom", priceMin);
  if (priceMax) params.append("priceTo", priceMax);

  const url = `${baseUrl}?${params.toString()}`;

  try {
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json"
      }
    });

    const text = await response.text(); // czytamy jako tekst, nie JSON
    console.log(">>> Odpowiedź FOX API (raw):", text);

    res.status(response.status).send(text); // przekazujemy ją dalej (nawet jeśli to błąd)
  } catch (error) {
    console.error(">>> Błąd proxy:", error);
    res.status(500).json({ error: "Błąd proxy", details: error.message });
  }
}
