require('dotenv').config();
const mongoose = require('mongoose');
const Exercise = require('../models/Exercise');
const FoodItem = require('../models/FoodItem');
const WorkoutProgram = require('../models/WorkoutProgram');
const User = require('../models/User');

const exercises = [
  // Chest
  { name: 'Bench Press', category: 'chest', muscleGroup: 'Pectorals', equipment: 'barbell', difficulty: 'intermediate', caloriesPerMinute: 8, instructions: ['Lie on bench', 'Grip bar shoulder-width', 'Lower to chest', 'Press up'] },
  { name: 'Incline Dumbbell Press', category: 'chest', muscleGroup: 'Upper Pectorals', equipment: 'dumbbells', difficulty: 'intermediate', caloriesPerMinute: 7 },
  { name: 'Cable Flyes', category: 'chest', muscleGroup: 'Pectorals', equipment: 'cable', difficulty: 'beginner', caloriesPerMinute: 5 },
  { name: 'Push-ups', category: 'chest', muscleGroup: 'Pectorals', equipment: 'bodyweight', difficulty: 'beginner', caloriesPerMinute: 6 },
  { name: 'Dumbbell Flyes', category: 'chest', muscleGroup: 'Pectorals', equipment: 'dumbbells', difficulty: 'beginner', caloriesPerMinute: 5 },
  { name: 'Decline Bench Press', category: 'chest', muscleGroup: 'Lower Pectorals', equipment: 'barbell', difficulty: 'intermediate', caloriesPerMinute: 8 },
  { name: 'Chest Dips', category: 'chest', muscleGroup: 'Pectorals', equipment: 'bodyweight', difficulty: 'intermediate', caloriesPerMinute: 7 },
  // Back
  { name: 'Deadlift', category: 'back', muscleGroup: 'Full Back', equipment: 'barbell', difficulty: 'advanced', caloriesPerMinute: 10 },
  { name: 'Barbell Row', category: 'back', muscleGroup: 'Lats', equipment: 'barbell', difficulty: 'intermediate', caloriesPerMinute: 7 },
  { name: 'Pull-ups', category: 'back', muscleGroup: 'Lats', equipment: 'bodyweight', difficulty: 'intermediate', caloriesPerMinute: 8 },
  { name: 'Lat Pulldown', category: 'back', muscleGroup: 'Lats', equipment: 'cable', difficulty: 'beginner', caloriesPerMinute: 6 },
  { name: 'Seated Cable Row', category: 'back', muscleGroup: 'Mid Back', equipment: 'cable', difficulty: 'beginner', caloriesPerMinute: 6 },
  { name: 'T-Bar Row', category: 'back', muscleGroup: 'Mid Back', equipment: 'barbell', difficulty: 'intermediate', caloriesPerMinute: 7 },
  { name: 'Face Pulls', category: 'back', muscleGroup: 'Rear Delts', equipment: 'cable', difficulty: 'beginner', caloriesPerMinute: 4 },
  // Legs
  { name: 'Barbell Squat', category: 'legs', muscleGroup: 'Quadriceps', equipment: 'barbell', difficulty: 'advanced', caloriesPerMinute: 10 },
  { name: 'Leg Press', category: 'legs', muscleGroup: 'Quadriceps', equipment: 'machine', difficulty: 'beginner', caloriesPerMinute: 7 },
  { name: 'Romanian Deadlift', category: 'legs', muscleGroup: 'Hamstrings', equipment: 'barbell', difficulty: 'intermediate', caloriesPerMinute: 8 },
  { name: 'Leg Extension', category: 'legs', muscleGroup: 'Quadriceps', equipment: 'machine', difficulty: 'beginner', caloriesPerMinute: 5 },
  { name: 'Leg Curl', category: 'legs', muscleGroup: 'Hamstrings', equipment: 'machine', difficulty: 'beginner', caloriesPerMinute: 5 },
  { name: 'Calf Raises', category: 'legs', muscleGroup: 'Calves', equipment: 'machine', difficulty: 'beginner', caloriesPerMinute: 4 },
  { name: 'Bulgarian Split Squat', category: 'legs', muscleGroup: 'Quadriceps', equipment: 'dumbbells', difficulty: 'intermediate', caloriesPerMinute: 7 },
  { name: 'Hip Thrust', category: 'legs', muscleGroup: 'Glutes', equipment: 'barbell', difficulty: 'intermediate', caloriesPerMinute: 7 },
  // Shoulders
  { name: 'Overhead Press', category: 'shoulders', muscleGroup: 'Deltoids', equipment: 'barbell', difficulty: 'intermediate', caloriesPerMinute: 7 },
  { name: 'Lateral Raises', category: 'shoulders', muscleGroup: 'Side Delts', equipment: 'dumbbells', difficulty: 'beginner', caloriesPerMinute: 4 },
  { name: 'Front Raises', category: 'shoulders', muscleGroup: 'Front Delts', equipment: 'dumbbells', difficulty: 'beginner', caloriesPerMinute: 4 },
  { name: 'Arnold Press', category: 'shoulders', muscleGroup: 'Deltoids', equipment: 'dumbbells', difficulty: 'intermediate', caloriesPerMinute: 6 },
  { name: 'Rear Delt Fly', category: 'shoulders', muscleGroup: 'Rear Delts', equipment: 'dumbbells', difficulty: 'beginner', caloriesPerMinute: 4 },
  // Arms
  { name: 'Barbell Curl', category: 'arms', muscleGroup: 'Biceps', equipment: 'barbell', difficulty: 'beginner', caloriesPerMinute: 5 },
  { name: 'Tricep Pushdown', category: 'arms', muscleGroup: 'Triceps', equipment: 'cable', difficulty: 'beginner', caloriesPerMinute: 5 },
  { name: 'Hammer Curl', category: 'arms', muscleGroup: 'Biceps', equipment: 'dumbbells', difficulty: 'beginner', caloriesPerMinute: 5 },
  { name: 'Skull Crushers', category: 'arms', muscleGroup: 'Triceps', equipment: 'barbell', difficulty: 'intermediate', caloriesPerMinute: 5 },
  { name: 'Preacher Curl', category: 'arms', muscleGroup: 'Biceps', equipment: 'barbell', difficulty: 'beginner', caloriesPerMinute: 5 },
  { name: 'Overhead Tricep Extension', category: 'arms', muscleGroup: 'Triceps', equipment: 'dumbbells', difficulty: 'beginner', caloriesPerMinute: 5 },
  // Core
  { name: 'Plank', category: 'core', muscleGroup: 'Abs', equipment: 'bodyweight', difficulty: 'beginner', caloriesPerMinute: 4 },
  { name: 'Hanging Leg Raise', category: 'core', muscleGroup: 'Abs', equipment: 'bodyweight', difficulty: 'intermediate', caloriesPerMinute: 6 },
  { name: 'Cable Crunch', category: 'core', muscleGroup: 'Abs', equipment: 'cable', difficulty: 'beginner', caloriesPerMinute: 5 },
  { name: 'Russian Twist', category: 'core', muscleGroup: 'Obliques', equipment: 'bodyweight', difficulty: 'beginner', caloriesPerMinute: 5 },
  { name: 'Ab Wheel Rollout', category: 'core', muscleGroup: 'Abs', equipment: 'ab wheel', difficulty: 'intermediate', caloriesPerMinute: 6 },
  // Cardio
  { name: 'Treadmill Running', category: 'cardio', muscleGroup: 'Full Body', equipment: 'treadmill', difficulty: 'beginner', caloriesPerMinute: 10 },
  { name: 'Cycling', category: 'cardio', muscleGroup: 'Legs', equipment: 'bike', difficulty: 'beginner', caloriesPerMinute: 8 },
  { name: 'Rowing Machine', category: 'cardio', muscleGroup: 'Full Body', equipment: 'rower', difficulty: 'beginner', caloriesPerMinute: 9 },
  { name: 'Jump Rope', category: 'cardio', muscleGroup: 'Full Body', equipment: 'jump rope', difficulty: 'beginner', caloriesPerMinute: 12 },
  { name: 'Stair Climber', category: 'cardio', muscleGroup: 'Legs', equipment: 'machine', difficulty: 'beginner', caloriesPerMinute: 9 },
];

