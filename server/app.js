const express = require('express');
const cors = require('cors');
const path = require('path');
const badgeRoutes = require('./routes/badges');
const activityRoutes = require('./routes/activities');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// API Routes
app.use('/api/badges', badgeRoutes);
app.use('/api/activities', activityRoutes);

// Serve frontend
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

app.listen(PORT, () => {
  console.log(`🚴 Cycling Companion App running on port ${PORT}`);
  console.log(`Open http://localhost:${PORT} to view the app`);
});

module.exports = app;