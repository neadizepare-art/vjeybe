import { useState, useEffect } from "react";

const PROFILE = {
  height: 160,
  weight: 49,
  dailySteps: 10000,
  goal: "toning",
  // TDEE: BMR ~1270 kcal + activity (lightly active ~1.55) ≈ 1970 kcal
  // For toning: slight deficit ~1700 kcal target
  calorieGoal: 1700,
  proteinGoal: 120, // g — critical for toning
};

const TRAINING_PLAN = [
  {
    day: "Monday",
    focus: "Lower Body",
    tag: "Glutes & Legs",
    color: "#E8845A",
    icon: "🍑",
    exercises: [
      { name: "Bodyweight Squat", sets: 4, reps: "15", rest: "45s", tip: "Drive knees out, chest tall, sit back like a chair" },
      { name: "Glute Bridge", sets: 4, reps: "15", rest: "45s", tip: "Squeeze hard at the top for 2 full seconds" },
      { name: "Reverse Lunge", sets: 3, reps: "10 each leg", rest: "45s", tip: "Back knee hovers 2cm above floor, front shin stays vertical" },
      { name: "Sumo Squat", sets: 3, reps: "12", rest: "45s", tip: "Wide stance, toes out 45°, feel inner thighs working" },
      { name: "Single-Leg Glute Bridge", sets: 3, reps: "12 each", rest: "30s", tip: "Non-working leg stays bent and lifted — don't let hips drop" },
      { name: "Calf Raise", sets: 3, reps: "20", rest: "30s", tip: "Full range — heels all the way down, rise all the way up" },
    ],
  },
  {
    day: "Tuesday",
    focus: "Run",
    tag: "Easy 30 min",
    color: "#5BC4E6",
    icon: "🏃‍♀️",
    runDay: true,
    runPlan: {
      duration: "30 min",
      structure: [
        { phase: "Warm-up walk", time: "5 min", note: "Brisk walk, get heart rate up" },
        { phase: "Easy jog", time: "20 min", note: "Conversational pace — you can talk in full sentences" },
        { phase: "Cool-down walk", time: "5 min", note: "Slow down gradually, deep breaths" },
      ],
      tip: "Easy run days build your aerobic base. Don't go hard — you should feel refreshed, not wrecked.",
      calBurn: 240,
    },
  },
  {
    day: "Wednesday",
    focus: "Upper Body",
    tag: "Push & Pull",
    color: "#C46ECF",
    icon: "💪",
    exercises: [
      { name: "Push-Up", sets: 4, reps: "10–12", rest: "60s", tip: "Core tight, lower chest to floor, full range of motion" },
      { name: "Wide Push-Up", sets: 3, reps: "10", rest: "60s", tip: "Hands wider than shoulders — hits chest more" },
      { name: "Tricep Push-Up", sets: 3, reps: "10", rest: "60s", tip: "Elbows point straight back, not out to the sides" },
      { name: "Superman Hold", sets: 3, reps: "12", rest: "45s", tip: "Lift arms and legs simultaneously, squeeze back at top" },
      { name: "Pike Push-Up", sets: 3, reps: "8", rest: "60s", tip: "Hips high, lower head toward floor — works shoulders" },
      { name: "Plank Shoulder Tap", sets: 3, reps: "10 each", rest: "45s", tip: "Hips stay level — resist the rotation, that's the point" },
    ],
  },
  {
    day: "Thursday",
    focus: "Core & Glutes",
    tag: "Stability",
    color: "#E8C05A",
    icon: "🔥",
    exercises: [
      { name: "Plank", sets: 3, reps: "45s hold", rest: "45s", tip: "Squeeze glutes AND abs simultaneously — whole body tight" },
      { name: "Dead Bug", sets: 3, reps: "10 each side", rest: "45s", tip: "Low back stays imprinted on floor the entire time" },
      { name: "Hip Thrust (floor)", sets: 4, reps: "15", rest: "45s", tip: "Shoulders on floor, drive hips up — full extension at top" },
      { name: "Side-Lying Clam", sets: 3, reps: "15 each", rest: "30s", tip: "Feet stay stacked, only the top knee rotates open" },
      { name: "Mountain Climber", sets: 3, reps: "30s", rest: "30s", tip: "Hips stay level — don't let them pike up or sag" },
      { name: "Bicycle Crunch", sets: 3, reps: "20 total", rest: "30s", tip: "Slow and controlled — elbow to opposite knee, twist fully" },
    ],
  },
  {
    day: "Friday",
    focus: "Full Body",
    tag: "No Equipment",
    color: "#7EC89A",
    icon: "⚡",
    exercises: [
      { name: "Squat Jump", sets: 4, reps: "10", rest: "60s", tip: "Land softly with bent knees — absorb the impact" },
      { name: "Push-Up to Down Dog", sets: 3, reps: "10", rest: "60s", tip: "Push-up, then press hips up into downward dog stretch" },
      { name: "Alternating Reverse Lunge", sets: 3, reps: "10 each", rest: "60s", tip: "Smooth, controlled step back — keep torso upright" },
      { name: "Burpee", sets: 3, reps: "8", rest: "60s", tip: "Step back instead of jumping if needed — form over speed" },
      { name: "Side Plank", sets: 3, reps: "30s each", rest: "30s", tip: "Stack feet or stagger them — hips high, body straight" },
      { name: "Donkey Kick", sets: 3, reps: "15 each", rest: "30s", tip: "Keep hips square to floor — kick straight up, squeeze glute" },
    ],
  },
  {
    day: "Saturday",
    focus: "Run",
    tag: "Interval 25 min",
    color: "#E85A5A",
    icon: "🏃‍♀️",
    runDay: true,
    runPlan: {
      duration: "25 min",
      structure: [
        { phase: "Warm-up walk", time: "5 min", note: "Start easy, loosen up" },
        { phase: "Intervals ×5", time: "15 min", note: "1 min fast run + 2 min easy jog — repeat 5 times" },
        { phase: "Cool-down walk", time: "5 min", note: "Walk it out, stretch calves and hip flexors after" },
      ],
      tip: "Interval runs are your secret weapon for toning — they spike your metabolism for hours after. Push during the 1-min efforts.",
      calBurn: 290,
    },
  },
  {
    day: "Sunday",
    focus: "Rest",
    tag: "Full Recovery",
    color: "#A0A0A0",
    icon: "💤",
    exercises: [],
    restDay: true,
  },
];

