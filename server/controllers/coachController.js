const User = require('../models/User');

// AI Coach - basic suggestions
exports.getSuggestions = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    const suggestions = [];

    // Calorie recommendations
    if (user.weight && user.height && user.age && user.gender) {
      let bmr;
      if (user.gender === 'male') {
        bmr = 10 * user.weight + 6.25 * user.height - 5 * user.age + 5;
      } else {
        bmr = 10 * user.weight + 6.25 * user.height - 5 * user.age - 161;
      }

      const activityMultipliers = { sedentary: 1.2, light: 1.375, moderate: 1.55, active: 1.725, very_active: 1.9 };
      const tdee = Math.round(bmr * (activityMultipliers[user.activityLevel] || 1.55));

      let targetCalories = tdee;
      let calorieAdvice = '';
      switch (user.fitnessGoal) {
        case 'weight_loss': targetCalories = tdee - 500; calorieAdvice = 'A 500 calorie deficit for steady fat loss (~0.5kg/week).'; break;
        case 'muscle_gain': targetCalories = tdee + 300; calorieAdvice = 'A 300 calorie surplus to support muscle growth.'; break;
        case 'maintenance': calorieAdvice = 'Eating at maintenance to maintain current weight.'; break;
        case 'strength_improvement': targetCalories = tdee + 200; calorieAdvice = 'A slight surplus to fuel strength gains.'; break;
      }

      suggestions.push({
        type: 'calories',
        title: 'Recommended Daily Calories',
        value: targetCalories,
        unit: 'kcal',
        description: `Your BMR is ${Math.round(bmr)} kcal, TDEE is ${tdee} kcal. ${calorieAdvice}`,
        icon: '🔥'
      });

      // Protein recommendation
      let proteinPerKg = 1.6;
      if (user.fitnessGoal === 'muscle_gain') proteinPerKg = 2.0;
      if (user.fitnessGoal === 'weight_loss') proteinPerKg = 2.2;
      const proteinTarget = Math.round(user.weight * proteinPerKg);
      suggestions.push({
        type: 'protein',
        title: 'Recommended Protein Intake',
        value: proteinTarget,
        unit: 'g/day',
        description: `${proteinPerKg}g per kg of body weight for your goal of ${user.fitnessGoal.replace('_', ' ')}.`,
        icon: '🥩'
      });
    }

    // Workout frequency
    const workoutFreq = { weight_loss: 4, muscle_gain: 5, maintenance: 3, strength_improvement: 4 };
    suggestions.push({
      type: 'workout_frequency',
      title: 'Suggested Workout Frequency',
      value: workoutFreq[user.fitnessGoal] || 3,
      unit: 'days/week',
      description: `For ${(user.fitnessGoal || 'general fitness').replace('_', ' ')}, aim for ${workoutFreq[user.fitnessGoal] || 3} training sessions per week.`,
      icon: '💪'
    });

    // Recovery
    suggestions.push({
      type: 'recovery',
      title: 'Recovery Recommendations',
      value: '7-9',
      unit: 'hours sleep',
      description: 'Aim for 7-9 hours of quality sleep. Allow 48 hours between training the same muscle group. Stay hydrated with at least 2L of water daily.',
      icon: '😴'
    });

    // Water
    const waterTarget = Math.round(user.weight * 0.033 * 1000);
    suggestions.push({
      type: 'hydration',
      title: 'Daily Water Intake',
      value: waterTarget,
      unit: 'ml',
      description: `Based on your weight, aim for ~${waterTarget}ml (${Math.round(waterTarget / 250)} glasses) of water daily. Increase by 500ml on workout days.`,
      icon: '💧'
    });

    res.json({ success: true, suggestions });
  } catch (error) { next(error); }
};
