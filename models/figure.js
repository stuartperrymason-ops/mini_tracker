// models/figure.js
const mongoose = require('mongoose');

const figureSchema = new mongoose.Schema({
  name: { type: String, required: true },
  modelCount: { type: Number, required: true },
  army: { type: String, required: true },
  gameSystem: {
    type: String,
    enum: [
      'Marvel Crisis Protocol',
      'Star Wars Legion',
      'Star Wars Shatterpoint',
      'Middle Earth Strategy Battle',
      'Warhammer Old world',
      'Battletech',
      'WH40k',
      'Age of Sigmar',
      'Conquest Last Argument of Kings',
      'Dune'
    ],
    required: true
  },
  status: {
    type: String,
    enum: [
      'STL file found',
      'Printed',
      'Primed',
      'Painted',
      'Based',
      'Ready for game'
    ],
    required: true
  },
  fileUrl: { type: String }, // optional image or STL link
  createdAt: { type: Date, default: Date.now }
}, { collection: 'figures' });

module.exports = mongoose.model('Figure', figureSchema);