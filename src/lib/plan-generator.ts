import type { Profile, Plan, DayPlan, Exercise, MealPlan, Goal } from "./pd-store";

// Mifflin–St Jeor
function bmr(p: Profile) {
  const base = 10 * p.weight + 6.25 * p.height - 5 * p.age;
  return p.sex === "M" ? base + 5 : base - 161;
}
const activityFactor: Record<Profile["activity"], number> = {
  sedentario: 1.2, leve: 1.375, moderado: 1.55, intenso: 1.725,
};

function calorieTarget(p: Profile) {
  const tdee = bmr(p) * activityFactor[p.activity];
  switch (p.goal) {
    case "emagrecer": return Math.round(tdee - 450);
    case "massa": return Math.round(tdee + 350);
    case "definicao": return Math.round(tdee - 200);
    case "condicionamento": return Math.round(tdee);
    case "saude": return Math.round(tdee);
  }
}

function proteinTarget(p: Profile) {
  const perKg = p.goal === "massa" ? 2.0 : p.goal === "definicao" ? 2.2 : p.goal === "emagrecer" ? 1.8 : 1.5;
  return Math.round(p.weight * perKg);
}

function waterTarget(p: Profile) {
  return Math.round(p.weight * 35); // ml
}

const goalLabel: Record<Goal, string> = {
  emagrecer: "Emagrecimento",
  massa: "Ganho de massa muscular",
  definicao: "Definição muscular",
  condicionamento: "Condicionamento físico",
  saude: "Saúde & bem-estar",
};

// Exercise libraries
const gymPush: Exercise[] = [
  { name: "Supino reto com halteres", sets: 4, reps: "8-10", rest: "75s" },
  { name: "Supino inclinado", sets: 3, reps: "10-12", rest: "60s" },
  { name: "Desenvolvimento militar", sets: 3, reps: "8-10", rest: "75s" },
  { name: "Elevação lateral", sets: 3, reps: "12-15", rest: "45s" },
  { name: "Tríceps corda", sets: 3, reps: "12", rest: "45s" },
];
const gymPull: Exercise[] = [
  { name: "Puxada frontal", sets: 4, reps: "8-10", rest: "75s" },
  { name: "Remada curvada", sets: 4, reps: "8-10", rest: "75s" },
  { name: "Remada baixa", sets: 3, reps: "10-12", rest: "60s" },
  { name: "Rosca direta", sets: 3, reps: "10-12", rest: "45s" },
  { name: "Rosca martelo", sets: 3, reps: "12", rest: "45s" },
];
const gymLegs: Exercise[] = [
  { name: "Agachamento livre", sets: 4, reps: "8-10", rest: "90s" },
  { name: "Leg press 45°", sets: 4, reps: "10-12", rest: "75s" },
  { name: "Cadeira extensora", sets: 3, reps: "12-15", rest: "60s" },
  { name: "Mesa flexora", sets: 3, reps: "12", rest: "60s" },
  { name: "Panturrilha em pé", sets: 4, reps: "15-20", rest: "45s" },
];
const homeFull: Exercise[] = [
  { name: "Agachamento livre", sets: 4, reps: "15", rest: "45s" },
  { name: "Afundo alternado", sets: 3, reps: "12 cada", rest: "45s" },
  { name: "Flexão de braço", sets: 4, reps: "10-15", rest: "60s" },
  { name: "Remada invertida (toalha/mesa)", sets: 3, reps: "10-12", rest: "60s" },
  { name: "Prancha abdominal", sets: 3, reps: "40s", rest: "30s" },
  { name: "Mountain climbers", sets: 3, reps: "30s", rest: "30s" },
];
const mobility: Exercise[] = [
  { name: "Caminhada leve", sets: 1, reps: "25 min", rest: "—" },
  { name: "Alongamento dinâmico", sets: 2, reps: "8 min", rest: "—" },
  { name: "Mobilidade de quadril", sets: 3, reps: "10 cada lado", rest: "30s" },
  { name: "Respiração diafragmática", sets: 3, reps: "2 min", rest: "30s" },
];
const cardioCircuit: Exercise[] = [
  { name: "Burpees", sets: 4, reps: "30s on / 30s off", rest: "30s" },
  { name: "Polichinelos", sets: 4, reps: "45s", rest: "20s" },
  { name: "Skipping alto", sets: 4, reps: "30s", rest: "30s" },
  { name: "Agachamento com salto", sets: 4, reps: "30s", rest: "30s" },
];

