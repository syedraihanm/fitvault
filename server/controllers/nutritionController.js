const FoodItem = require('../models/FoodItem');
const MealLog = require('../models/MealLog');

// ---- Food Items ----
exports.getFoods = async (req, res, next) => {
  try {
    const { search, category, page = 1, limit = 50 } = req.query;
    const query = {};
    if (category) query.category = category;
    if (search) query.name = { $regex: search, $options: 'i' };
    query.$or = [{ isCustom: false }, { isCustom: true, createdBy: req.user._id }];

    const foods = await FoodItem.find(query)
      .skip((page - 1) * limit).limit(parseInt(limit)).sort({ name: 1 });
    const total = await FoodItem.countDocuments(query);
    res.json({ success: true, foods, total, page: parseInt(page) });
  } catch (error) { next(error); }
};

exports.createFood = async (req, res, next) => {
  try {
    const food = await FoodItem.create({ ...req.body, isCustom: true, createdBy: req.user._id });
    res.status(201).json({ success: true, food });
  } catch (error) { next(error); }
};

exports.updateFood = async (req, res, next) => {
  try {
    const food = await FoodItem.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!food) return res.status(404).json({ success: false, message: 'Food not found' });
    res.json({ success: true, food });
  } catch (error) { next(error); }
};

exports.deleteFood = async (req, res, next) => {
  try {
    await FoodItem.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Food deleted' });
  } catch (error) { next(error); }
};

// ---- Meal Logs ----
exports.getMealLogs = async (req, res, next) => {
  try {
    const { date, startDate, endDate } = req.query;
    const query = { user: req.user._id };
    if (date) {
      const d = new Date(date);
      query.date = { $gte: new Date(d.setHours(0,0,0,0)), $lte: new Date(d.setHours(23,59,59,999)) };
    } else if (startDate && endDate) {
      query.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }
    const meals = await MealLog.find(query).populate('entries.foodItem', 'name').sort({ date: -1 });
    res.json({ success: true, meals });
  } catch (error) { next(error); }
};

exports.createMealLog = async (req, res, next) => {
  try {
    const meal = await MealLog.create({ ...req.body, user: req.user._id });
    res.status(201).json({ success: true, meal });
  } catch (error) { next(error); }
};

exports.updateMealLog = async (req, res, next) => {
  try {
    const meal = await MealLog.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id }, req.body, { new: true }
    );
    if (!meal) return res.status(404).json({ success: false, message: 'Meal log not found' });
    res.json({ success: true, meal });
  } catch (error) { next(error); }
};

exports.deleteMealLog = async (req, res, next) => {
  try {
    await MealLog.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    res.json({ success: true, message: 'Meal log deleted' });
  } catch (error) { next(error); }
};

// Nutrition stats
exports.getNutritionStats = async (req, res, next) => {
  try {
    const { days = 7 } = req.query;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));

    const meals = await MealLog.find({ user: req.user._id, date: { $gte: startDate } }).sort({ date: 1 });

    const dailyData = {};
    meals.forEach(m => {
      const key = m.date.toISOString().split('T')[0];
      if (!dailyData[key]) dailyData[key] = { calories: 0, protein: 0, carbs: 0, fats: 0 };
      dailyData[key].calories += m.totalCalories;
      dailyData[key].protein += m.totalProtein;
      dailyData[key].carbs += m.totalCarbs;
      dailyData[key].fats += m.totalFats;
    });

    res.json({ success: true, stats: dailyData, meals });
  } catch (error) { next(error); }
};
