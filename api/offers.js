// Serwer proxy do API 44FOX z pełnym poziomem szczegółowości — zwraca 6 przykładowych ofert z danymi do filtrów

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  // Przykładowe dane do wyświetlenia i filtrowania
  const offers = [
    {
      id: 986,
      data: {
        id_make: "rolls-royce",
        id_model: "phantom",
        yearproduction: "2005",
        mileage: "113000",
        power: "453",
        price: "239000",
        mainimage: "https://www.amerpolautocentrum.pl/images/phantom.jpg"
      }
    },
    {
      id: 987,
      data: {
        id_make: "rolls-royce",
        id_model: "silver-spur",
        yearproduction: "1986",
        mileage: "104000",
        power: "170",
        price: "55000",
        mainimage: "https://www.amerpolautocentrum.pl/images/silver-spur.jpg"
      }
    },
    {
      id: 988,
      data: {
        id_make: "subaru",
        id_model: "forester",
        yearproduction: "2018",
        mileage: "86000",
        power: "180",
        price: "62000",
        mainimage: "https://www.amerpolautocentrum.pl/images/forester.jpg"
      }
    },
    {
      id: 989,
      data: {
        id_make: "audi",
        id_model: "a4",
        yearproduction: "2019",
        mileage: "73000",
        power: "150",
        price: "69000",
        mainimage: "https://www.amerpolautocentrum.pl/images/a4.jpg"
      }
    },
    {
      id: 990,
      data: {
        id_make: "toyota",
        id_model: "camry",
        yearproduction: "2021",
        mileage: "40000",
        power: "200",
        price: "87000",
        mainimage: "https://www.amerpolautocentrum.pl/images/camry.jpg"
      }
    },
    {
      id: 991,
      data: {
        id_make: "volkswagen",
        id_model: "golf",
        yearproduction: "2017",
        mileage: "95000",
        power: "140",
        price: "48000",
        mainimage: "https://www.amerpolautocentrum.pl/images/golf.jpg"
      }
    }
  ];

  res.status(200).json({ full: offers });
}
