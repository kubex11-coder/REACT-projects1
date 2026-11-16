// Bez jediné odpovědi šedá; 80–100 % zelená, 50–79 % oranžová, pod 50 % červená.
export function scoreTier(percent, answered) {
  if (answered === 0) return "none";
  if (percent >= 80) return "good";
  if (percent >= 50) return "mid";
  return "bad";
}