function pickSplit(p: Profile): DayPlan[] {
  const days = Math.max(1, Math.min(7, p.daysPerWeek));
  const dayNames = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado", "Domingo"];
  const usesGym = p.hasGym;
  const cardioByGoal =
    p.goal === "emagrecer" ? "25-35 min cardio moderado (esteira/bike) – Zona 2"
    : p.goal === "definicao" ? "20 min HIIT (30s on / 30s off)"
    : p.goal === "condicionamento" ? "20 min intervalado misto"
    : p.goal === "saude" ? "30 min caminhada leve"
    : "15 min cardio leve (recuperação ativa)";

  // Build template by goal & days
  const blocks: Omit<DayPlan, "day">[] = [];

  if (p.goal === "massa") {
    const split = usesGym
      ? [
          { focus: "Peito & Tríceps", exercises: gymPush, cardio: undefined as string | undefined },
          { focus: "Costas & Bíceps", exercises: gymPull, cardio: undefined },
          { focus: "Pernas & Glúteos", exercises: gymLegs, cardio: undefined },
          { focus: "Ombros & Core", exercises: [...gymPush.slice(2,5), ...mobility.slice(2,4)], cardio: undefined },
          { focus: "Full body força", exercises: [...gymLegs.slice(0,2), ...gymPush.slice(0,2), ...gymPull.slice(0,2)], cardio: undefined },
        ]
      : [
          { focus: "Full body A", exercises: homeFull, cardio: undefined },
          { focus: "Full body B", exercises: [...homeFull.slice(2), ...homeFull.slice(0,2)], cardio: undefined },
          { focus: "Pernas em casa", exercises: [{name:"Agachamento búlgaro",sets:4,reps:"12 cada",rest:"60s"},{name:"Afundo reverso",sets:3,reps:"12 cada",rest:"45s"},{name:"Elevação pélvica",sets:4,reps:"15",rest:"45s"},{name:"Panturrilha unilateral",sets:3,reps:"15",rest:"30s"}], cardio: undefined },
        ];
    for (let i=0;i<days;i++) blocks.push(split[i % split.length]);
  } else if (p.goal === "emagrecer") {
    const base = usesGym
      ? [
          { focus: "Treino metabólico A", exercises: [...gymLegs.slice(0,3), ...gymPush.slice(0,2)], cardio: cardioByGoal },
          { focus: "Treino metabólico B", exercises: [...gymPull.slice(0,3), ...gymLegs.slice(2,4)], cardio: cardioByGoal },
          { focus: "Cardio + Core", exercises: [...cardioCircuit, { name: "Prancha", sets:3, reps:"45s", rest:"30s"}], cardio: cardioByGoal },
        ]
      : [
          { focus: "HIIT em casa", exercises: cardioCircuit, cardio: cardioByGoal },
          { focus: "Full body queima", exercises: homeFull, cardio: cardioByGoal },
          { focus: "Cardio + mobilidade", exercises: mobility, cardio: cardioByGoal },
        ];
    for (let i=0;i<days;i++) blocks.push(base[i % base.length]);
  } else if (p.goal === "definicao") {
    const base = usesGym
      ? [
          { focus: "Peito/Tríceps + HIIT", exercises: gymPush, cardio: cardioByGoal },
          { focus: "Costas/Bíceps + HIIT", exercises: gymPull, cardio: cardioByGoal },
          { focus: "Pernas pesado", exercises: gymLegs, cardio: "10 min esteira inclinada" },
          { focus: "Ombros & Core + HIIT", exercises: [...gymPush.slice(2), ...mobility.slice(2)], cardio: cardioByGoal },
        ]
      : [
          { focus: "Full body + HIIT", exercises: [...homeFull, ...cardioCircuit.slice(0,2)], cardio: cardioByGoal },
          { focus: "Cardio + core", exercises: cardioCircuit, cardio: cardioByGoal },
        ];
    for (let i=0;i<days;i++) blocks.push(base[i % base.length]);
  } else if (p.goal === "condicionamento") {
    const base = [
      { focus: "Força funcional", exercises: usesGym ? [...gymLegs.slice(0,2), ...gymPush.slice(0,2), ...gymPull.slice(0,2)] : homeFull, cardio: "10 min remo/bike" },
      { focus: "Cardio intervalado", exercises: cardioCircuit, cardio: cardioByGoal },
      { focus: "Mobilidade & core", exercises: mobility, cardio: "15 min caminhada" },
    ];
    for (let i=0;i<days;i++) blocks.push(base[i % base.length]);
  } else { // saúde
    const base = [
      { focus: "Caminhada + mobilidade", exercises: mobility, cardio: "30 min caminhada leve" },
      { focus: "Força leve full body", exercises: homeFull.slice(0,4), cardio: "15 min caminhada" },
      { focus: "Alongamento & respiração", exercises: mobility.slice(1), cardio: "20 min caminhada" },
    ];
    for (let i=0;i<days;i++) blocks.push(base[i % base.length]);
  }

  // Map to weekday with rest days for remaining
  const result: DayPlan[] = [];
  let trainIdx = 0;
  // Distribute training across week (skip rest evenly)
  const trainDays = new Set<number>();
  const step = 7 / days;
  for (let i = 0; i < days; i++) trainDays.add(Math.round(i * step) % 7);
  for (let i = 0; i < 7; i++) {
    if (trainDays.has(i) && trainIdx < blocks.length) {
      result.push({ day: dayNames[i], ...blocks[trainIdx] });
      trainIdx++;
    } else {
      result.push({ day: dayNames[i], focus: "Descanso ativo", rest: true, exercises: [], cardio: p.goal === "emagrecer" ? "20 min caminhada leve opcional" : undefined });
    }
  }
  return result;
}

