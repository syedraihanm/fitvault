'use client';
import { useState, useEffect } from 'react';
import { nutritionAPI } from '@/lib/api';
import { useAuth } from '@/lib/auth';

export default function Nutrition() {
  const { user } = useAuth();
  const [meals, setMeals] = useState([]);
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedMealType, setSelectedMealType] = useState('breakfast');
  const [search, setSearch] = useState('');
  
  const [stats, setStats] = useState({ calories: 0, protein: 0, carbs: 0, fats: 0 });

  useEffect(() => {
    fetchMeals();
    fetchFoods();
  }, []);

  const fetchMeals = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const res = await nutritionAPI.getMeals({ date: today });
      setMeals(res.data.meals);
      
      const st = { calories: 0, protein: 0, carbs: 0, fats: 0 };
      res.data.meals.forEach(m => {
        st.calories += m.totalCalories; st.protein += m.totalProtein;
        st.carbs += m.totalCarbs; st.fats += m.totalFats;
      });
      setStats(st);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const fetchFoods = async () => {
    try {
      const res = await nutritionAPI.getFoods({ limit: 100 });
      setFoods(res.data.foods);
    } catch (err) { console.error(err); }
  };

  const handleLogFood = async (food) => {
    try {
      // Create new meal log or add to existing if same type today (simplified for UI: just create new entry)
      await nutritionAPI.createMeal({
        date: new Date().toISOString(),
        mealType: selectedMealType,
        entries: [{
          foodItem: food._id,
          foodName: food.name,
          servings: 1,
          calories: food.calories,
          protein: food.protein,
          carbs: food.carbs,
          fats: food.fats
        }]
      });
      setShowModal(false);
      fetchMeals();
    } catch (err) { console.error(err); alert('Failed to log food'); }
  };

  const deleteMeal = async (id) => {
    if (!confirm('Delete this entry?')) return;
    try {
      await nutritionAPI.deleteMeal(id);
      fetchMeals();
    } catch (err) { console.error(err); }
  };

  if (loading) return <div className="loading"><div className="spinner"></div></div>;

  const mealTypes = ['breakfast', 'lunch', 'dinner', 'snacks'];
  const filteredFoods = foods.filter(f => f.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="fade-in">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1>Nutrition & Macros</h1>
          <p>Today {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
        </div>
      </div>

      {/* Macros Summary Box */}
      <div className="card" style={{ marginBottom: 32, padding: 32, background: 'var(--bg-secondary)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <div>
            <div style={{ fontSize: 14, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: 1 }}>Calories Remaining</div>
            <div style={{ fontSize: 36, fontWeight: 800, color: 'var(--accent-primary)' }}>
              {Math.max(0, (user?.dailyCalorieTarget || 2000) - stats.calories).toLocaleString()}
            </div>
            <div style={{ fontSize: 14, color: 'var(--text-muted)' }}>Goal: {user?.dailyCalorieTarget || 2000} - Food: {stats.calories}</div>
          </div>
        </div>

        <div className="grid-3" style={{ gap: 16 }}>
          <div className="stat-card" style={{ padding: 16 }}>
            <div className="stat-label">Protein</div>
            <div className="stat-value" style={{ fontSize: 20 }}>{stats.protein}g <span style={{ fontSize: 12, fontWeight: 400, color: 'var(--text-muted)' }}>/ {user?.dailyProteinTarget || 150}g</span></div>
            <div className="progress-bar"><div className="progress-fill purple" style={{ width: `${Math.min(100, (stats.protein/(user?.dailyProteinTarget || 150))*100)}%` }}></div></div>
          </div>
          <div className="stat-card" style={{ padding: 16 }}>
            <div className="stat-label">Carbs</div>
            <div className="stat-value" style={{ fontSize: 20 }}>{stats.carbs}g</div>
            <div className="progress-bar"><div className="progress-fill cyan" style={{ width: `${Math.min(100, (stats.carbs/250)*100)}%` }}></div></div>
          </div>
          <div className="stat-card" style={{ padding: 16 }}>
            <div className="stat-label">Fats</div>
            <div className="stat-value" style={{ fontSize: 20 }}>{stats.fats}g</div>
            <div className="progress-bar"><div className="progress-fill fire" style={{ width: `${Math.min(100, (stats.fats/70)*100)}%` }}></div></div>
          </div>
        </div>
      </div>

      {/* Meal Sections */}
      <div className="grid-2">
        {mealTypes.map(type => {
          const typeMeals = meals.filter(m => m.mealType === type);
          const typeCals = typeMeals.reduce((s, m) => s + m.totalCalories, 0);

          return (
            <div key={type} className="card">
              <div className="card-header" style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: 16 }}>
                <div>
                  <h3 className="card-title" style={{ textTransform: 'capitalize' }}>{type}</h3>
                  <div className="card-subtitle">{typeCals} kcal</div>
                </div>
                <button className="btn btn-secondary btn-sm" onClick={() => { setSelectedMealType(type); setShowModal(true); }}>+ Add Food</button>
              </div>
              
              <div style={{ paddingTop: 16 }}>
                {typeMeals.length === 0 ? (
                  <div style={{ fontSize: 14, color: 'var(--text-muted)', textAlign: 'center', padding: '16px 0' }}>No foods logged</div>
                ) : (
                  typeMeals.map(meal => (
                    <div key={meal._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                      <div>
                        {meal.entries.map((e, idx) => (
                          <div key={idx}>
                            <div style={{ fontSize: 14, fontWeight: 500 }}>{e.foodName}</div>
                            <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{e.calories} kcal • {e.protein}g P • {e.carbs}g C • {e.fats}g F</div>
                          </div>
                        ))}
                      </div>
                      <button className="btn-icon" style={{ color: 'var(--accent-secondary)' }} onClick={() => deleteMeal(meal._id)}>✕</button>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Food Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2 className="modal-title">Add to {selectedMealType}</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>✕</button>
            </div>

            <input 
              type="text" 
              className="form-input" 
              placeholder="Search foods..." 
              value={search} 
              onChange={e => setSearch(e.target.value)}
              style={{ marginBottom: 16 }}
            />

            <div style={{ maxHeight: 400, overflowY: 'auto' }}>
              {filteredFoods.map(food => (
                <div key={food._id} className="card" style={{ padding: 12, marginBottom: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }} onClick={() => handleLogFood(food)}>
                  <div>
                    <div style={{ fontWeight: 600 }}>{food.name} <span className="badge badge-primary" style={{ marginLeft: 8, fontSize: 10 }}>{food.category}</span></div>
                    <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                      {food.servingSize}{food.servingUnit} • {food.calories} kcal • {food.protein}g P • {food.carbs}g C • {food.fats}g F
                    </div>
                  </div>
                  <div style={{ color: 'var(--accent-primary)', fontSize: 20 }}>+</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
