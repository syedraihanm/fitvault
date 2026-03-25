const ProgressLog = require('../models/ProgressLog');
const PersonalRecord = require('../models/PersonalRecord');

// Log progress
exports.createLog = async (req, res, next) => {
  try {
    const log = await ProgressLog.create({ ...req.body, user: req.user._id });
    // Update user weight if provided
    if (req.body.weight) {
      const User = require('../models/User');
      await User.findByIdAndUpdate(req.user._id, { weight: req.body.weight });
    }
    res.status(201).json({ success: true, log });
  } catch (error) { next(error); }
};

// Get progress logs
exports.getLogs = async (req, res, next) => {
  try {
    const { days = 90 } = req.query;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));

    const logs = await ProgressLog.find({ user: req.user._id, date: { $gte: startDate } })
      .sort({ date: 1 });
    res.json({ success: true, logs });
  } catch (error) { next(error); }
};

// Delete progress log
exports.deleteLog = async (req, res, next) => {
  try {
    await ProgressLog.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    res.json({ success: true, message: 'Log deleted' });
  } catch (error) { next(error); }
};

// Get personal records
exports.getPRs = async (req, res, next) => {
  try {
    const prs = await PersonalRecord.find({ user: req.user._id })
      .populate('exercise', 'name category').sort({ exerciseName: 1 });
    res.json({ success: true, records: prs });
  } catch (error) { next(error); }
};

// Get PR for specific exercise
exports.getExercisePR = async (req, res, next) => {
  try {
    const pr = await PersonalRecord.findOne({ user: req.user._id, exercise: req.params.exerciseId })
      .populate('exercise');
    if (!pr) return res.status(404).json({ success: false, message: 'No records found' });
    res.json({ success: true, record: pr });
  } catch (error) { next(error); }
};
