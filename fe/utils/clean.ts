export function cleanJSON(str: string) {
  if (!str) return null;

  let cleaned = str.replace(/```json/gi, "").replace(/```/g, "");

  cleaned = cleaned.trim();

  try {
    return JSON.parse(cleaned);
  } catch {
    return null;
  }
}