const foods = [
  // Protein sources
  { name: 'Chicken Breast (Grilled)', category: 'protein', servingSize: 100, servingUnit: 'g', calories: 165, protein: 31, carbs: 0, fats: 3.6 },
  { name: 'Salmon Fillet', category: 'protein', servingSize: 100, servingUnit: 'g', calories: 208, protein: 20, carbs: 0, fats: 13 },
  { name: 'Ground Turkey', category: 'protein', servingSize: 100, servingUnit: 'g', calories: 170, protein: 21, carbs: 0, fats: 9.4 },
  { name: 'Eggs (Large)', category: 'protein', servingSize: 1, servingUnit: 'egg', calories: 72, protein: 6.3, carbs: 0.4, fats: 4.8 },
  { name: 'Tuna (Canned)', category: 'protein', servingSize: 100, servingUnit: 'g', calories: 116, protein: 26, carbs: 0, fats: 0.8 },
  { name: 'Tofu (Firm)', category: 'protein', servingSize: 100, servingUnit: 'g', calories: 144, protein: 17, carbs: 3, fats: 8.7 },
  { name: 'Beef Steak (Sirloin)', category: 'protein', servingSize: 100, servingUnit: 'g', calories: 206, protein: 26, carbs: 0, fats: 11 },
  { name: 'Shrimp', category: 'protein', servingSize: 100, servingUnit: 'g', calories: 99, protein: 24, carbs: 0.2, fats: 0.3 },
  // Carb sources
  { name: 'White Rice (Cooked)', category: 'carbs', servingSize: 100, servingUnit: 'g', calories: 130, protein: 2.7, carbs: 28, fats: 0.3 },
  { name: 'Brown Rice (Cooked)', category: 'carbs', servingSize: 100, servingUnit: 'g', calories: 123, protein: 2.7, carbs: 26, fats: 1 },
  { name: 'Sweet Potato', category: 'carbs', servingSize: 100, servingUnit: 'g', calories: 86, protein: 1.6, carbs: 20, fats: 0.1 },
  { name: 'Oats', category: 'carbs', servingSize: 100, servingUnit: 'g', calories: 389, protein: 17, carbs: 66, fats: 6.9 },
  { name: 'Whole Wheat Bread', category: 'grains', servingSize: 1, servingUnit: 'slice', calories: 81, protein: 4, carbs: 14, fats: 1 },
  { name: 'Pasta (Cooked)', category: 'carbs', servingSize: 100, servingUnit: 'g', calories: 131, protein: 5, carbs: 25, fats: 1.1 },
  { name: 'Quinoa (Cooked)', category: 'carbs', servingSize: 100, servingUnit: 'g', calories: 120, protein: 4.4, carbs: 21, fats: 1.9 },
  // Dairy
  { name: 'Greek Yogurt (Plain)', category: 'dairy', servingSize: 100, servingUnit: 'g', calories: 59, protein: 10, carbs: 3.6, fats: 0.7 },
  { name: 'Whole Milk', category: 'dairy', servingSize: 250, servingUnit: 'ml', calories: 149, protein: 8, carbs: 12, fats: 8 },
  { name: 'Cottage Cheese', category: 'dairy', servingSize: 100, servingUnit: 'g', calories: 98, protein: 11, carbs: 3.4, fats: 4.3 },
  { name: 'Whey Protein Shake', category: 'supplements', servingSize: 1, servingUnit: 'scoop', calories: 120, protein: 24, carbs: 3, fats: 1.5 },
  // Fats
  { name: 'Peanut Butter', category: 'fats', servingSize: 32, servingUnit: 'g', calories: 188, protein: 8, carbs: 6, fats: 16 },
  { name: 'Almonds', category: 'fats', servingSize: 28, servingUnit: 'g', calories: 164, protein: 6, carbs: 6, fats: 14 },
  { name: 'Avocado', category: 'fats', servingSize: 100, servingUnit: 'g', calories: 160, protein: 2, carbs: 9, fats: 15 },
  { name: 'Olive Oil', category: 'fats', servingSize: 15, servingUnit: 'ml', calories: 119, protein: 0, carbs: 0, fats: 14 },
  // Fruits & Vegetables
  { name: 'Banana', category: 'fruits', servingSize: 1, servingUnit: 'medium', calories: 105, protein: 1.3, carbs: 27, fats: 0.4 },
  { name: 'Apple', category: 'fruits', servingSize: 1, servingUnit: 'medium', calories: 95, protein: 0.5, carbs: 25, fats: 0.3 },
  { name: 'Broccoli', category: 'vegetables', servingSize: 100, servingUnit: 'g', calories: 34, protein: 2.8, carbs: 7, fats: 0.4 },
  { name: 'Spinach', category: 'vegetables', servingSize: 100, servingUnit: 'g', calories: 23, protein: 2.9, carbs: 3.6, fats: 0.4 },
  // Snacks
  { name: 'Protein Bar', category: 'snacks', servingSize: 1, servingUnit: 'bar', calories: 200, protein: 20, carbs: 22, fats: 7 },
  { name: 'Rice Cakes', category: 'snacks', servingSize: 2, servingUnit: 'cakes', calories: 70, protein: 1.4, carbs: 15, fats: 0.4 },
  // Beverages
  { name: 'Black Coffee', category: 'beverages', servingSize: 250, servingUnit: 'ml', calories: 2, protein: 0.3, carbs: 0, fats: 0 },
  { name: 'Orange Juice', category: 'beverages', servingSize: 250, servingUnit: 'ml', calories: 112, protein: 1.7, carbs: 26, fats: 0.5 },
];

