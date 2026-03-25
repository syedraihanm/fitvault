const WorkoutSession = require('../models/WorkoutSession');
const PersonalRecord = require('../models/PersonalRecord');

// Create workout session
exports.createSession = async (req, res, next) => {
  try {
    const session = await WorkoutSession.create({ ...req.body, user: req.user._id });
    // Update personal records
    if (session.exercises && session.exercises.length > 0) {
      for (const ex of session.exercises) {
        for (const set of ex.sets) {
          if (!set.isWarmup) {
            await updatePR(req.user._id, ex.exercise, ex.exerciseName, set.weight, set.reps);
          }
        }
      }
    }
    res.status(201).json({ success: true, session });
  } catch (error) { next(error); }
};

// Get user's workout sessions
exports.getSessions = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, startDate, endDate } = req.query;
    const query = { user: req.user._id };
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }
    const sessions = await WorkoutSession.find(query)
      .populate('exercises.exercise', 'name category')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit).limit(parseInt(limit));
    const total = await WorkoutSession.countDocuments(query);
    res.json({ success: true, sessions, total, page: parseInt(page), pages: Math.ceil(total / limit) });
  } catch (error) { next(error); }
};

// Get single session
exports.getSession = async (req, res, next) => {
  try {
    const session = await WorkoutSession.findOne({ _id: req.params.id, user: req.user._id })
      .populate('exercises.exercise');
    if (!session) return res.status(404).json({ success: false, message: 'Session not found' });
    res.json({ success: true, session });
  } catch (error) { next(error); }
};

// Update session
exports.updateSession = async (req, res, next) => {
  try {
    const session = await WorkoutSession.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id }, req.body, { new: true, runValidators: true }
    );
    if (!session) return res.status(404).json({ success: false, message: 'Session not found' });
    res.json({ success: true, session });
  } catch (error) { next(error); }
};

// Delete session
exports.deleteSession = async (req, res, next) => {
  try {
    const session = await WorkoutSession.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!session) return res.status(404).json({ success: false, message: 'Session not found' });
    res.json({ success: true, message: 'Session deleted' });
  } catch (error) { next(error); }
};

// Get workout stats
exports.getStats = async (req, res, next) => {
  try {
    const { days = 30 } = req.query;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));

    const sessions = await WorkoutSession.find({
      user: req.user._id, createdAt: { $gte: startDate }
    }).sort({ createdAt: 1 });

    const totalWorkouts = sessions.length;
    const totalDuration = sessions.reduce((sum, s) => sum + (s.duration || 0), 0);
    const totalCalories = sessions.reduce((sum, s) => sum + (s.totalCaloriesBurned || 0), 0);
    const totalVolume = sessions.reduce((sum, s) => sum + (s.totalVolume || 0), 0);

    // Weekly frequency
    const weeklyData = {};
    sessions.forEach(s => {
      const week = getWeekKey(s.createdAt);
      weeklyData[week] = (weeklyData[week] || 0) + 1;
    });

    res.json({
      success: true,
      stats: { totalWorkouts, totalDuration, totalCalories, totalVolume, weeklyFrequency: weeklyData, sessions }
    });
  } catch (error) { next(error); }
};

async function updatePR(userId, exerciseId, exerciseName, weight, reps) {
  try {
    let pr = await PersonalRecord.findOne({ user: userId, exercise: exerciseId });
    if (!pr) {
      pr = new PersonalRecord({ user: userId, exercise: exerciseId, exerciseName });
    }
    let updated = false;
    if (weight > pr.maxWeight) { pr.maxWeight = weight; updated = true; }
    if (reps > pr.maxReps) { pr.maxReps = reps; updated = true; }
    const volume = weight * reps;
    if (volume > pr.maxVolume) { pr.maxVolume = volume; updated = true; }
    if (updated || !pr.bestSet || weight > (pr.bestSet.weight || 0)) {
      pr.bestSet = { weight, reps };
    }
    pr.history.push({ weight, reps, date: new Date() });
    await pr.save();
  } catch (err) { console.error('PR update error:', err); }
}

function getWeekKey(date) {
  const d = new Date(date);
  const start = new Date(d.getFullYear(), 0, 1);
  const week = Math.ceil(((d - start) / 86400000 + start.getDay() + 1) / 7);
  return `${d.getFullYear()}-W${week}`;
}
