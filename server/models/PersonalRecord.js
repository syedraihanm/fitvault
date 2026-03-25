const mongoose = require('mongoose');

const personalRecordSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  exercise: { type: mongoose.Schema.Types.ObjectId, ref: 'Exercise', required: true },
  exerciseName: { type: String, required: true },
  maxWeight: { type: Number, default: 0 },
  maxReps: { type: Number, default: 0 },
  maxVolume: { type: Number, default: 0 },
  bestSet: { weight: { type: Number }, reps: { type: Number } },
  history: [{
    weight: { type: Number },
    reps: { type: Number },
    date: { type: Date, default: Date.now }
  }]
}, { timestamps: true });

personalRecordSchema.index({ user: 1, exercise: 1 });

module.exports = mongoose.model('PersonalRecord', personalRecordSchema);
