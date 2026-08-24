export interface ActivityPoint {
  label: string;
  timestamp: string;
  successful: number;
  failed: number;
  suspicious: number;
}

// Small deterministic LCG so the demo chart shape is stable across reloads.
function makeRng(seed: number) {
  let state = seed;
  return () => {
    state = (state * 1103515245 + 12345) & 0x7fffffff;
    return state / 0x7fffffff;
  };
}

function buildSeries(
  points: number,
  stepMs: number,
  endTime: number,
  labelFor: (d: Date) => string,
  baseSuccessful: number,
  baseFailed: number,
  baseSuspicious: number,
  seed: number,
): ActivityPoint[] {
  const rng = makeRng(seed);
  const out: ActivityPoint[] = [];
  for (let i = points - 1; i >= 0; i--) {
    const t = endTime - i * stepMs;
    const d = new Date(t);
    const wobble = (base: number, spread: number) =>
      Math.max(0, Math.round(base + (rng() - 0.5) * spread));
    out.push({
      label: labelFor(d),
      timestamp: d.toISOString(),
      successful: wobble(baseSuccessful, baseSuccessful * 0.4),
      failed: wobble(baseFailed, baseFailed * 0.6),
      suspicious: wobble(baseSuspicious, baseSuspicious * 0.8),
    });
  }
  return out;
}

const NOW = new Date("2026-08-24T12:00:00Z").getTime();

export const activity24h: ActivityPoint[] = buildSeries(
  24,
  60 * 60 * 1000,
  NOW,
  (d) => d.toLocaleTimeString("en-US", { hour: "numeric", hour12: true }),
  480,
  16,
  4,
  17,
);

export const activity7d: ActivityPoint[] = buildSeries(
  7,
  24 * 60 * 60 * 1000,
  NOW,
  (d) => d.toLocaleDateString("en-US", { weekday: "short" }),
  9800,
  310,
  62,
  29,
);

export const activity30d: ActivityPoint[] = buildSeries(
  30,
  24 * 60 * 60 * 1000,
  NOW,
  (d) => d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
  9600,
  300,
  58,
  41,
);
