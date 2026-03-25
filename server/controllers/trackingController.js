const WaterLog = require('../models/WaterLog');
const StepLog = require('../models/StepLog');
const Goal = require('../models/Goal');
const Notification = require('../models/Notification');

// ---- Water Tracking ----
exports.logWater = async (req, res, next) => {
  try {
    const today = new Date(); today.setHours(0,0,0,0);
    let log = await WaterLog.findOne({ user: req.user._id, date: today });
    if (!log) log = new WaterLog({ user: req.user._id, date: today, glasses: 0, totalMl: 0, entries: [] });

    const amount = req.body.amount || 250;
    log.entries.push({ amount, unit: 'ml', time: new Date() });
    log.totalMl += amount;
    log.glasses = Math.floor(log.totalMl / 250);
    await log.save();
    res.json({ success: true, log });
  } catch (error) { next(error); }
};

exports.getWaterLog = async (req, res, next) => {
  try {
    const { date } = req.query;
    const d = date ? new Date(date) : new Date();
    d.setHours(0,0,0,0);
    const log = await WaterLog.findOne({ user: req.user._id, date: d });
    res.json({ success: true, log: log || { glasses: 0, totalMl: 0, entries: [] } });
  } catch (error) { next(error); }
};

exports.getWaterHistory = async (req, res, next) => {
  try {
    const { days = 7 } = req.query;
    const startDate = new Date(); startDate.setDate(startDate.getDate() - parseInt(days)); startDate.setHours(0,0,0,0);
    const logs = await WaterLog.find({ user: req.user._id, date: { $gte: startDate } }).sort({ date: 1 });
    res.json({ success: true, logs });
  } catch (error) { next(error); }
};

// ---- Step Tracking ----
exports.logSteps = async (req, res, next) => {
  try {
    const today = new Date(); today.setHours(0,0,0,0);
    let log = await StepLog.findOne({ user: req.user._id, date: today });
    if (!log) log = new StepLog({ user: req.user._id, date: today });

    log.steps = req.body.steps || log.steps;
    log.distance = req.body.distance || log.distance;
    log.caloriesBurned = Math.round(log.steps * 0.04);
    log.source = req.body.source || 'manual';
    await log.save();
    res.json({ success: true, log });
  } catch (error) { next(error); }
};

exports.getStepLog = async (req, res, next) => {
  try {
    const { date } = req.query;
    const d = date ? new Date(date) : new Date();
    d.setHours(0,0,0,0);
    const log = await StepLog.findOne({ user: req.user._id, date: d });
    res.json({ success: true, log: log || { steps: 0, distance: 0, caloriesBurned: 0 } });
  } catch (error) { next(error); }
};

exports.getStepHistory = async (req, res, next) => {
  try {
    const { days = 7 } = req.query;
    const startDate = new Date(); startDate.setDate(startDate.getDate() - parseInt(days)); startDate.setHours(0,0,0,0);
    const logs = await StepLog.find({ user: req.user._id, date: { $gte: startDate } }).sort({ date: 1 });
    res.json({ success: true, logs });
  } catch (error) { next(error); }
};

// ---- Goals ----
exports.getGoals = async (req, res, next) => {
  try {
    const goals = await Goal.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, goals });
  } catch (error) { next(error); }
};

exports.createGoal = async (req, res, next) => {
  try {
    const goal = await Goal.create({ ...req.body, user: req.user._id });
    res.status(201).json({ success: true, goal });
  } catch (error) { next(error); }
};

exports.updateGoal = async (req, res, next) => {
  try {
    const goal = await Goal.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id }, req.body, { new: true }
    );
    if (!goal) return res.status(404).json({ success: false, message: 'Goal not found' });
    if (req.body.currentValue >= goal.targetValue && !goal.isCompleted) {
      goal.isCompleted = true;
      goal.completedAt = new Date();
      await goal.save();
    }
    res.json({ success: true, goal });
  } catch (error) { next(error); }
};

exports.deleteGoal = async (req, res, next) => {
  try {
    await Goal.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    res.json({ success: true, message: 'Goal deleted' });
  } catch (error) { next(error); }
};

// ---- Notifications ----
exports.getNotifications = async (req, res, next) => {
  try {
    const notifications = await Notification.find({ user: req.user._id })
      .sort({ createdAt: -1 }).limit(50);
    const unreadCount = await Notification.countDocuments({ user: req.user._id, isRead: false });
    res.json({ success: true, notifications, unreadCount });
  } catch (error) { next(error); }
};

exports.markRead = async (req, res, next) => {
  try {
    await Notification.findByIdAndUpdate(req.params.id, { isRead: true });
    res.json({ success: true });
  } catch (error) { next(error); }
};

exports.markAllRead = async (req, res, next) => {
  try {
    await Notification.updateMany({ user: req.user._id, isRead: false }, { isRead: true });
    res.json({ success: true });
  } catch (error) { next(error); }
};
