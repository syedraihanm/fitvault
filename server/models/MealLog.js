const mongoose = require('mongoose');

const mealEntrySchema = new mongoose.Schema({
  foodItem: { type: mongoose.Schema.Types.ObjectId, ref: 'FoodItem' },
  foodName: { type: String, required: true },
  servings: { type: Number, default: 1 },
  calories: { type: Number, default: 0 },
  protein: { type: Number, default: 0 },
  carbs: { type: Number, default: 0 },
  fats: { type: Number, default: 0 }
});

const mealLogSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, required: true },
  mealType: {
    type: String,
    required: true,
    enum: ['breakfast', 'lunch', 'dinner', 'snacks']
  },
  entries: [mealEntrySchema],
  totalCalories: { type: Number, default: 0 },
  totalProtein: { type: Number, default: 0 },
  totalCarbs: { type: Number, default: 0 },
  totalFats: { type: Number, default: 0 }
}, { timestamps: true });

mealLogSchema.index({ user: 1, date: 1 });

mealLogSchema.pre('save', function(next) {
  this.totalCalories = this.entries.reduce((sum, e) => sum + (e.calories * e.servings), 0);
  this.totalProtein = this.entries.reduce((sum, e) => sum + (e.protein * e.servings), 0);
  this.totalCarbs = this.entries.reduce((sum, e) => sum + (e.carbs * e.servings), 0);
  this.totalFats = this.entries.reduce((sum, e) => sum + (e.fats * e.servings), 0);
  next();
});

module.exports = mongoose.model('MealLog', mealLogSchema);
