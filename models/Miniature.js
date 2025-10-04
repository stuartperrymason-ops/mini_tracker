const mongoose = require('mongoose');

// 🧨 Clear old model if it exists
if (mongoose.models.Miniature) {
  delete mongoose.models.Miniature;
}

const miniatureSchema = new mongoose.Schema({
  name: String,
  game: String,
  army: { type: String, required: true },
  status: String,
  imageUrl: String,
  createdAt: { type: Date, default: Date.now }
});

const Miniature = mongoose.model('Miniature', miniatureSchema);