function buildMeals(p: Profile, kcal: number): MealPlan {
  const veg = /veg|vegetar|vegan/i.test(p.diet);
  const lac = /lactose/i.test(p.diet);
  const glu = /gl[uú]ten/i.test(p.diet);

  const protein = veg ? "tofu grelhado" : "frango grelhado";
  const breakfastBase = lac
    ? `Omelete de 3 ovos com aveia ${glu ? "sem glúten" : ""} e banana`
    : `Iogurte natural com aveia${glu ? " sem glúten" : ""}, frutas vermelhas e pasta de amendoim`;

  if (p.goal === "emagrecer") return {
    breakfast: `${breakfastBase} • ~${Math.round(kcal*0.25)} kcal`,
    lunch: `Salada verde generosa + ${protein} + ${glu ? "arroz" : "quinoa"} + legumes assados • ~${Math.round(kcal*0.35)} kcal`,
    snack: `Fruta + 20g de castanhas • ~${Math.round(kcal*0.10)} kcal`,
    dinner: `Sopa de legumes com ${veg ? "grão-de-bico" : "frango desfiado"} + salada • ~${Math.round(kcal*0.30)} kcal`,
  };
  if (p.goal === "massa") return {
    breakfast: `Tapioca com ${veg ? "tofu mexido" : "ovos e queijo"} + vitamina de banana com aveia • ~${Math.round(kcal*0.25)} kcal`,
    lunch: `Arroz, feijão, ${protein} (180g) + batata-doce + salada • ~${Math.round(kcal*0.35)} kcal`,
    snack: `Sanduíche integral com ${veg ? "homus e legumes" : "frango e abacate"} + iogurte • ~${Math.round(kcal*0.15)} kcal`,
    dinner: `${protein} (200g) + arroz + brócolis + azeite • ~${Math.round(kcal*0.25)} kcal`,
  };
  if (p.goal === "definicao") return {
    breakfast: `Ovos mexidos + ${glu ? "pão sem glúten" : "pão integral"} + abacate • ~${Math.round(kcal*0.25)} kcal`,
    lunch: `${protein} grelhado + quinoa + salada com azeite • ~${Math.round(kcal*0.35)} kcal`,
    snack: `Whey/proteína vegetal + fruta • ~${Math.round(kcal*0.15)} kcal`,
    dinner: `Salmão ou tofu + legumes no vapor + folhas • ~${Math.round(kcal*0.25)} kcal`,
  };
  // saúde / condicionamento
  return {
    breakfast: `${breakfastBase} • ~${Math.round(kcal*0.25)} kcal`,
    lunch: `Prato colorido: 1/2 vegetais, 1/4 ${glu ? "arroz" : "quinoa"}, 1/4 ${protein} • ~${Math.round(kcal*0.35)} kcal`,
    snack: `Fruta da estação + iogurte ou oleaginosas • ~${Math.round(kcal*0.15)} kcal`,
    dinner: `Sopa nutritiva + salada + proteína magra • ~${Math.round(kcal*0.25)} kcal`,
  };
}

export function generatePlan(profile: Profile): Plan {
  const kcal = calorieTarget(profile);
  return {
    goalLabel: goalLabel[profile.goal],
    calories: kcal,
    protein: proteinTarget(profile),
    water: waterTarget(profile),
    cardio:
      profile.goal === "emagrecer" ? "25-35 min, 4-5x/semana (Zona 2)"
      : profile.goal === "definicao" ? "20 min HIIT, 3x/semana"
      : profile.goal === "condicionamento" ? "20-30 min intervalado, 3x/semana"
      : profile.goal === "saude" ? "30 min caminhada diária"
      : "10-15 min recuperação ativa",
    week: pickSplit(profile),
    meals: buildMeals(profile, kcal),
    completedDates: [],
    progress: [{ date: new Date().toISOString().slice(0,10), weight: profile.weight }],
    tier: "basic",
  };
}
