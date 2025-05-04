const fetch = require('node-fetch');

module.exports = async (req, res) => {
    const url = 'https://44fox.com/m/openapi';
    const apiKey = process.env.API_KEY;

    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Handle OPTIONS request
    if (req.method === 'OPTIONS') {
        res.status(204).send('');
        return;
    }

    // Check for POST method
    if (req.method !== 'POST') {
        res.status(405).json({ error: 'Method Not Allowed' });
        return;
    }

    // Check API_KEY
    if (!apiKey) {
        res.status(500).json({ error: 'API_KEY is missing' });
        return;
    }

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authentication': `Bearer ${apiKey}`
            },
            body: JSON.stringify(req.body || {})
        });

        if (!response.ok) {
            throw new Error(`Błąd HTTP: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};