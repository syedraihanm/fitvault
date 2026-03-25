const User = require('../models/User');
const Exercise = require('../models/Exercise');
const FoodItem = require('../models/FoodItem');
const WorkoutSession = require('../models/WorkoutSession');

// Get all users (admin)
exports.getUsers = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, search } = req.query;
    const query = {};
    if (search) query.name = { $regex: search, $options: 'i' };
    const users = await User.find(query).select('-password')
      .skip((page - 1) * limit).limit(parseInt(limit)).sort({ createdAt: -1 });
    const total = await User.countDocuments(query);
    res.json({ success: true, users, total, page: parseInt(page) });
  } catch (error) { next(error); }
};

// Get admin stats
exports.getStats = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalExercises = await Exercise.countDocuments();
    const totalFoods = await FoodItem.countDocuments();
    const totalWorkouts = await WorkoutSession.countDocuments();
    const newUsersToday = await User.countDocuments({
      createdAt: { $gte: new Date(new Date().setHours(0,0,0,0)) }
    });

    res.json({
      success: true,
      stats: { totalUsers, totalExercises, totalFoods, totalWorkouts, newUsersToday }
    });
  } catch (error) { next(error); }
};

// Delete user (admin)
exports.deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    if (user.role === 'admin') return res.status(400).json({ success: false, message: 'Cannot delete admin' });
    await user.deleteOne();
    res.json({ success: true, message: 'User deleted' });
  } catch (error) { next(error); }
};

// Manage exercises (admin) - bulk create
exports.bulkCreateExercises = async (req, res, next) => {
  try {
    const exercises = await Exercise.insertMany(req.body.exercises);
    res.status(201).json({ success: true, count: exercises.length });
  } catch (error) { next(error); }
};

// Manage foods (admin) - bulk create
exports.bulkCreateFoods = async (req, res, next) => {
  try {
    const foods = await FoodItem.insertMany(req.body.foods);
    res.status(201).json({ success: true, count: foods.length });
  } catch (error) { next(error); }
};
