const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
  openHours: {
    start: { type: String, default: '10:00' },
    end: { type: String, default: '23:00' },
  },
  maxPartySize: {
    type: Number,
    default: 10,
  },
  tables: {
    type: Number,
    default: 20,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Settings', settingsSchema);
