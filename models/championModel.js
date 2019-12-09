var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Setup schema
var championSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  rarity: {
    type: String,
  },
  faction: {
    type: String,
  },
  type: {
    type: String,
  },
  element: {
    type: String,
  },
  stats: {
    health: {
      type: String,
      required: true
    },
    attack: {
      type: String,
      required: true
    },
    defense: {
      type: String,
      required: true
    },
    criticalRate: {
      type: String,
      required: true
    },
    criticalDamage: {
      type: String,
      required: true
    },
    speed: {
      type: String,
      required: true
    },
    resistance: {
      type: String,
      required: true
    },
    accuracy: {
      type: String,
      required: true
    },
  }
});

// Export Contact model
module.exports = Champion = mongoose.model('champions', championSchema);