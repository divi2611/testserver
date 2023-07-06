const express = require('express');
const app = express();
const bodyParser = require('body-parser');
require('isomorphic-fetch');
require('dotenv').config();
const cors = require('cors');

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

// Set Content Security Policy headers
app.use((req, res, next) => {
  res.setHeader('Content-Security-Policy', "default-src 'self'; font-src 'self' data:; style-src 'self' 'unsafe-inline'");
  next();
});

// API endpoint for making the request
app.all('/api/request', (req, res) => {
  const userInput = req.body.userInput;
  const activeCharID = req.body.activeCharID;
  
  
  const url = 'https://api.convai.com/character/getResponse';
  var payload = {
    userText: userInput,
    charID: activeCharID,
    sessionID: '-1',
    voiceResponse: 'True'
  };
  var headers = {
    'Content-Type': 'application/x-www-form-urlencoded',
    'CONVAI-API-KEY': process.env.REACT_APP_CONVAI_API_KEY
  };

  var encodedPayload = Object.keys(payload)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(payload[key])}`)
    .join('&');

  fetch(url, {
    method: 'POST',
    headers: headers,
    body: encodedPayload
  })
    .then(response => response.json())
    .then(data => {
      res.json(data);
    })
    .catch(error => {
      console.error('Error:', error);
      res.status(500).json({ error: 'An error occurred' });
    });
});

// Start the server
const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
