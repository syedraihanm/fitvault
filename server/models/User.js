const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
  name: { type: String, required: [true, 'Name is required'], trim: true },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address']
  },
  password: { type: String, required: [true, 'Password is required'], minlength: 6, select: false },
  profilePhoto: { type: String, default: '' },
  height: { type: Number },
  weight: { type: Number },
  age: { type: Number },
  gender: { type: String, enum: ['male', 'female', 'other'] },
  fitnessGoal: {
    type: String,
    enum: ['weight_loss', 'muscle_gain', 'maintenance', 'strength_improvement'],
    default: 'maintenance'
  },
  activityLevel: {
    type: String,
    enum: ['sedentary', 'light', 'moderate', 'active', 'very_active'],
    default: 'moderate'
  },
  dailyCalorieTarget: { type: Number, default: 2000 },
  dailyProteinTarget: { type: Number, default: 150 },
  dailyWaterTarget: { type: Number, default: 8 },
  dailyStepTarget: { type: Number, default: 10000 },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  notificationsEnabled: { type: Boolean, default: true },
  workoutReminder: { type: String, default: '08:00' },
  hydrationReminder: { type: Boolean, default: true },
}, { timestamps: true });

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.generateToken = function() {
  return jwt.sign({ id: this._id, role: this.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  });
};

module.exports = mongoose.model('User', userSchema);
