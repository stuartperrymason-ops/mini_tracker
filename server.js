const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

mongoose.connect('mongodb://localhost:27017/miniatures')
.then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

const Miniature = mongoose.model('Miniature', {
  name: String,
  game: String,
  status: String,
  army: String
});

app.use(cors({
  origin: 'http://localhost:3000', // or whatever your frontend port is
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type']
}));





app.use(express.json());

app.get('/api/miniatures', async (req, res) => {
  const minis = await Miniature.find();
  res.json(minis);
});

app.use((req, res, next) => {
  console.log(`➡️ ${req.method} ${req.url}`);
  next();
});

app.post('/api/miniatures', async (req, res) => {
  try {
    const mini = new Miniature(req.body);
    await mini.save();
    res.status(201).json(mini);
  } catch (err) {
    console.error('❌ Error saving miniature:', err);
    res.status(500).json({ error: 'Failed to save miniature' });
  }
});


app.listen(3000, () => console.log('Server running on http://localhost:3000'));