const workoutPrograms = [
  {
    name: 'Push Pull Legs',
    description: 'Classic PPL split — 6 days/week for intermediate to advanced lifters. Focuses on balanced push/pull/leg development.',
    category: 'hypertrophy', difficulty: 'intermediate', daysPerWeek: 6, duration: '12 weeks', isPredefined: true,
    days: [
      { dayName: 'Push A', dayNumber: 1, exercises: [
        { exerciseName: 'Bench Press', sets: 4, reps: '6-8', restTime: 120 },
        { exerciseName: 'Overhead Press', sets: 3, reps: '8-10', restTime: 90 },
        { exerciseName: 'Incline Dumbbell Press', sets: 3, reps: '10-12', restTime: 90 },
        { exerciseName: 'Lateral Raises', sets: 4, reps: '12-15', restTime: 60 },
        { exerciseName: 'Tricep Pushdown', sets: 3, reps: '10-12', restTime: 60 },
      ]},
      { dayName: 'Pull A', dayNumber: 2, exercises: [
        { exerciseName: 'Deadlift', sets: 3, reps: '5', restTime: 180 },
        { exerciseName: 'Pull-ups', sets: 4, reps: '6-10', restTime: 120 },
        { exerciseName: 'Barbell Row', sets: 3, reps: '8-10', restTime: 90 },
        { exerciseName: 'Face Pulls', sets: 3, reps: '15-20', restTime: 60 },
        { exerciseName: 'Barbell Curl', sets: 3, reps: '10-12', restTime: 60 },
      ]},
      { dayName: 'Legs A', dayNumber: 3, exercises: [
        { exerciseName: 'Barbell Squat', sets: 4, reps: '6-8', restTime: 180 },
        { exerciseName: 'Romanian Deadlift', sets: 3, reps: '8-10', restTime: 120 },
        { exerciseName: 'Leg Press', sets: 3, reps: '10-12', restTime: 90 },
        { exerciseName: 'Leg Curl', sets: 3, reps: '10-12', restTime: 60 },
        { exerciseName: 'Calf Raises', sets: 4, reps: '12-15', restTime: 60 },
      ]},
      { dayName: 'Push B', dayNumber: 4, exercises: [
        { exerciseName: 'Overhead Press', sets: 4, reps: '6-8', restTime: 120 },
        { exerciseName: 'Incline Dumbbell Press', sets: 3, reps: '8-10', restTime: 90 },
        { exerciseName: 'Cable Flyes', sets: 3, reps: '12-15', restTime: 60 },
        { exerciseName: 'Arnold Press', sets: 3, reps: '10-12', restTime: 90 },
        { exerciseName: 'Skull Crushers', sets: 3, reps: '10-12', restTime: 60 },
      ]},
      { dayName: 'Pull B', dayNumber: 5, exercises: [
        { exerciseName: 'Barbell Row', sets: 4, reps: '6-8', restTime: 120 },
        { exerciseName: 'Lat Pulldown', sets: 3, reps: '10-12', restTime: 90 },
        { exerciseName: 'Seated Cable Row', sets: 3, reps: '10-12', restTime: 90 },
        { exerciseName: 'Rear Delt Fly', sets: 3, reps: '15-20', restTime: 60 },
        { exerciseName: 'Hammer Curl', sets: 3, reps: '10-12', restTime: 60 },
      ]},
      { dayName: 'Legs B', dayNumber: 6, exercises: [
        { exerciseName: 'Leg Press', sets: 4, reps: '10-12', restTime: 120 },
        { exerciseName: 'Bulgarian Split Squat', sets: 3, reps: '10-12', restTime: 90 },
        { exerciseName: 'Leg Extension', sets: 3, reps: '12-15', restTime: 60 },
        { exerciseName: 'Hip Thrust', sets: 3, reps: '10-12', restTime: 90 },
        { exerciseName: 'Calf Raises', sets: 4, reps: '12-15', restTime: 60 },
      ]},
    ]
  },
  {
    name: 'Upper Lower Split',
    description: 'Balanced 4-day upper/lower split great for strength and hypertrophy.',
    category: 'general', difficulty: 'intermediate', daysPerWeek: 4, duration: '10 weeks', isPredefined: true,
    days: [
      { dayName: 'Upper A', dayNumber: 1, exercises: [
        { exerciseName: 'Bench Press', sets: 4, reps: '6-8', restTime: 120 },
        { exerciseName: 'Barbell Row', sets: 4, reps: '6-8', restTime: 120 },
        { exerciseName: 'Overhead Press', sets: 3, reps: '8-10', restTime: 90 },
        { exerciseName: 'Lat Pulldown', sets: 3, reps: '10-12', restTime: 90 },
        { exerciseName: 'Barbell Curl', sets: 2, reps: '10-12', restTime: 60 },
        { exerciseName: 'Tricep Pushdown', sets: 2, reps: '10-12', restTime: 60 },
      ]},
      { dayName: 'Lower A', dayNumber: 2, exercises: [
        { exerciseName: 'Barbell Squat', sets: 4, reps: '6-8', restTime: 180 },
        { exerciseName: 'Romanian Deadlift', sets: 3, reps: '8-10', restTime: 120 },
        { exerciseName: 'Leg Press', sets: 3, reps: '10-12', restTime: 90 },
        { exerciseName: 'Leg Curl', sets: 3, reps: '10-12', restTime: 60 },
        { exerciseName: 'Calf Raises', sets: 3, reps: '12-15', restTime: 60 },
      ]},
      { dayName: 'Upper B', dayNumber: 3, exercises: [
        { exerciseName: 'Incline Dumbbell Press', sets: 3, reps: '8-10', restTime: 90 },
        { exerciseName: 'Seated Cable Row', sets: 3, reps: '10-12', restTime: 90 },
        { exerciseName: 'Arnold Press', sets: 3, reps: '10-12', restTime: 90 },
        { exerciseName: 'Cable Flyes', sets: 3, reps: '12-15', restTime: 60 },
        { exerciseName: 'Hammer Curl', sets: 2, reps: '10-12', restTime: 60 },
        { exerciseName: 'Overhead Tricep Extension', sets: 2, reps: '10-12', restTime: 60 },
      ]},
      { dayName: 'Lower B', dayNumber: 4, exercises: [
        { exerciseName: 'Deadlift', sets: 3, reps: '5', restTime: 180 },
        { exerciseName: 'Bulgarian Split Squat', sets: 3, reps: '10-12', restTime: 90 },
        { exerciseName: 'Leg Extension', sets: 3, reps: '12-15', restTime: 60 },
        { exerciseName: 'Hip Thrust', sets: 3, reps: '10-12', restTime: 90 },
        { exerciseName: 'Calf Raises', sets: 3, reps: '12-15', restTime: 60 },
      ]},
    ]
  },
  {
    name: 'Full Body Program',
    description: '3-day full body program ideal for beginners or those with limited time.',
    category: 'general', difficulty: 'beginner', daysPerWeek: 3, duration: '8 weeks', isPredefined: true,
    days: [
      { dayName: 'Full Body A', dayNumber: 1, exercises: [
        { exerciseName: 'Barbell Squat', sets: 3, reps: '8-10', restTime: 120 },
        { exerciseName: 'Bench Press', sets: 3, reps: '8-10', restTime: 120 },
        { exerciseName: 'Barbell Row', sets: 3, reps: '8-10', restTime: 90 },
        { exerciseName: 'Overhead Press', sets: 2, reps: '10-12', restTime: 90 },
        { exerciseName: 'Plank', sets: 3, reps: '30-60s', restTime: 60 },
      ]},
      { dayName: 'Full Body B', dayNumber: 2, exercises: [
        { exerciseName: 'Deadlift', sets: 3, reps: '6-8', restTime: 120 },
        { exerciseName: 'Incline Dumbbell Press', sets: 3, reps: '10-12', restTime: 90 },
        { exerciseName: 'Pull-ups', sets: 3, reps: '6-10', restTime: 90 },
        { exerciseName: 'Lateral Raises', sets: 3, reps: '12-15', restTime: 60 },
        { exerciseName: 'Hanging Leg Raise', sets: 3, reps: '10-15', restTime: 60 },
      ]},
      { dayName: 'Full Body C', dayNumber: 3, exercises: [
        { exerciseName: 'Leg Press', sets: 3, reps: '10-12', restTime: 90 },
        { exerciseName: 'Cable Flyes', sets: 3, reps: '12-15', restTime: 60 },
        { exerciseName: 'Lat Pulldown', sets: 3, reps: '10-12', restTime: 90 },
        { exerciseName: 'Arnold Press', sets: 3, reps: '10-12', restTime: 90 },
        { exerciseName: 'Russian Twist', sets: 3, reps: '15-20', restTime: 60 },
      ]},
    ]
  },
  {
    name: 'Beginner Gym Program',
    description: 'Simple 3-day program for absolute beginners. Focuses on compound movements and learning form.',
    category: 'beginner', difficulty: 'beginner', daysPerWeek: 3, duration: '6 weeks', isPredefined: true,
    days: [
      { dayName: 'Day 1', dayNumber: 1, exercises: [
        { exerciseName: 'Barbell Squat', sets: 3, reps: '8', restTime: 120 },
        { exerciseName: 'Bench Press', sets: 3, reps: '8', restTime: 120 },
        { exerciseName: 'Barbell Row', sets: 3, reps: '8', restTime: 90 },
      ]},
      { dayName: 'Day 2', dayNumber: 2, exercises: [
        { exerciseName: 'Deadlift', sets: 3, reps: '5', restTime: 180 },
        { exerciseName: 'Overhead Press', sets: 3, reps: '8', restTime: 120 },
        { exerciseName: 'Pull-ups', sets: 3, reps: 'AMRAP', restTime: 120 },
      ]},
      { dayName: 'Day 3', dayNumber: 3, exercises: [
        { exerciseName: 'Barbell Squat', sets: 3, reps: '8', restTime: 120 },
        { exerciseName: 'Bench Press', sets: 3, reps: '8', restTime: 120 },
        { exerciseName: 'Barbell Row', sets: 3, reps: '8', restTime: 90 },
      ]},
    ]
  },
  {
    name: 'Hypertrophy Program',
    description: '5-day bodybuilding-style program focused on maximizing muscle growth with higher volume.',
    category: 'hypertrophy', difficulty: 'intermediate', daysPerWeek: 5, duration: '10 weeks', isPredefined: true,
    days: [
      { dayName: 'Chest & Triceps', dayNumber: 1, exercises: [
        { exerciseName: 'Bench Press', sets: 4, reps: '8-10', restTime: 90 },
        { exerciseName: 'Incline Dumbbell Press', sets: 4, reps: '10-12', restTime: 90 },
        { exerciseName: 'Cable Flyes', sets: 3, reps: '12-15', restTime: 60 },
        { exerciseName: 'Chest Dips', sets: 3, reps: '10-12', restTime: 90 },
        { exerciseName: 'Tricep Pushdown', sets: 3, reps: '10-12', restTime: 60 },
        { exerciseName: 'Skull Crushers', sets: 3, reps: '10-12', restTime: 60 },
      ]},
      { dayName: 'Back & Biceps', dayNumber: 2, exercises: [
        { exerciseName: 'Barbell Row', sets: 4, reps: '8-10', restTime: 90 },
        { exerciseName: 'Pull-ups', sets: 4, reps: '8-10', restTime: 90 },
        { exerciseName: 'Seated Cable Row', sets: 3, reps: '10-12', restTime: 90 },
        { exerciseName: 'T-Bar Row', sets: 3, reps: '10-12', restTime: 90 },
        { exerciseName: 'Barbell Curl', sets: 3, reps: '10-12', restTime: 60 },
        { exerciseName: 'Hammer Curl', sets: 3, reps: '10-12', restTime: 60 },
      ]},
      { dayName: 'Legs', dayNumber: 3, exercises: [
        { exerciseName: 'Barbell Squat', sets: 4, reps: '8-10', restTime: 120 },
        { exerciseName: 'Leg Press', sets: 4, reps: '10-12', restTime: 90 },
        { exerciseName: 'Romanian Deadlift', sets: 3, reps: '10-12', restTime: 90 },
        { exerciseName: 'Leg Extension', sets: 3, reps: '12-15', restTime: 60 },
        { exerciseName: 'Leg Curl', sets: 3, reps: '12-15', restTime: 60 },
        { exerciseName: 'Calf Raises', sets: 4, reps: '15-20', restTime: 60 },
      ]},
      { dayName: 'Shoulders', dayNumber: 4, exercises: [
        { exerciseName: 'Overhead Press', sets: 4, reps: '8-10', restTime: 90 },
        { exerciseName: 'Arnold Press', sets: 3, reps: '10-12', restTime: 90 },
        { exerciseName: 'Lateral Raises', sets: 4, reps: '12-15', restTime: 60 },
        { exerciseName: 'Front Raises', sets: 3, reps: '12-15', restTime: 60 },
        { exerciseName: 'Rear Delt Fly', sets: 3, reps: '15-20', restTime: 60 },
        { exerciseName: 'Face Pulls', sets: 3, reps: '15-20', restTime: 60 },
      ]},
      { dayName: 'Arms & Core', dayNumber: 5, exercises: [
        { exerciseName: 'Barbell Curl', sets: 3, reps: '8-10', restTime: 60 },
        { exerciseName: 'Tricep Pushdown', sets: 3, reps: '10-12', restTime: 60 },
        { exerciseName: 'Preacher Curl', sets: 3, reps: '10-12', restTime: 60 },
        { exerciseName: 'Overhead Tricep Extension', sets: 3, reps: '10-12', restTime: 60 },
        { exerciseName: 'Hanging Leg Raise', sets: 3, reps: '12-15', restTime: 60 },
        { exerciseName: 'Cable Crunch', sets: 3, reps: '15-20', restTime: 60 },
      ]},
    ]
  },
  {
    name: 'Strength Program (5x5)',
    description: 'Pure strength-focused 3-day program based on heavy compound lifts with 5x5 progression.',
    category: 'strength', difficulty: 'intermediate', daysPerWeek: 3, duration: '12 weeks', isPredefined: true,
    days: [
      { dayName: 'Workout A', dayNumber: 1, exercises: [
        { exerciseName: 'Barbell Squat', sets: 5, reps: '5', restTime: 180 },
        { exerciseName: 'Bench Press', sets: 5, reps: '5', restTime: 180 },
        { exerciseName: 'Barbell Row', sets: 5, reps: '5', restTime: 120 },
      ]},
      { dayName: 'Workout B', dayNumber: 2, exercises: [
        { exerciseName: 'Barbell Squat', sets: 5, reps: '5', restTime: 180 },
        { exerciseName: 'Overhead Press', sets: 5, reps: '5', restTime: 180 },
        { exerciseName: 'Deadlift', sets: 1, reps: '5', restTime: 300 },
      ]},
      { dayName: 'Workout A', dayNumber: 3, exercises: [
        { exerciseName: 'Barbell Squat', sets: 5, reps: '5', restTime: 180 },
        { exerciseName: 'Bench Press', sets: 5, reps: '5', restTime: 180 },
        { exerciseName: 'Barbell Row', sets: 5, reps: '5', restTime: 120 },
      ]},
    ]
  },
];

async function seedData() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing predefined data
    await Exercise.deleteMany({ isCustom: false });
    await FoodItem.deleteMany({ isCustom: false });
    await WorkoutProgram.deleteMany({ isPredefined: true });

    // Seed exercises
    await Exercise.insertMany(exercises);
    console.log(`Seeded ${exercises.length} exercises`);

    // Seed food items
    await FoodItem.insertMany(foods);
    console.log(`Seeded ${foods.length} food items`);

    // Seed workout programs
    await WorkoutProgram.insertMany(workoutPrograms);
    console.log(`Seeded ${workoutPrograms.length} workout programs`);

    // Create default admin user if not exists
    const adminExists = await User.findOne({ email: 'admin@fitvault.com' });
    if (!adminExists) {
      await User.create({
        name: 'Admin',
        email: 'admin@fitvault.com',
        password: 'admin123',
        role: 'admin',
        fitnessGoal: 'maintenance'
      });
      console.log('Created admin user: admin@fitvault.com / admin123');
    }

    console.log('Seed complete!');
    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
}

seedData();
