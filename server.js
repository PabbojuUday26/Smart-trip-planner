require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware setup
app.use(cors());
app.use(express.json());

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Amadeus API credentials from environment variables
const AMADEUS_API_KEY = process.env.AMADEUS_API_KEY;
const AMADEUS_API_SECRET = process.env.AMADEUS_API_SECRET;

// Verify environment variables
console.log('API Key:', process.env.AMADEUS_API_KEY ? 'Loaded' : 'Missing');
console.log('API Secret:', process.env.AMADEUS_API_SECRET ? 'Loaded' : 'Missing');

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    message: 'Server is running',
    envStatus: {
      apiKey: AMADEUS_API_KEY ? 'Configured' : 'Missing',
      apiSecret: AMADEUS_API_SECRET ? 'Configured' : 'Missing'
    }
  });
});

// Get access token from Amadeus
async function getAmadeusToken() {
  try {
    const response = await axios.post('https://test.api.amadeus.com/v1/security/oauth2/token', 
      `grant_type=client_credentials&client_id=${AMADEUS_API_KEY}&client_secret=${AMADEUS_API_SECRET}`,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    );
    return response.data.access_token;
  } catch (error) {
    console.error('Error getting Amadeus token:', error.response?.data || error.message);
    throw new Error('Failed to get Amadeus access token');
  }
}

// Get city coordinates
app.post('/api/locations', async (req, res) => {
  try {
    const { city } = req.body;
    
    if (!city || typeof city !== 'string') {
      return res.status(400).json({ error: 'Valid city name is required' });
    }

    const token = await getAmadeusToken();
    
    const response = await axios.get(`https://test.api.amadeus.com/v1/reference-data/locations`, {
      params: {
        keyword: city,
        subType: 'CITY',
        view: 'LIGHT'
      },
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    
    res.json(response.data.data || []);
  } catch (error) {
    console.error('Error fetching locations:', error.response?.data || error.message);
    const status = error.response?.status || 500;
    res.status(status).json({ 
      error: 'Failed to fetch locations',
      details: error.response?.data || error.message
    });
  }
});

// Get hotel offers
app.post('/api/hotels', async (req, res) => {
  try {
    const { latitude, longitude, checkInDate, checkOutDate, adults } = req.body;
    
    // Input validation
    if (!latitude || !longitude || !checkInDate || !checkOutDate || !adults) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }

    const token = await getAmadeusToken();
    
    const response = await axios.get(`https://test.api.amadeus.com/v2/shopping/hotel-offers`, {
      params: {
        latitude,
        longitude,
        radius: 25,
        radiusUnit: 'KM',
        checkInDate,
        checkOutDate,
        adults,
        ratings: '3,4,5',
        sort: 'NONE',
        view: 'FULL'
      },
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    
    res.json(response.data.data || []);
  } catch (error) {
    console.error('Error fetching hotels:', error.response?.data || error.message);
    const status = error.response?.status || 500;
    res.status(status).json({ 
      error: 'Failed to fetch hotels',
      details: error.response?.data || error.message
    });
  }
});

// Handle 404 for API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({ error: 'API endpoint not found' });
});

// Serve index.html for all other routes (for SPA)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Access the app at http://localhost:${PORT}`);
  console.log('Environment Status:', {
    apiKey: AMADEUS_API_KEY ? '***' + AMADEUS_API_KEY.slice(-4) : 'Missing',
    apiSecret: AMADEUS_API_SECRET ? '***' + AMADEUS_API_SECRET.slice(-4) : 'Missing'
  });
});