const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();



mongoose.connect('mongodb://localhost:27017/miniatures')
.then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

const Miniature = mongoose.model('Miniatures', {
  name: String,
  game: String,
  army: String,
  status: String, // e.g. "Unpainted", "Primed", "Painted", "Complete"
  imageUrl: String, // optional: for gallery view
  createdAt: { type: Date, default: Date.now }
});

app.use(cors({
  origin: 'http://localhost:3000', // or whatever your frontend port is
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type']
}));





app.use(express.json());

// GET all miniatures
app.get('/api/miniatures', async (req, res) => {
  const minis = await Miniature.find();
  res.json(minis);
});

// GET summary stats
app.get('/api/miniatures/stats', async (req, res) => {
  const total = await Miniature.countDocuments();
  const statusCounts = await Miniature.aggregate([
    { $group: { _id: "$status", count: { $sum: 1 } } }
  ]);
  res.json({ total, statusCounts });
});


app.use((req, res, next) => {
  console.log(`➡️ ${req.method} ${req.url}`);
  next();
});

app.post('/api/miniatures', async (req, res) => {
    console.log('📦 Incoming data:', req.body); // 👈 Add this


    try {
    const { name, game, army, status } = req.body;
    const mini = new Miniature({ name, game, army, status });
    await mini.save();
    res.status(201).json(mini);
  } catch (err) {
    console.error('❌ Error saving miniature:', err);
    res.status(500).json({ error: 'Failed to save miniature' });
  }
});








app.listen(3000, () => console.log('Server running on http://localhost:3000'));