const FOOD_DB = [
  { name: "Chicken Breast (100g)", cal: 165, protein: 31, carbs: 0, fat: 3.6 },
  { name: "Greek Yogurt (150g)", cal: 88, protein: 15, carbs: 6, fat: 0.7 },
  { name: "Eggs (2 large)", cal: 143, protein: 13, carbs: 1, fat: 10 },
  { name: "Oats (50g dry)", cal: 190, protein: 7, carbs: 32, fat: 3.4 },
  { name: "Banana (medium)", cal: 89, protein: 1.1, carbs: 23, fat: 0.3 },
  { name: "Rice (100g cooked)", cal: 130, protein: 2.7, carbs: 28, fat: 0.3 },
  { name: "Broccoli (100g)", cal: 35, protein: 2.4, carbs: 7, fat: 0.4 },
  { name: "Salmon (100g)", cal: 208, protein: 20, carbs: 0, fat: 13 },
  { name: "Almonds (30g)", cal: 173, protein: 6, carbs: 6, fat: 15 },
  { name: "Sweet Potato (150g)", cal: 130, protein: 2.4, carbs: 30, fat: 0.2 },
  { name: "Cottage Cheese (100g)", cal: 98, protein: 11, carbs: 3.4, fat: 4.3 },
  { name: "Protein Shake (1 scoop)", cal: 120, protein: 24, carbs: 4, fat: 1.5 },
];

const DAYS_SHORT = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const TODAY_IDX = new Date().getDay() === 0 ? 6 : new Date().getDay() - 1;

