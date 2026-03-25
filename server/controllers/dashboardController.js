const WorkoutSession = require('../models/WorkoutSession');
const MealLog = require('../models/MealLog');
const WaterLog = require('../models/WaterLog');
const StepLog = require('../models/StepLog');
const ProgressLog = require('../models/ProgressLog');
const User = require('../models/User');

// Get dashboard data for today
exports.getDashboard = async (req, res, next) => {
  try {
    const today = new Date(); today.setHours(0,0,0,0);
    const endOfDay = new Date(today); endOfDay.setHours(23,59,59,999);

    // Today's meals
    const meals = await MealLog.find({ user: req.user._id, date: { $gte: today, $lte: endOfDay } });
    const totalCalories = meals.reduce((s, m) => s + m.totalCalories, 0);
    const totalProtein = meals.reduce((s, m) => s + m.totalProtein, 0);
    const totalCarbs = meals.reduce((s, m) => s + m.totalCarbs, 0);
    const totalFats = meals.reduce((s, m) => s + m.totalFats, 0);

    // Today's workout
    const todayWorkout = await WorkoutSession.findOne({
      user: req.user._id, createdAt: { $gte: today, $lte: endOfDay }
    });

    // Water
    const waterLog = await WaterLog.findOne({ user: req.user._id, date: today });
    // Steps
    const stepLog = await StepLog.findOne({ user: req.user._id, date: today });

    // Weekly calories (last 7 days)
    const weekStart = new Date(); weekStart.setDate(weekStart.getDate() - 7); weekStart.setHours(0,0,0,0);
    const weekMeals = await MealLog.find({ user: req.user._id, date: { $gte: weekStart } });
    const weeklyCalories = {};
    for (let i = 6; i >= 0; i--) {
      const d = new Date(); d.setDate(d.getDate() - i);
      const key = d.toLocaleDateString('en-US', { weekday: 'short' });
      weeklyCalories[key] = 0;
    }
    weekMeals.forEach(m => {
      const key = new Date(m.date).toLocaleDateString('en-US', { weekday: 'short' });
      if (weeklyCalories[key] !== undefined) weeklyCalories[key] += m.totalCalories;
    });

    // Workout frequency (last 4 weeks)
    const monthStart = new Date(); monthStart.setDate(monthStart.getDate() - 28); monthStart.setHours(0,0,0,0);
    const monthWorkouts = await WorkoutSession.find({
      user: req.user._id, createdAt: { $gte: monthStart }
    });
    const weeklyWorkouts = [0, 0, 0, 0];
    monthWorkouts.forEach(w => {
      const weeksAgo = Math.floor((new Date() - new Date(w.createdAt)) / (7 * 86400000));
      if (weeksAgo < 4) weeklyWorkouts[3 - weeksAgo]++;
    });

    // Weight progress (last 90 days)
    const ninetyDaysAgo = new Date(); ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);
    const weightLogs = await ProgressLog.find({
      user: req.user._id, date: { $gte: ninetyDaysAgo }, weight: { $exists: true, $ne: null }
    }).sort({ date: 1 });

    const user = await User.findById(req.user._id);

    res.json({
      success: true,
      dashboard: {
        nutrition: { calories: totalCalories, protein: totalProtein, carbs: totalCarbs, fats: totalFats,
          calorieTarget: user.dailyCalorieTarget, proteinTarget: user.dailyProteinTarget },
        workout: todayWorkout ? {
          name: todayWorkout.name, duration: todayWorkout.duration,
          caloriesBurned: todayWorkout.totalCaloriesBurned, exercises: todayWorkout.exercises.length
        } : null,
        water: { glasses: waterLog?.glasses || 0, totalMl: waterLog?.totalMl || 0, target: user.dailyWaterTarget },
        steps: { count: stepLog?.steps || 0, target: user.dailyStepTarget, calories: stepLog?.caloriesBurned || 0 },
        charts: {
          weeklyCalories: Object.entries(weeklyCalories).map(([day, cal]) => ({ day, calories: cal })),
          workoutFrequency: weeklyWorkouts.map((count, i) => ({ week: `Week ${i+1}`, workouts: count })),
          weightProgress: weightLogs.map(l => ({
            date: l.date.toISOString().split('T')[0], weight: l.weight
          }))
        }
      }
    });
  } catch (error) { next(error); }
};
