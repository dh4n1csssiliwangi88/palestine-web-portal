const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = 3000; // You can change the port if needed

app.use(cors());

app.get('/fetch-news', async (req, res) => {
    const url = 'https://feeds.bbci.co.uk/news/world/middle_east/rss.xml'; // Testing with BBC News

    try {
        const response = await axios.get(url);
        res.set('Content-Type', 'application/xml');
        res.send(response.data);
    } catch (error) {
        console.error('Error fetching news:', error.message);
        res.status(500).send('Error fetching news');
    }
});

app.listen(PORT, () => {
    console.log(`RSS Proxy server running on http://localhost:${PORT}`);
});
