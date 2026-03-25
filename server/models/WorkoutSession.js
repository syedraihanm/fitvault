const mongoose = require('mongoose');

const setSchema = new mongoose.Schema({
  setNumber: { type: Number, required: true },
  reps: { type: Number, required: true },
  weight: { type: Number, default: 0 },
  isWarmup: { type: Boolean, default: false },
  isPR: { type: Boolean, default: false },
  restTime: { type: Number, default: 60 }
});

const exerciseLogSchema = new mongoose.Schema({
  exercise: { type: mongoose.Schema.Types.ObjectId, ref: 'Exercise', required: true },
  exerciseName: { type: String, required: true },
  sets: [setSchema],
  notes: { type: String },
  caloriesBurned: { type: Number, default: 0 }
});

const workoutSessionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, default: 'Workout' },
  exercises: [exerciseLogSchema],
  startTime: { type: Date, required: true },
  endTime: { type: Date },
  duration: { type: Number, default: 0 },
  totalCaloriesBurned: { type: Number, default: 0 },
  totalVolume: { type: Number, default: 0 },
  notes: { type: String },
  mood: { type: String, enum: ['great', 'good', 'okay', 'tired', 'bad'] },
  isCompleted: { type: Boolean, default: false },
  programDay: { type: String }
}, { timestamps: true });

workoutSessionSchema.index({ user: 1, createdAt: -1 });

workoutSessionSchema.pre('save', function(next) {
  let totalCal = 0;
  let totalVol = 0;
  this.exercises.forEach(ex => {
    totalCal += ex.caloriesBurned || 0;
    ex.sets.forEach(s => {
      if (!s.isWarmup) totalVol += (s.weight || 0) * (s.reps || 0);
    });
  });
  this.totalCaloriesBurned = totalCal;
  this.totalVolume = totalVol;
  if (this.startTime && this.endTime) {
    this.duration = Math.round((this.endTime - this.startTime) / 60000);
  }
  next();
});

module.exports = mongoose.model('WorkoutSession', workoutSessionSchema);
