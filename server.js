// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Figure = require('./models/figure');

const app = express();

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/Mini_Tracker')
  .then(() => console.log('✅ Connected to MongoDB: Mini_Tracker'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// Middleware
app.use(cors());
app.use(express.json());

// POST: Add new figure
app.post('/api/figures', async (req, res) => {
  try {
    const fig = await Figure.create(req.body);
    res.status(201).json(fig);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});



// PUT: Update status
app.put('/api/figures/:id/status', async (req, res) => {
  try {
    const fig = await Figure.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    res.json(fig);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// GET: All figures
app.get('/api/figures', async (req, res) => {
  const figs = await Figure.find();
  res.json(figs);
});



app.get('/api/figures/stats', async (req, res) => {
  const statusGroups = await Figure.aggregate([
    { $match: { status: { $in: ['Printed', 'Primed', 'Painted', 'Ready for game'] } } },
    { $group: { _id: "$status", count: { $sum: 1 } } }
  ]);

  // Convert to lookup object
  const counts = statusGroups.reduce((acc, group) => {
    acc[group._id] = group.count;
    return acc;
  }, {});

  res.json({
    printed: counts['Printed'] || 0,
    primed: counts['Primed'] || 0,
    painted: counts['Painted'] || 0,
    ready: counts['Ready for game'] || 0
  });
});




// Start server
app.listen(3000, () => console.log('🌍 Server running on http://localhost:3000'));

app.use((req, res) => {
  res.status(404).send(`❌ Route not found: ${req.method} ${req.url}`);
});
