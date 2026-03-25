const WorkoutProgram = require('../models/WorkoutProgram');

// Get all programs
exports.getPrograms = async (req, res, next) => {
  try {
    const { category, difficulty } = req.query;
    const query = {};
    if (category) query.category = category;
    if (difficulty) query.difficulty = difficulty;
    const programs = await WorkoutProgram.find(query).populate('days.exercises.exercise', 'name category');
    res.json({ success: true, programs });
  } catch (error) { next(error); }
};

// Get single program
exports.getProgram = async (req, res, next) => {
  try {
    const program = await WorkoutProgram.findById(req.params.id).populate('days.exercises.exercise');
    if (!program) return res.status(404).json({ success: false, message: 'Program not found' });
    res.json({ success: true, program });
  } catch (error) { next(error); }
};

// Follow/unfollow program
exports.toggleFollow = async (req, res, next) => {
  try {
    const program = await WorkoutProgram.findById(req.params.id);
    if (!program) return res.status(404).json({ success: false, message: 'Program not found' });

    const idx = program.followers.indexOf(req.user._id);
    if (idx > -1) {
      program.followers.splice(idx, 1);
    } else {
      program.followers.push(req.user._id);
    }
    await program.save();
    res.json({ success: true, following: idx === -1, program });
  } catch (error) { next(error); }
};

// Get user's followed programs
exports.getMyPrograms = async (req, res, next) => {
  try {
    const programs = await WorkoutProgram.find({ followers: req.user._id })
      .populate('days.exercises.exercise', 'name category');
    res.json({ success: true, programs });
  } catch (error) { next(error); }
};

// Create program (admin)
exports.createProgram = async (req, res, next) => {
  try {
    const program = await WorkoutProgram.create({ ...req.body, createdBy: req.user._id });
    res.status(201).json({ success: true, program });
  } catch (error) { next(error); }
};

// Update program (admin)
exports.updateProgram = async (req, res, next) => {
  try {
    const program = await WorkoutProgram.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!program) return res.status(404).json({ success: false, message: 'Program not found' });
    res.json({ success: true, program });
  } catch (error) { next(error); }
};

// Delete program (admin)
exports.deleteProgram = async (req, res, next) => {
  try {
    await WorkoutProgram.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Program deleted' });
  } catch (error) { next(error); }
};
