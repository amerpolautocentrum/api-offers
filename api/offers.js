const fetch = require('node-fetch');

module.exports = async (req, res) => {
    const apiUrl = 'https://44fox.com/m/openapi';
    const apiKey = process.env.API_KEY;

    // Obsługa żądania preflight CORS (OPTIONS)
    if (req.method === 'OPTIONS') {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
        res.status(204).send('');
        return;
    }

    // Sprawdzenie metody POST
    if (req.method !== 'POST') {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.status(405).json({ error: 'Method Not Allowed', details: 'Only POST is supported' });
        return;
    }

    // Sprawdzenie API_KEY
    if (!apiKey) {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.status(500).json({ error: 'Server Configuration Error', details: 'API_KEY is not set' });
        return;
    }

    // Sprawdzenie body żądania
    if (!req.body) {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.status(400).json({ error: 'Bad Request', details: 'Request body is missing' });
        return;
    }

    // Dodaj nagłówki CORS dla żądań POST
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
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.status(500).json({ error: 'Błąd serwera', details: error.message });
    }
};