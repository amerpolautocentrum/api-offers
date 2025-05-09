
  // Bezpieczne pobieranie danych z env variables


  const token = process.env.FOX44_TOKEN;


  const login = process.env.FOX44_LOGIN;


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


      limit: 50


    }


  };



  try {


    const response = await fetch("https://api.44fox.com/offers", {


    const response = await fetch(apiUrl, {

      method: "POST",

      headers: {


        "Authorization": `Bearer ${token}`,

        "Content-Type": "application/json",


        "Authorization": `Bearer ${token}`


        "User-Agent": "Mozilla/5.0"

      },


      body: JSON.stringify({


        account: { login, token },


        data: {


          detaillevel: "basic",


          visible: 1,


          limit: 500 // Większy limit dla pełnej listy filtrów


        }


      })


      body: JSON.stringify(payload)

    });



    const data = await response.json();


    res.status(200).json(data.offers || []);


    


    res.status(response.status).json(data);

  } catch (error) {


    console.error("API Error:", error);


    res.status(500).json({ error: "Failed to fetch offers" });


    console.error("Błąd proxy FOX:", error);


    res.status(500).json({ error: "Błąd serwera proxy", details: error.message });

  }


}


}