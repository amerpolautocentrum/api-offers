const fetch = require('node-fetch');

module.exports = async (req, res) => {
    const apiUrl = 'https://44fox.com/m/openapi';

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authentication': `Bearer ${req.body.account.token}`
            },
            body: JSON.stringify(req.body)
        });

        if (!response.ok) {
            throw new Error('Błąd API');
        }

        const data = await response.json();
        res.status(200).json(data);
    } catch (error) {
        console.error('Błąd:', error);
        res.status(500).json({ error: 'Błąd serwera' });
    }
};