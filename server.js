const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();



mongoose.connect('mongodb://localhost:27017/miniatures')
.then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

const Miniature = require('./models/Miniature');







// Middleware setup

app.use(cors({   origin: 'http://localhost:3000', // or whatever your frontend port is
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type']
}));
app.use(express.json()) // Must be before any routes that use req.body






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
  console.log('📦 Incoming req.body:', req.body);

  const { name, game, army, status } = req.body;
    const mini = await Miniature.create({ name, game, army, status });
    res.status(201).json(mini.toObject());



  console.log('🧬 Miniature to save:', mini);





});










app.listen(3000, () => console.log('Server running on http://localhost:3000'));
