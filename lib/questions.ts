export type Criterion = {
  id: string;
  /** What the examiner is looking for, shown in the marking result. */
  name: string;
  max: number;
  /** Keywords used by the offline fallback marker to detect this step in the working. */
  keywords?: string[];
};

export type ExpectedAnswer =
  | {
      type: "numeric";
      value: number;
      tolerance: number;
      unit: string;
      /** Alternative spellings of the unit accepted by the fallback marker. */
      unitAliases?: string[];
    }
  | {
      type: "keywords";
      keywords: string[];
    };

export type Question = {
  id: string;
  topic: string;
  difficulty: 1 | 2 | 3;
  text: string;
  given?: string[];
  marks: number;
  markingScheme: Criterion[];
  /** Full worked solution, used for "Reveal the answer" and as AI context. */
  modelAnswer: string;
  expected: ExpectedAnswer;
  /** Hint served by the copilot when Ollama is not available. */
  fallbackHint: string;
};

export const CHAPTER = "Force and Motion";

export const QUESTIONS: Question[] = [
  // Difficulty 1
  {
    id: "fm-01",
    topic: "Force and acceleration",
    difficulty: 1,
    text: "A trolley of mass 2 kg accelerates uniformly at 3 m/s2 along a smooth track. Calculate the resultant force acting on the trolley.",
    given: ["Mass, m = 2 kg", "Acceleration, a = 3 m/s2"],
    marks: 3,
    markingScheme: [
      { id: "formula", name: "Correct formula, F = ma", max: 1, keywords: ["f = ma", "f=ma", "ma"] },
      { id: "substitution", name: "Correct substitution, F = 2 x 3", max: 1, keywords: ["2 x 3", "2*3", "2(3)", "2 × 3"] },
      { id: "answer", name: "Final answer with unit, 6 N", max: 1 },
    ],
    modelAnswer:
      "Use Newton's second law, F = ma. Substituting the values, F = 2 kg x 3 m/s2 = 6 N. The resultant force on the trolley is 6 N.",
    expected: { type: "numeric", value: 6, tolerance: 0.01, unit: "N", unitAliases: ["n", "newton", "newtons"] },
    fallbackHint: "Newton's second law links force, mass and acceleration in one short formula. Multiply the two given values.",
  },
  {
    id: "fm-02",
    topic: "Weight and gravity",
    difficulty: 1,
    text: "A student has a mass of 60 kg. Calculate the student's weight on Earth. Take the gravitational acceleration g = 9.81 m/s2.",
    given: ["Mass, m = 60 kg", "Gravitational acceleration, g = 9.81 m/s2"],
    marks: 3,
    markingScheme: [
      { id: "formula", name: "Correct formula, W = mg", max: 1, keywords: ["w = mg", "w=mg", "mg"] },
      { id: "substitution", name: "Correct substitution, W = 60 x 9.81", max: 1, keywords: ["60 x 9.81", "60*9.81", "60(9.81)", "60 × 9.81"] },
      { id: "answer", name: "Final answer with unit, 588.6 N", max: 1 },
    ],
    modelAnswer:
      "Weight is the gravitational force on a mass, W = mg. Substituting, W = 60 kg x 9.81 m/s2 = 588.6 N. The student's weight is 588.6 N (about 589 N).",
    expected: { type: "numeric", value: 588.6, tolerance: 1, unit: "N", unitAliases: ["n", "newton", "newtons"] },
    fallbackHint: "Weight is a force, not a mass. Which formula turns a mass into a gravitational force?",
  },
  {
    id: "fm-03",
    topic: "Linear motion",
    difficulty: 1,
    text: "A car travels 240 m along a straight road in 12 s at constant speed. Calculate the speed of the car.",
    given: ["Distance, s = 240 m", "Time, t = 12 s"],
    marks: 2,
    markingScheme: [
      { id: "formula", name: "Correct method, v = s / t with substitution 240 / 12", max: 1, keywords: ["s / t", "s/t", "240 / 12", "240/12", "distance / time", "distance/time"] },
      { id: "answer", name: "Final answer with unit, 20 m/s", max: 1 },
    ],
    modelAnswer: "Speed is distance over time, v = s / t = 240 m / 12 s = 20 m/s.",
    expected: { type: "numeric", value: 20, tolerance: 0.01, unit: "m/s", unitAliases: ["m/s", "ms-1", "m s-1", "meter per second", "metre per second"] },
    fallbackHint: "Constant speed means distance divided by time. Watch the unit of your final answer.",
  },
  {
    id: "fm-04",
    topic: "Acceleration",
    difficulty: 1,
    text: "A motorcycle speeds up from 10 m/s to 25 m/s in 5 s. Calculate its acceleration.",
    given: ["Initial velocity, u = 10 m/s", "Final velocity, v = 25 m/s", "Time, t = 5 s"],
    marks: 3,
    markingScheme: [
      { id: "formula", name: "Correct formula, a = (v - u) / t", max: 1, keywords: ["(v - u)", "(v-u)", "v - u", "v-u", "change in velocity"] },
      { id: "substitution", name: "Correct substitution, a = (25 - 10) / 5", max: 1, keywords: ["25 - 10", "25-10", "15 / 5", "15/5"] },
      { id: "answer", name: "Final answer with unit, 3 m/s2", max: 1 },
    ],
    modelAnswer:
      "Acceleration is the rate of change of velocity, a = (v - u) / t = (25 - 10) / 5 = 15 / 5 = 3 m/s2.",
    expected: { type: "numeric", value: 3, tolerance: 0.01, unit: "m/s2", unitAliases: ["m/s2", "m/s^2", "ms-2", "m s-2", "m/s/s"] },
    fallbackHint: "Acceleration compares the change in velocity with the time taken for that change.",
  },
  {
    id: "fm-05",
    topic: "Inertia",
    difficulty: 1,
    text: "A bus brakes suddenly and the standing passengers lurch forward. Explain why this happens.",
    marks: 2,
    markingScheme: [
      { id: "concept", name: "States that the passengers have inertia", max: 1, keywords: ["inertia"] },
      { id: "explain", name: "Explains that their bodies tend to continue moving forward at the original velocity", max: 1, keywords: ["continue", "keeps moving", "keep moving", "remain in motion", "resist", "original velocity", "same speed", "forward"] },
    ],
    modelAnswer:
      "The passengers have inertia, the tendency of a mass to resist a change in its state of motion. When the bus brakes, their bodies tend to continue moving forward at the original velocity, so they lurch forward relative to the bus.",
    expected: { type: "keywords", keywords: ["inertia", "continue", "forward"] },
    fallbackHint: "Think about the property of mass that resists any change in motion. What happens to the passengers' bodies when only the bus slows down?",
  },

  // Difficulty 2
  {
    id: "fm-06",
    topic: "Momentum",
    difficulty: 2,
    text: "A football of mass 0.45 kg is kicked and moves at 24 m/s. Calculate the momentum of the ball.",
    given: ["Mass, m = 0.45 kg", "Velocity, v = 24 m/s"],
    marks: 3,
    markingScheme: [
      { id: "formula", name: "Correct formula, p = mv", max: 1, keywords: ["p = mv", "p=mv", "mv"] },
      { id: "substitution", name: "Correct substitution, p = 0.45 x 24", max: 1, keywords: ["0.45 x 24", "0.45*24", "0.45(24)", "0.45 × 24"] },
      { id: "answer", name: "Final answer with unit, 10.8 kg m/s", max: 1 },
    ],
    modelAnswer: "Momentum is mass times velocity, p = mv = 0.45 kg x 24 m/s = 10.8 kg m/s.",
    expected: { type: "numeric", value: 10.8, tolerance: 0.05, unit: "kg m/s", unitAliases: ["kg m/s", "kgm/s", "kg m s-1", "kgms-1", "ns", "n s"] },
    fallbackHint: "Momentum is the product of two quantities you are given directly. Remember its unit combines both of theirs.",
  },
  {
    id: "fm-07",
    topic: "Impulse and impulsive force",
    difficulty: 2,
    text: "A cricket ball of mass 0.15 kg is struck from rest to a speed of 30 m/s. The bat is in contact with the ball for 0.05 s. Calculate the average force exerted on the ball.",
    given: ["Mass, m = 0.15 kg", "Initial velocity, u = 0 m/s", "Final velocity, v = 30 m/s", "Contact time, t = 0.05 s"],
    marks: 4,
    markingScheme: [
      { id: "formula", name: "Correct formula, F = m(v - u) / t or Ft = mv - mu", max: 1, keywords: ["m(v - u)", "m(v-u)", "mv - mu", "mv-mu", "ft =", "impulse", "change in momentum"] },
      { id: "substitution", name: "Correct substitution, F = 0.15 x 30 / 0.05", max: 1, keywords: ["0.15 x 30", "0.15*30", "4.5", "0.05"] },
      { id: "answer", name: "Final answer with unit, 90 N", max: 2 },
    ],
    modelAnswer:
      "Impulsive force is the rate of change of momentum, F = m(v - u) / t. Substituting, F = 0.15 x (30 - 0) / 0.05 = 4.5 / 0.05 = 90 N.",
    expected: { type: "numeric", value: 90, tolerance: 0.5, unit: "N", unitAliases: ["n", "newton", "newtons"] },
    fallbackHint: "Start from the change in momentum of the ball, then think about how fast that change happens.",
  },
  {
    id: "fm-08",
    topic: "Equations of motion",
    difficulty: 2,
    text: "A van starts from rest and accelerates uniformly at 2 m/s2 for 6 s. Calculate the distance travelled by the van in that time.",
    given: ["Initial velocity, u = 0 m/s", "Acceleration, a = 2 m/s2", "Time, t = 6 s"],
    marks: 4,
    markingScheme: [
      { id: "formula", name: "Correct formula, s = ut + (1/2)at2", max: 1, keywords: ["ut +", "1/2 a", "1/2at", "0.5 a", "0.5a", "half a", "at2", "at^2"] },
      { id: "substitution", name: "Correct substitution, s = 0 + (1/2)(2)(6)2", max: 1, keywords: ["(6)2", "6^2", "36", "1/2 x 2", "0.5 x 2"] },
      { id: "answer", name: "Final answer with unit, 36 m", max: 2 },
    ],
    modelAnswer:
      "Use s = ut + (1/2)at2. Since the van starts from rest, u = 0, so s = (1/2)(2)(6)2 = (1/2)(2)(36) = 36 m.",
    expected: { type: "numeric", value: 36, tolerance: 0.1, unit: "m", unitAliases: ["m", "meter", "metre", "meters", "metres"] },
    fallbackHint: "Starting from rest removes one term from the equation of motion for distance. Which equation involves u, a and t?",
  },
  {
    id: "fm-09",
    topic: "Conservation of momentum",
    difficulty: 2,
    text: "Trolley A of mass 3 kg moves at 4 m/s and collides with a stationary trolley B of mass 1 kg. After the collision they stick together and move off as one. Calculate their common velocity after the collision.",
    given: ["Mass of A, m1 = 3 kg", "Velocity of A, u1 = 4 m/s", "Mass of B, m2 = 1 kg", "Velocity of B, u2 = 0 m/s"],
    marks: 4,
    markingScheme: [
      { id: "formula", name: "Applies conservation of momentum, m1u1 + m2u2 = (m1 + m2)v", max: 1, keywords: ["m1u1", "conservation", "(m1 + m2)", "(m1+m2)", "total momentum"] },
      { id: "substitution", name: "Correct substitution, 3 x 4 = (3 + 1)v", max: 1, keywords: ["3 x 4", "3*4", "12", "(3 + 1)", "(3+1)", "4v"] },
      { id: "answer", name: "Final answer with unit, 3 m/s", max: 2 },
    ],
    modelAnswer:
      "Total momentum is conserved: m1u1 + m2u2 = (m1 + m2)v. So 3 x 4 + 1 x 0 = (3 + 1)v, which gives 12 = 4v and v = 3 m/s.",
    expected: { type: "numeric", value: 3, tolerance: 0.01, unit: "m/s", unitAliases: ["m/s", "ms-1", "m s-1"] },
    fallbackHint: "In a collision with no external force, one quantity is the same before and after. The trolleys move as a single combined mass afterwards.",
  },
  {
    id: "fm-10",
    topic: "Hooke's law",
    difficulty: 2,
    text: "A force of 8 N stretches a spring by 4 cm within its elastic limit. Calculate the spring constant in N/m.",
    given: ["Force, F = 8 N", "Extension, x = 4 cm = 0.04 m"],
    marks: 3,
    markingScheme: [
      { id: "formula", name: "Correct formula, F = kx, and converts 4 cm to 0.04 m", max: 1, keywords: ["f = kx", "f=kx", "kx", "0.04"] },
      { id: "substitution", name: "Correct substitution, k = 8 / 0.04", max: 1, keywords: ["8 / 0.04", "8/0.04"] },
      { id: "answer", name: "Final answer with unit, 200 N/m", max: 1 },
    ],
    modelAnswer:
      "Hooke's law states F = kx. Convert the extension to metres: x = 0.04 m. Then k = F / x = 8 / 0.04 = 200 N/m.",
    expected: { type: "numeric", value: 200, tolerance: 1, unit: "N/m", unitAliases: ["n/m", "nm-1", "n m-1", "newton per meter", "newton per metre"] },
    fallbackHint: "Hooke's law is a one-line formula, but check the unit of the extension before you substitute.",
  },

  // Difficulty 3
  {
    id: "fm-11",
    topic: "Free fall",
    difficulty: 3,
    text: "A coconut falls from rest from a branch 45 m above the ground. Ignoring air resistance and taking g = 10 m/s2, calculate the time taken for the coconut to reach the ground.",
    given: ["Height, s = 45 m", "Initial velocity, u = 0 m/s", "g = 10 m/s2"],
    marks: 4,
    markingScheme: [
      { id: "formula", name: "Correct formula, s = ut + (1/2)gt2 with u = 0", max: 1, keywords: ["1/2 g", "1/2g", "0.5 g", "0.5g", "gt2", "gt^2", "s = ut"] },
      { id: "rearrange", name: "Rearranges and substitutes, t2 = 2s / g = 2 x 45 / 10 = 9", max: 1, keywords: ["2s / g", "2s/g", "2 x 45", "2*45", "90 / 10", "90/10", "t2 = 9", "t^2 = 9", "9"] },
      { id: "answer", name: "Final answer with unit, t = 3 s", max: 2 },
    ],
    modelAnswer:
      "For free fall from rest, s = (1/2)gt2. Rearranging, t2 = 2s / g = 2 x 45 / 10 = 9, so t = 3 s.",
    expected: { type: "numeric", value: 3, tolerance: 0.05, unit: "s", unitAliases: ["s", "sec", "second", "seconds"] },
    fallbackHint: "Free fall from rest is uniform acceleration with u = 0. Pick the equation of motion that links distance, g and time, then rearrange for time.",
  },
  {
    id: "fm-12",
    topic: "Velocity-time graphs",
    difficulty: 3,
    text: "A car travelling at 30 m/s brakes and decelerates uniformly to rest in 6 s. By considering the area under its velocity-time graph or otherwise, calculate the braking distance.",
    given: ["Initial velocity, u = 30 m/s", "Final velocity, v = 0 m/s", "Time, t = 6 s"],
    marks: 4,
    markingScheme: [
      { id: "method", name: "Correct method, area under graph or s = (u + v)t / 2", max: 1, keywords: ["area", "(u + v)", "(u+v)", "triangle", "1/2 x 30", "average velocity"] },
      { id: "substitution", name: "Correct substitution, s = (1/2) x 30 x 6", max: 1, keywords: ["30 x 6", "30*6", "180", "1/2 x 6", "15 x 6"] },
      { id: "answer", name: "Final answer with unit, 90 m", max: 2 },
    ],
    modelAnswer:
      "The braking distance is the area under the velocity-time graph, a triangle: s = (1/2) x base x height = (1/2) x 6 x 30 = 90 m. Equivalently, s = (u + v)t / 2 = (30 + 0)(6) / 2 = 90 m.",
    expected: { type: "numeric", value: 90, tolerance: 0.5, unit: "m", unitAliases: ["m", "meter", "metre", "meters", "metres"] },
    fallbackHint: "On a velocity-time graph, distance is not a point on the line. What shape does the graph make while the car slows to rest?",
  },
  {
    id: "fm-13",
    topic: "Forces in a lift",
    difficulty: 3,
    text: "A person of mass 50 kg stands on a scale inside a lift. The lift accelerates upward at 2 m/s2. Taking g = 10 m/s2, calculate the reading on the scale, which equals the normal reaction force.",
    given: ["Mass, m = 50 kg", "Upward acceleration, a = 2 m/s2", "g = 10 m/s2"],
    marks: 4,
    markingScheme: [
      { id: "equation", name: "Correct equation of motion, R - mg = ma or R = m(g + a)", max: 1, keywords: ["r - mg", "r-mg", "m(g + a)", "m(g+a)", "mg + ma", "mg+ma"] },
      { id: "substitution", name: "Correct substitution, R = 50 x (10 + 2)", max: 1, keywords: ["50 x 12", "50*12", "(10 + 2)", "(10+2)", "500 + 100", "500+100"] },
      { id: "answer", name: "Final answer with unit, 600 N", max: 2 },
    ],
    modelAnswer:
      "Taking upward as positive, the resultant force is R - mg = ma. So R = m(g + a) = 50 x (10 + 2) = 600 N. The scale reads 600 N, more than the person's weight because the lift accelerates upward.",
    expected: { type: "numeric", value: 600, tolerance: 1, unit: "N", unitAliases: ["n", "newton", "newtons"] },
    fallbackHint: "Two vertical forces act on the person and they are not balanced. Write Newton's second law for the resultant of those two forces.",
  },
  {
    id: "fm-14",
    topic: "Impulse in safety features",
    difficulty: 3,
    text: "Modern cars are built with crumple zones at the front. Using the concept of impulse, explain how a crumple zone reduces injury to passengers in a head-on collision.",
    marks: 4,
    markingScheme: [
      { id: "impulse", name: "States the relation F = change in momentum / time, or Ft = mv - mu", max: 1, keywords: ["ft", "impulse", "rate of change of momentum", "change in momentum"] },
      { id: "time", name: "Crumple zone lengthens the collision time", max: 1, keywords: ["time", "longer", "increase", "extend"] },
      { id: "momentum", name: "The change in momentum is the same in the collision", max: 1, keywords: ["momentum", "same change", "fixed"] },
      { id: "force", name: "Therefore the impulsive force on passengers is reduced", max: 1, keywords: ["force", "reduce", "smaller", "less"] },
    ],
    modelAnswer:
      "The impulsive force is the rate of change of momentum, F = (mv - mu) / t. In a crash the car's change in momentum is fixed. A crumple zone deforms and lengthens the time of collision. With the same change in momentum spread over a longer time, the impulsive force on the passengers is smaller, so injuries are reduced.",
    expected: { type: "keywords", keywords: ["impulse", "time", "momentum", "force"] },
    fallbackHint: "The change in momentum in the crash cannot be avoided, but one variable in the impulse relation can be stretched. Which one does the crumple zone change?",
  },
];

export function getQuestion(id: string): Question | undefined {
  return QUESTIONS.find((q) => q.id === id);
}
