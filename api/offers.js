// api/offers.js

module.exports = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*"); // Pozwól na dostęp z każdej domeny
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  // Obsługa zapytania OPTIONS
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  try {
    // Używamy poprawnego endpointu do pobrania parametrów
    const response = await fetch("https://sandbox.44fox.com/api/offers/parameters");
    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error("Błąd podczas pobierania parametrów ofert:", error);
    res.status(500).json({ message: "Błąd podczas pobierania danych" });
  }
};
