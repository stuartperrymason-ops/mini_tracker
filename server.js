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

// GET: All figures with optional filters
app.get('/api/figures', async (req, res) => {
  const { gameSystem, army } = req.query;
  const filter = {};
  if (gameSystem) filter.gameSystem = gameSystem;
  if (army) filter.army = army;

  const figs = await Figure.find(filter);
  res.json(figs);
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

// GET: Status breakdown
app.get('/api/figures/stats', async (req, res) => {
  try {
    const statusGroups = await Figure.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } }
    ]);

    const total = await Figure.countDocuments();

    const counts = statusGroups.reduce((acc, group) => {
      acc[group._id] = group.count;
      return acc;
    }, {});

    res.json({
      total,
      printed: counts['Printed'] || 0,
      primed: counts['Primed'] || 0,
      painted: counts['Painted'] || 0,
      ready: counts['Ready for game'] || 0
    });
  } catch (err) {
    console.error('❌ Error in stats route:', err);
    res.status(500).json({ error: 'Failed to generate stats' });
  }
});
// GET: Export figures as CSV
const { Parser } = require('json2csv');

app.get('/api/figures/export', async (req, res) => {
  const figures = await Figure.find().lean();

  const fields = [
    'name',
    'modelCount',
    'army',
    'gameSystem',
    'status',
    'fileUrl',
    'createdAt'
  ];

  const parser = new Parser({ fields });
  const csv = parser.parse(figures);

  res.header('Content-Type', 'text/csv');
  res.attachment('miniatures.csv');
  res.send(csv);
});




// PUT: Update fileUrl
app.put('/api/figures/:id/file', async (req, res) => {
  try {
    const fig = await Figure.findByIdAndUpdate(
      req.params.id,
      { fileUrl: req.body.fileUrl },
      { new: true }
    );
    res.json(fig);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT: Batch update status and/or fileUrl
app.put('/api/figures/batch', async (req, res) => {
  const { ids, status, fileUrl } = req.body;

  const update = {};
  if (status) update.status = status;
  if (fileUrl) update.fileUrl = fileUrl;

  try {
    const result = await Figure.updateMany(
      { _id: { $in: ids } },
      { $set: update }
    );
    res.json({ updated: result.modifiedCount });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});



// Start server
app.listen(3000, () => console.log('🌍 Server running on http://localhost:3000'));

app.use((req, res) => {
  res.status(404).send(`❌ Route not found: ${req.method} ${req.url}`);
});