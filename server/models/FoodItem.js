const mongoose = require('mongoose');

const foodItemSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  brand: { type: String, default: '' },
  servingSize: { type: Number, default: 100 },
  servingUnit: { type: String, default: 'g' },
  calories: { type: Number, required: true },
  protein: { type: Number, default: 0 },
  carbs: { type: Number, default: 0 },
  fats: { type: Number, default: 0 },
  fiber: { type: Number, default: 0 },
  sugar: { type: Number, default: 0 },
  sodium: { type: Number, default: 0 },
  category: {
    type: String,
    enum: ['protein', 'carbs', 'fats', 'dairy', 'fruits', 'vegetables', 'grains', 'snacks', 'beverages', 'supplements', 'other'],
    default: 'other'
  },
  isCustom: { type: Boolean, default: false },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

foodItemSchema.index({ name: 'text' });

module.exports = mongoose.model('FoodItem', foodItemSchema);
