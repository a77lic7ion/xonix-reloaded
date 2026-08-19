// Liquid Blueprint reminder: score history is presented as a concise technical log, not a social feed.
export interface HighScore {
  name: string;
  score: number;
}

const STORAGE_KEY = "xonix-liquid-blueprint-high-scores";
const DEFAULT_SCORES: HighScore[] = [
  { name: "CANARD", score: 54713 },
  { name: "PINKY", score: 52289 },
  { name: "VECTOR", score: 38940 },
  { name: "ORBIT", score: 27500 },
  { name: "TIDE", score: 19240 },
];

export class ScoreStore {
  private scores: HighScore[];

  constructor() {
    this.scores = this.read();
  }

  list() {
    return [...this.scores];
  }

  qualifies(score: number) {
    return this.scores.length < 10 || score > (this.scores.at(-1)?.score ?? 0);
  }

  submit(name: string, score: number) {
    const callsign = name.trim().toUpperCase().slice(0, 8) || "XONIX";
    this.scores = [...this.scores, { name: callsign, score }]
      .sort((a, b) => b.score - a.score)
      .slice(0, 10);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.scores));
    } catch {
      // Browser privacy settings may prevent persistence; the in-session table still works.
    }
  }

  private read() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (!saved) return DEFAULT_SCORES;
      const parsed = JSON.parse(saved) as unknown;
      if (!Array.isArray(parsed)) return DEFAULT_SCORES;
      const valid = parsed
        .filter(
          (score): score is HighScore =>
            typeof score === "object" &&
            score !== null &&
            typeof (score as HighScore).name === "string" &&
            typeof (score as HighScore).score === "number",
        )
        .slice(0, 10);
      return valid.length ? valid : DEFAULT_SCORES;
    } catch {
      return DEFAULT_SCORES;
    }
  }
}

