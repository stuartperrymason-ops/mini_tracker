// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

// ✅ Connect to MongoDB: Mini_Tracker
mongoose.connect('mongodb://localhost:27017/Mini_Tracker', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ Connected to MongoDB: Mini_Tracker'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// 🔄 Clear model cache to force schema reload
delete mongoose.connection.models['Figure'];

// ✅ Define schema with all fields
const figureSchema = new mongoose.Schema({
  name: { type: String, required: true },
  game: { type: String, required: true },
  army: { type: String, required: true },
  status: { type: String, required: true },
  imageUrl: { type: String, default: "" },
  createdAt: { type: Date, default: Date.now }
}, { collection: 'figures' }); // 👈 New collection name

const Figure = mongoose.model('Figure', figureSchema);

// 🔧 Middleware
app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());

// 🧭 Logging
app.use((req, res, next) => {
  console.log(`➡️ ${req.method} ${req.url}`);
  next();
});

// 📥 POST: Add a new figure
app.post('/api/figures', async (req, res) => {
  console.log('📦 POST /api/figures hit');
  console.log('📦 req.body:', req.body);
  console.log('🧬 Active schema fields:', Object.keys(Figure.schema.paths));

  const { name, game, army, status } = req.body;

  try {
    const fig = await Figure.create({ name, game, army, status });
    console.log('✅ Saved figure:', fig);
    res.status(201).json(fig.toObject());
  } catch (err) {
    console.error('❌ Error saving figure:', err);
    res.status(400).json({ error: 'Invalid data or missing fields' });
  }
});

// 📤 GET: All figures
app.get('/api/figures', async (req, res) => {
  const figs = await Figure.find();
  res.json(figs);
});

// 📊 GET: Stats summary
app.get('/api/figures/stats', async (req, res) => {
  const total = await Figure.countDocuments();
  const statusCounts = await Figure.aggregate([
    { $group: { _id: "$status", count: { $sum: 1 } } }
  ]);
  res.json({ total, statusCounts });
});

// 🚀 Start server
app.listen(3000, () => console.log('🌍 Server running on http://localhost:3000'));