const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Routes API
app.use('/api/routes', require('./server/routes/routes'));

// Serve static files
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/routes', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'routes.html'));
});

app.get('/route/:id', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'route-details.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`Cycling Companion server running on http://localhost:${PORT}`);
});