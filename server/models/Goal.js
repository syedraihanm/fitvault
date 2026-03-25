const mongoose = require('mongoose');

const goalSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: {
    type: String,
    required: true,
    enum: ['weight_loss', 'muscle_gain', 'maintenance', 'strength_improvement', 'custom']
  },
  title: { type: String, required: true },
  description: { type: String },
  targetValue: { type: Number },
  currentValue: { type: Number, default: 0 },
  unit: { type: String, default: 'kg' },
  startDate: { type: Date, default: Date.now },
  targetDate: { type: Date },
  isCompleted: { type: Boolean, default: false },
  completedAt: { type: Date }
}, { timestamps: true });

goalSchema.index({ user: 1 });

module.exports = mongoose.model('Goal', goalSchema);