export default function FitnessApp() {
  const [tab, setTab] = useState("today");
  const [selectedDay, setSelectedDay] = useState(TODAY_IDX);
  const [expandedExercise, setExpandedExercise] = useState(null);
  const [log, setLog] = useState([]);
  const [customFood, setCustomFood] = useState({ name: "", cal: "", protein: "", carbs: "", fat: "" });
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [completedSets, setCompletedSets] = useState({});
  const [steps, setSteps] = useState(PROFILE.dailySteps);

  const todayPlan = TRAINING_PLAN[TODAY_IDX];
  const viewPlan = TRAINING_PLAN[selectedDay];

  const totalCals = log.reduce((s, i) => s + i.cal, 0);
  const totalProtein = log.reduce((s, i) => s + i.protein, 0);
  const totalCarbs = log.reduce((s, i) => s + i.carbs, 0);
  const totalFat = log.reduce((s, i) => s + i.fat, 0);
  const stepsCalBurn = Math.round(steps * 0.04);
  const netCals = totalCals - stepsCalBurn;
  const calorieLeft = PROFILE.calorieGoal - netCals;

  const filteredFoods = FOOD_DB.filter(f =>
    f.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const addFood = (food) => {
    setLog(prev => [...prev, { ...food, id: Date.now() }]);
    setShowSearch(false);
    setSearchQuery("");
  };

  const addCustom = () => {
    if (!customFood.name || !customFood.cal) return;
    addFood({
      name: customFood.name,
      cal: +customFood.cal,
      protein: +customFood.protein || 0,
      carbs: +customFood.carbs || 0,
      fat: +customFood.fat || 0,
    });
    setCustomFood({ name: "", cal: "", protein: "", carbs: "", fat: "" });
  };

  const removeFood = (id) => setLog(prev => prev.filter(i => i.id !== id));

  const toggleSet = (exName, setNum) => {
    const key = `${exName}-${setNum}`;
    setCompletedSets(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const calPct = Math.min((netCals / PROFILE.calorieGoal) * 100, 100);
  const proteinPct = Math.min((totalProtein / PROFILE.proteinGoal) * 100, 100);

  const Ring = ({ pct, size = 64, stroke = 7, color, children }) => {
    const r = (size - stroke) / 2;
    const circ = 2 * Math.PI * r;
    const dash = (pct / 100) * circ;
    return (
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#2a2a2a" strokeWidth={stroke} />
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color}
          strokeWidth={stroke} strokeDasharray={`${dash} ${circ}`}
          strokeLinecap="round" style={{ transition: "stroke-dasharray 0.6s ease" }} />
        <foreignObject x={0} y={0} width={size} height={size}>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"center", height:size, transform:"rotate(90deg)" }}>
            {children}
          </div>
        </foreignObject>
      </svg>
    );
  };

  return (
    <div style={{ background: "#0f0f0f", minHeight: "100vh", maxWidth: 430, margin: "0 auto", fontFamily: "'Inter', system-ui, sans-serif", color: "#f0f0f0", paddingBottom: 80 }}>

      {/* Header */}
      <div style={{ padding: "28px 20px 16px", background: "linear-gradient(180deg, #181818 0%, #0f0f0f 100%)" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <p style={{ margin: 0, fontSize: 12, color: "#888", letterSpacing: "0.08em", textTransform: "uppercase" }}>Training for</p>
            <h1 style={{ margin: "2px 0 0", fontSize: 22, fontWeight: 700, letterSpacing: "-0.5px" }}>Toned Body ✨</h1>
          </div>
          <div style={{ textAlign: "right" }}>
            <p style={{ margin: 0, fontSize: 11, color: "#888" }}>160cm · 49kg</p>
            <p style={{ margin: "2px 0 0", fontSize: 12, color: "#E8845A", fontWeight: 600 }}>{PROFILE.calorieGoal} kcal goal</p>
          </div>
        </div>

        {/* Day strip */}
        <div style={{ display: "flex", gap: 6, marginTop: 18, overflowX: "auto", paddingBottom: 2 }}>
          {DAYS_SHORT.map((d, i) => {
            const plan = TRAINING_PLAN[i];
            const isToday = i === TODAY_IDX;
            const isSel = i === selectedDay;
            return (
              <button key={d} onClick={() => { setSelectedDay(i); setTab("plan"); }}
                style={{ flex: "0 0 auto", padding: "8px 10px", borderRadius: 10, border: "none", cursor: "pointer", minWidth: 44, textAlign: "center",
                  background: isSel ? plan.color : isToday ? "#222" : "#181818",
                  color: isSel ? "#000" : isToday ? "#fff" : "#666",
                  fontWeight: isSel ? 700 : 500, fontSize: 12,
                  boxShadow: isSel ? `0 0 12px ${plan.color}55` : "none",
                  transition: "all 0.2s" }}>
                <div>{d}</div>
                <div style={{ fontSize: 9, marginTop: 2, opacity: 0.75 }}>{plan.icon}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", padding: "0 20px", gap: 8, borderBottom: "1px solid #1e1e1e" }}>
        {[["today", "Today"], ["plan", "Workout"], ["log", "Nutrition"]].map(([val, label]) => (
          <button key={val} onClick={() => setTab(val)}
            style={{ flex: 1, padding: "14px 0", background: "none", border: "none", cursor: "pointer",
              color: tab === val ? "#E8845A" : "#666", fontWeight: tab === val ? 700 : 400, fontSize: 13,
              borderBottom: tab === val ? "2px solid #E8845A" : "2px solid transparent",
              transition: "all 0.2s" }}>
            {label}
          </button>
        ))}
      </div>

      {/* TODAY TAB */}
      {tab === "today" && (
        <div style={{ padding: "20px 20px 0" }}>
          {/* Calorie summary */}
          <div style={{ background: "#181818", borderRadius: 16, padding: 20, marginBottom: 16, display: "flex", alignItems: "center", gap: 20 }}>
            <Ring pct={calPct} size={80} stroke={9} color={calorieLeft < 0 ? "#E85A5A" : "#E8845A"}>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 16, fontWeight: 800, color: calorieLeft < 0 ? "#E85A5A" : "#E8845A" }}>
                  {Math.abs(calorieLeft)}
                </div>
                <div style={{ fontSize: 9, color: "#888", marginTop: 1 }}>{calorieLeft < 0 ? "over" : "left"}</div>
              </div>
            </Ring>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <span style={{ fontSize: 12, color: "#888" }}>Eaten</span>
                <span style={{ fontSize: 13, fontWeight: 600 }}>{totalCals} kcal</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <span style={{ fontSize: 12, color: "#888" }}>Burned ({steps.toLocaleString()} steps)</span>
                <span style={{ fontSize: 13, fontWeight: 600, color: "#7EC89A" }}>−{stepsCalBurn} kcal</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontSize: 12, color: "#888" }}>Net</span>
                <span style={{ fontSize: 13, fontWeight: 700 }}>{netCals} / {PROFILE.calorieGoal}</span>
              </div>
            </div>
          </div>

          {/* Macros */}
          <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
            {[
              { label: "Protein", val: totalProtein, goal: PROFILE.proteinGoal, unit: "g", color: "#5B8EE6" },
              { label: "Carbs", val: totalCarbs, goal: 180, unit: "g", color: "#E8C05A" },
              { label: "Fat", val: totalFat, goal: 55, unit: "g", color: "#E85A5A" },
            ].map(m => (
              <div key={m.label} style={{ flex: 1, background: "#181818", borderRadius: 12, padding: "12px 10px", textAlign: "center" }}>
                <Ring pct={Math.min((m.val / m.goal) * 100, 100)} size={50} stroke={6} color={m.color}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: m.color }}>{m.val}</span>
                </Ring>
                <div style={{ fontSize: 11, color: "#888", marginTop: 4 }}>{m.label}</div>
                <div style={{ fontSize: 10, color: "#555" }}>{m.goal}{m.unit}</div>
              </div>
            ))}
          </div>

          {/* Steps */}
          <div style={{ background: "#181818", borderRadius: 16, padding: "14px 16px", marginBottom: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <span style={{ fontSize: 14, fontWeight: 600 }}>👟 Steps today</span>
              <span style={{ fontSize: 14, fontWeight: 700, color: "#7EC89A" }}>{steps.toLocaleString()}</span>
            </div>
            <input type="range" min={0} max={20000} step={500} value={steps}
              onChange={e => setSteps(+e.target.value)}
              style={{ width: "100%", accentColor: "#7EC89A" }} />
          </div>

          {/* Today's workout preview */}
          <div style={{ background: `linear-gradient(135deg, ${todayPlan.color}22 0%, #181818 100%)`, border: `1px solid ${todayPlan.color}33`, borderRadius: 16, padding: "16px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <p style={{ margin: 0, fontSize: 11, color: "#888", textTransform: "uppercase", letterSpacing: "0.06em" }}>Today</p>
                <p style={{ margin: "2px 0 0", fontSize: 17, fontWeight: 700 }}>{todayPlan.focus}</p>
                <p style={{ margin: "2px 0 0", fontSize: 12, color: todayPlan.color }}>{todayPlan.tag}</p>
              </div>
              <button onClick={() => setTab("plan")}
                style={{ background: todayPlan.color, color: "#000", border: "none", borderRadius: 10, padding: "10px 16px", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>
                Start →
              </button>
            </div>
            {!todayPlan.restDay && !todayPlan.runDay && (
              <p style={{ margin: "10px 0 0", fontSize: 12, color: "#888" }}>
                {todayPlan.exercises.length} exercises · ~{todayPlan.exercises.reduce((s, e) => s + e.sets, 0)} sets · no equipment needed
              </p>
            )}
            {todayPlan.runDay && (
              <p style={{ margin: "10px 0 0", fontSize: 12, color: "#888" }}>
                {todayPlan.runPlan.duration} · ~{todayPlan.runPlan.calBurn} kcal burn · outdoors
              </p>
            )}
          </div>
        </div>
      )}

      {/* PLAN TAB */}
      {tab === "plan" && (
        <div style={{ padding: "16px 20px 0" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
            <div style={{ width: 10, height: 10, borderRadius: "50%", background: viewPlan.color }} />
            <div>
              <span style={{ fontSize: 17, fontWeight: 700 }}>{viewPlan.day} — {viewPlan.focus}</span>
              <span style={{ fontSize: 12, color: viewPlan.color, marginLeft: 8 }}>{viewPlan.tag}</span>
            </div>
          </div>

          {viewPlan.restDay ? (
            <div style={{ textAlign: "center", padding: "48px 20px", color: "#666" }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>😴</div>
              <p style={{ fontSize: 16, fontWeight: 600, color: "#888" }}>Rest & Recovery</p>
              <p style={{ fontSize: 13, color: "#555" }}>Your 10k steps today are plenty. Muscles grow when you rest.</p>
            </div>
          ) : viewPlan.runDay ? (
            <div>
              <div style={{ background: `linear-gradient(135deg, ${viewPlan.color}22 0%, #181818 100%)`, border: `1px solid ${viewPlan.color}33`, borderRadius: 16, padding: 20, marginBottom: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                  <div>
                    <p style={{ margin: 0, fontSize: 13, color: "#888" }}>Total duration</p>
                    <p style={{ margin: "2px 0 0", fontSize: 28, fontWeight: 800, color: viewPlan.color }}>{viewPlan.runPlan.duration}</p>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <p style={{ margin: 0, fontSize: 12, color: "#888" }}>Est. burn</p>
                    <p style={{ margin: "2px 0 0", fontSize: 18, fontWeight: 700, color: "#7EC89A" }}>~{viewPlan.runPlan.calBurn} kcal</p>
                  </div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {viewPlan.runPlan.structure.map((s, i) => (
                    <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                      <div style={{ width: 32, height: 32, borderRadius: "50%", background: viewPlan.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 800, color: "#000", flexShrink: 0 }}>
                        {i + 1}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                          <span style={{ fontSize: 14, fontWeight: 600 }}>{s.phase}</span>
                          <span style={{ fontSize: 13, color: viewPlan.color, fontWeight: 700 }}>{s.time}</span>
                        </div>
                        <p style={{ margin: "2px 0 0", fontSize: 12, color: "#888" }}>{s.note}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ background: "#181818", borderRadius: 14, padding: "14px 16px", border: "1px solid #252525" }}>
                <p style={{ margin: "0 0 4px", fontSize: 11, color: "#888", textTransform: "uppercase", letterSpacing: "0.06em" }}>Coach tip</p>
                <p style={{ margin: 0, fontSize: 13, color: "#ccc", lineHeight: 1.5 }}>💡 {viewPlan.runPlan.tip}</p>
              </div>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {viewPlan.exercises.map((ex, idx) => {
                const completedCount = Array.from({ length: ex.sets }, (_, i) => completedSets[`${ex.name}-${i}`]).filter(Boolean).length;
                const allDone = completedCount === ex.sets;
                return (
                  <div key={ex.name} style={{ background: allDone ? "#1a2a1a" : "#181818", border: `1px solid ${allDone ? "#7EC89A44" : "#252525"}`, borderRadius: 14, overflow: "hidden", transition: "all 0.2s" }}>
                    <button onClick={() => setExpandedExercise(expandedExercise === ex.name ? null : ex.name)}
                      style={{ width: "100%", background: "none", border: "none", padding: "14px 16px", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <span style={{ width: 28, height: 28, borderRadius: "50%", background: allDone ? "#7EC89A22" : "#252525", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, color: allDone ? "#7EC89A" : "#888", fontWeight: 700, flexShrink: 0 }}>
                          {allDone ? "✓" : idx + 1}
                        </span>
                        <div style={{ textAlign: "left" }}>
                          <div style={{ fontSize: 14, fontWeight: 600, color: allDone ? "#7EC89A" : "#f0f0f0" }}>{ex.name}</div>
                          <div style={{ fontSize: 11, color: "#888" }}>{ex.sets} × {ex.reps} · rest {ex.rest}</div>
                        </div>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ fontSize: 11, color: "#666" }}>{completedCount}/{ex.sets}</span>
                        <span style={{ color: "#666", fontSize: 12 }}>{expandedExercise === ex.name ? "▲" : "▼"}</span>
                      </div>
                    </button>
                    {expandedExercise === ex.name && (
                      <div style={{ padding: "0 16px 16px", borderTop: "1px solid #252525" }}>
                        <p style={{ margin: "12px 0 12px", fontSize: 12, color: "#888", fontStyle: "italic" }}>💡 {ex.tip}</p>
                        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                          {Array.from({ length: ex.sets }, (_, i) => (
                            <button key={i} onClick={() => toggleSet(ex.name, i)}
                              style={{ padding: "8px 16px", borderRadius: 8, border: "none", cursor: "pointer", fontSize: 13, fontWeight: 600,
                                background: completedSets[`${ex.name}-${i}`] ? "#7EC89A" : "#252525",
                                color: completedSets[`${ex.name}-${i}`] ? "#000" : "#888",
                                transition: "all 0.2s" }}>
                              Set {i + 1}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
              <div style={{ margin: "8px 0", padding: "12px 16px", background: "#181818", borderRadius: 12, fontSize: 12, color: "#666", textAlign: "center" }}>
                All exercises are bodyweight — no equipment needed 🏠
              </div>
            </div>
          )}
        </div>
      )}

      {/* LOG TAB */}
      {tab === "log" && (
        <div style={{ padding: "16px 20px 0" }}>
          {/* Quick add */}
          <div style={{ marginBottom: 16 }}>
            <button onClick={() => setShowSearch(!showSearch)}
              style={{ width: "100%", padding: "14px", background: "#E8845A", color: "#000", border: "none", borderRadius: 14, fontSize: 14, fontWeight: 700, cursor: "pointer" }}>
              + Add Food
            </button>
          </div>

          {showSearch && (
            <div style={{ background: "#181818", borderRadius: 16, padding: 16, marginBottom: 16 }}>
              <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search food..."
                style={{ width: "100%", background: "#252525", border: "none", borderRadius: 10, padding: "10px 14px", color: "#f0f0f0", fontSize: 14, marginBottom: 10, boxSizing: "border-box" }} />
              <div style={{ maxHeight: 200, overflowY: "auto", display: "flex", flexDirection: "column", gap: 4 }}>
                {filteredFoods.map(f => (
                  <button key={f.name} onClick={() => addFood(f)}
                    style={{ background: "#252525", border: "none", borderRadius: 8, padding: "10px 12px", cursor: "pointer", display: "flex", justifyContent: "space-between", color: "#f0f0f0", textAlign: "left" }}>
                    <span style={{ fontSize: 13 }}>{f.name}</span>
                    <div style={{ textAlign: "right" }}>
                      <span style={{ fontSize: 13, fontWeight: 600, color: "#E8845A" }}>{f.cal} kcal</span>
                      <span style={{ fontSize: 11, color: "#888", marginLeft: 8 }}>{f.protein}g P</span>
                    </div>
                  </button>
                ))}
              </div>

              {/* Custom entry */}
              <div style={{ marginTop: 12, borderTop: "1px solid #2a2a2a", paddingTop: 12 }}>
                <p style={{ margin: "0 0 8px", fontSize: 12, color: "#888" }}>Or add custom</p>
                <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 6, marginBottom: 6 }}>
                  <input value={customFood.name} onChange={e => setCustomFood(p => ({ ...p, name: e.target.value }))}
                    placeholder="Food name" style={{ background: "#252525", border: "none", borderRadius: 8, padding: "8px 10px", color: "#f0f0f0", fontSize: 13 }} />
                  <input value={customFood.cal} onChange={e => setCustomFood(p => ({ ...p, cal: e.target.value }))}
                    placeholder="kcal" type="number" style={{ background: "#252525", border: "none", borderRadius: 8, padding: "8px 10px", color: "#f0f0f0", fontSize: 13 }} />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 6, marginBottom: 8 }}>
                  {["protein", "carbs", "fat"].map(m => (
                    <input key={m} value={customFood[m]} onChange={e => setCustomFood(p => ({ ...p, [m]: e.target.value }))}
                      placeholder={m + " g"} type="number"
                      style={{ background: "#252525", border: "none", borderRadius: 8, padding: "8px 10px", color: "#f0f0f0", fontSize: 12 }} />
                  ))}
                </div>
                <button onClick={addCustom}
                  style={{ width: "100%", padding: "10px", background: "#252525", color: "#E8845A", border: "1px solid #E8845A44", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
                  Add Custom
                </button>
              </div>
            </div>
          )}

          {/* Food log */}
          <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 16 }}>
            {log.length === 0 ? (
              <div style={{ textAlign: "center", padding: "32px", color: "#555" }}>
                <div style={{ fontSize: 36, marginBottom: 8 }}>🥗</div>
                <p style={{ margin: 0, fontSize: 14 }}>Nothing logged yet today</p>
              </div>
            ) : log.map(item => (
              <div key={item.id} style={{ background: "#181818", borderRadius: 12, padding: "12px 14px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <p style={{ margin: 0, fontSize: 14, fontWeight: 500 }}>{item.name}</p>
                  <p style={{ margin: "2px 0 0", fontSize: 11, color: "#666" }}>
                    P: {item.protein}g · C: {item.carbs}g · F: {item.fat}g
                  </p>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <span style={{ fontSize: 14, fontWeight: 700, color: "#E8845A" }}>{item.cal}</span>
                  <button onClick={() => removeFood(item.id)}
                    style={{ background: "none", border: "none", color: "#555", cursor: "pointer", fontSize: 16, padding: 0 }}>✕</button>
                </div>
              </div>
            ))}
          </div>

          {/* Nutrition tip */}
          <div style={{ background: "#181818", borderRadius: 14, padding: "14px 16px", border: "1px solid #252525" }}>
            <p style={{ margin: "0 0 6px", fontSize: 12, color: "#888", textTransform: "uppercase", letterSpacing: "0.06em" }}>Toning Tip</p>
            <p style={{ margin: 0, fontSize: 13, color: "#ccc", lineHeight: 1.5 }}>
              Hit {PROFILE.proteinGoal}g protein daily — it's the key to muscle definition. Your 10k steps are already a great calorie burn foundation.
            </p>
          </div>
        </div>
      )}

      {/* Bottom nav */}
      <div style={{ position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: 430, background: "#111", borderTop: "1px solid #1e1e1e", display: "flex", zIndex: 100 }}>
        {[["today", "🏠", "Home"], ["plan", "💪", "Workout"], ["log", "🥗", "Food"]].map(([val, icon, label]) => (
          <button key={val} onClick={() => setTab(val)}
            style={{ flex: 1, padding: "12px 0", background: "none", border: "none", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
            <span style={{ fontSize: 20 }}>{icon}</span>
            <span style={{ fontSize: 10, color: tab === val ? "#E8845A" : "#555", fontWeight: tab === val ? 700 : 400 }}>{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
