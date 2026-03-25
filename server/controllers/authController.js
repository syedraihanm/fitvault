const User = require('../models/User');

// Register
exports.register = async (req, res, next) => {
  try {
    const { name, email, password, gender, age, height, weight, fitnessGoal } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ success: false, message: 'Email already registered' });

    const user = await User.create({ name, email, password, gender, age, height, weight, fitnessGoal });
    const token = user.generateToken();
    const userData = user.toObject();
    delete userData.password;

    res.status(201).json({ success: true, token, user: userData });
  } catch (error) { next(error); }
};

// Login
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');
    if (!user) return res.status(401).json({ success: false, message: 'Invalid credentials' });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(401).json({ success: false, message: 'Invalid credentials' });

    const token = user.generateToken();
    const userData = user.toObject();
    delete userData.password;

    res.json({ success: true, token, user: userData });
  } catch (error) { next(error); }
};

// Get current user
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    res.json({ success: true, user });
  } catch (error) { next(error); }
};

// Update profile
exports.updateProfile = async (req, res, next) => {
  try {
    const fields = ['name', 'height', 'weight', 'age', 'gender', 'fitnessGoal', 'activityLevel',
      'dailyCalorieTarget', 'dailyProteinTarget', 'dailyWaterTarget', 'dailyStepTarget',
      'notificationsEnabled', 'workoutReminder', 'hydrationReminder'];
    const updates = {};
    fields.forEach(f => { if (req.body[f] !== undefined) updates[f] = req.body[f]; });

    if (req.file) updates.profilePhoto = `/uploads/${req.file.filename}`;

    const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true, runValidators: true });
    res.json({ success: true, user });
  } catch (error) { next(error); }
};

// Change password
exports.changePassword = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('+password');
    const isMatch = await user.comparePassword(req.body.currentPassword);
    if (!isMatch) return res.status(400).json({ success: false, message: 'Current password is incorrect' });

    user.password = req.body.newPassword;
    await user.save();
    res.json({ success: true, message: 'Password updated' });
  } catch (error) { next(error); }
};
