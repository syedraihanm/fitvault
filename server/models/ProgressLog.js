const mongoose = require('mongoose');

const progressLogSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, required: true },
  weight: { type: Number },
  bodyFat: { type: Number },
  measurements: {
    chest: { type: Number },
    waist: { type: Number },
    hips: { type: Number },
    bicepsLeft: { type: Number },
    bicepsRight: { type: Number },
    thighLeft: { type: Number },
    thighRight: { type: Number },
    calves: { type: Number }
  },
  notes: { type: String },
  photos: [{ type: String }]
}, { timestamps: true });

progressLogSchema.index({ user: 1, date: -1 });

module.exports = mongoose.model('ProgressLog', progressLogSchema);
