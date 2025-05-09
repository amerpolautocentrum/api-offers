
// api/brands.js

module.exports = async (req, res) => {
  // Dodanie nagłówków CORS
  res.setHeader("Access-Control-Allow-Origin", "*"); // Pozwól na dostęp z każdej domeny
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  // Obsługa zapytania OPTIONS
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  try {
    // Twoja logika do pobierania marek
    const brands = await getBrandsFromAPI();
    res.status(200).json(brands);
  } catch (error) {
    res.status(500).json({ message: "Błąd podczas pobierania marek" });
  }
};
