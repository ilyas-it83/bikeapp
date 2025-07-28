const express = require('express');
const cors = require('cors');
const path = require('path');
const routesAPI = require('./routes/routes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// API Routes
app.use('/api/routes', routesAPI);

// Serve main page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Serve shared route page
app.get('/share/:routeId', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/share.html'));
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`🚴‍♂️ Cycling Companion server running on port ${PORT}`);
  console.log(`📍 Main app: http://localhost:${PORT}`);
  console.log(`🔗 Share routes: http://localhost:${PORT}/share/[route-id]`);
});