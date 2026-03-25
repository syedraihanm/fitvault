const Exercise = require('../models/Exercise');

// Get all exercises (with filters)
exports.getExercises = async (req, res, next) => {
  try {
    const { category, difficulty, search, page = 1, limit = 50 } = req.query;
    const query = {};
    if (category) query.category = category;
    if (difficulty) query.difficulty = difficulty;
    if (search) query.name = { $regex: search, $options: 'i' };
    // Show predefined + user's custom exercises
    query.$or = [{ isCustom: false }, { isCustom: true, createdBy: req.user._id }];

    const exercises = await Exercise.find(query)
      .skip((page - 1) * limit).limit(parseInt(limit))
      .sort({ category: 1, name: 1 });
    const total = await Exercise.countDocuments(query);

    res.json({ success: true, exercises, total, page: parseInt(page), pages: Math.ceil(total / limit) });
  } catch (error) { next(error); }
};

// Create custom exercise
exports.createExercise = async (req, res, next) => {
  try {
    const exercise = await Exercise.create({
      ...req.body, isCustom: true, createdBy: req.user._id
    });
    res.status(201).json({ success: true, exercise });
  } catch (error) { next(error); }
};

// Update exercise
exports.updateExercise = async (req, res, next) => {
  try {
    const exercise = await Exercise.findById(req.params.id);
    if (!exercise) return res.status(404).json({ success: false, message: 'Exercise not found' });
    if (exercise.isCustom && exercise.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    const updated = await Exercise.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, exercise: updated });
  } catch (error) { next(error); }
};

// Delete exercise
exports.deleteExercise = async (req, res, next) => {
  try {
    const exercise = await Exercise.findById(req.params.id);
    if (!exercise) return res.status(404).json({ success: false, message: 'Exercise not found' });
    if (exercise.isCustom && exercise.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    await exercise.deleteOne();
    res.json({ success: true, message: 'Exercise deleted' });
  } catch (error) { next(error); }
};

// Get exercise categories
exports.getCategories = async (req, res) => {
  res.json({
    success: true,
    categories: ['chest', 'back', 'legs', 'shoulders', 'arms', 'core', 'cardio']
  });
};
