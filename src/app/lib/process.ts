/**
 * Does a lot's process (e.g. "red honey", "washed") match a filter key
 * (e.g. "honey", "wash", or an exact process name from the dropdown)?
 */
export function processMatches(process: string, key: string): boolean {
  const p = process.trim().toLowerCase();
  const k = key.trim().toLowerCase();
  if (!k) return true;
  return p === k || p.split(/\s+/).some((word) => word.startsWith(k));
}
