const mongoose = require('mongoose');

const waterLogSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, required: true },
  glasses: { type: Number, default: 0 },
  totalMl: { type: Number, default: 0 },
  entries: [{
    amount: { type: Number, required: true },
    unit: { type: String, default: 'ml' },
    time: { type: Date, default: Date.now }
  }]
}, { timestamps: true });

waterLogSchema.index({ user: 1, date: 1 });

module.exports = mongoose.model('WaterLog', waterLogSchema);
