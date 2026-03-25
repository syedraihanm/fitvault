const mongoose = require('mongoose');

const exerciseSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  category: {
    type: String,
    required: true,
    enum: ['chest', 'back', 'legs', 'shoulders', 'arms', 'core', 'cardio']
  },
  muscleGroup: { type: String, required: true },
  equipment: { type: String, default: 'bodyweight' },
  description: { type: String },
  instructions: [String],
  difficulty: { type: String, enum: ['beginner', 'intermediate', 'advanced'], default: 'intermediate' },
  caloriesPerMinute: { type: Number, default: 5 },
  isCustom: { type: Boolean, default: false },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  imageUrl: { type: String, default: '' }
}, { timestamps: true });

exerciseSchema.index({ name: 'text', category: 1 });

module.exports = mongoose.model('Exercise', exerciseSchema);
