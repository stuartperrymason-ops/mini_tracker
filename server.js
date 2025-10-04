// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/miniatures', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ Connected to MongoDB'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// Clear model cache (important if schema was changed during dev)
delete mongoose.connection.models['Miniature'];

// Mongoose schema
const miniatureSchema = new mongoose.Schema({
  name: { type: String, required: true },
  game: { type: String, required: true },
  army: { type: String, required: true },
  status: { type: String, required: true },
  imageUrl: String,
  createdAt: { type: Date, default: Date.now }
});

const Miniature = mongoose.model('Miniature', miniatureSchema);

// Middleware
app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());

// Logging
app.use((req, res, next) => {
  console.log(`➡️ ${req.method} ${req.url}`);
  next();
});

// Routes
app.get('/api/miniatures', async (req, res) => {
  const minis = await Miniature.find();
  res.json(minis);
});

app.get('/api/miniatures/stats', async (req, res) => {
  const total = await Miniature.countDocuments();
  const statusCounts = await Miniature.aggregate([
    { $group: { _id: "$status", count: { $sum: 1 } } }
  ]);
  res.json({ total, statusCounts });
});

app.post('/api/miniatures', async (req, res) => {
  console.log('📦 Incoming req.body:', req.body);
  const { name, game, army, status } = req.body;

  try {
    const mini = await Miniature.create({ name, game, army, status });
    res.status(201).json(mini.toObject());
  } catch (err) {
    console.error('❌ Error saving miniature:', err);
    res.status(400).json({ error: 'Invalid data or missing fields' });
  }
});

// Start server
app.listen(3000, () => console.log('🚀 Server running on http://localhost:3000'));