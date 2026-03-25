const mongoose = require('mongoose');

const stepLogSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, required: true },
  steps: { type: Number, default: 0 },
  distance: { type: Number, default: 0 },
  caloriesBurned: { type: Number, default: 0 },
  source: { type: String, enum: ['manual', 'phone', 'wearable'], default: 'manual' }
}, { timestamps: true });

stepLogSchema.index({ user: 1, date: 1 });

module.exports = mongoose.model('StepLog', stepLogSchema);
