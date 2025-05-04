const fetch = require('node-fetch');

       module.exports = async (req, res) => {
           const apiUrl = 'https://44fox.com/m/openapi';
           const apiKey = process.env.API_KEY; // Token z zmiennej środowiskowej

           // Dodaj nagłówki CORS
           res.setHeader('Access-Control-Allow-Origin', '*');
           res.setHeader('Access-Control-Allow-Methods', 'POST');
           res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

           try {
               const response = await fetch(apiUrl, {
                   method: 'POST',
                   headers: {
                       'Content-Type': 'application/json',
                       'Authentication': `Bearer ${apiKey}`
                   },
                   body: JSON.stringify(req.body)
               });

               if (!response.ok) {
                   throw new Error(`Błąd API: ${response.status} ${response.statusText}`);
               }

               const data = await response.json();
               res.status(200).json(data);
           } catch (error) {
               console.error('Błąd:', error.message);
               res.status(500).json({ error: 'Błąd serwera', details: error.message });
           }
       };