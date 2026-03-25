const mongoose = require('mongoose');

const workoutDaySchema = new mongoose.Schema({
  dayName: { type: String, required: true },
  dayNumber: { type: Number, required: true },
  exercises: [{
    exercise: { type: mongoose.Schema.Types.ObjectId, ref: 'Exercise' },
    exerciseName: { type: String, required: true },
    sets: { type: Number, default: 3 },
    reps: { type: String, default: '8-12' },
    restTime: { type: Number, default: 90 },
    notes: { type: String }
  }]
});

const workoutProgramSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  category: {
    type: String,
    enum: ['strength', 'hypertrophy', 'endurance', 'beginner', 'general'],
    default: 'general'
  },
  difficulty: { type: String, enum: ['beginner', 'intermediate', 'advanced'], default: 'intermediate' },
  daysPerWeek: { type: Number, required: true },
  duration: { type: String, default: '8 weeks' },
  days: [workoutDaySchema],
  isPredefined: { type: Boolean, default: false },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  imageUrl: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('WorkoutProgram', workoutProgramSchema);
