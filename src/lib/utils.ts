// ── Shared Utilities ────────────────────────────────────────

/**
 * Generate a UUID string.
 * Uses crypto.randomUUID() when available, falls back to a simple v4-like generator.
 */
export function generateId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  // Simple fallback for environments without crypto.randomUUID
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * Format an ISO date string to a human-readable format.
 * Example: "2024-01-15T14:00:00Z" → "15 Jan 2024"
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

/**
 * Default placeholder image for players without a profile picture.
 * A minimal SVG silhouette encoded as a data URL.
 */
export const DEFAULT_PLACEHOLDER_IMAGE =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 120' fill='%2394a3b8'%3E%3Crect width='120' height='120' fill='%23e2e8f0'/%3E%3Ccircle cx='60' cy='45' r='22'/%3E%3Cellipse cx='60' cy='110' rx='35' ry='30'/%3E%3C/svg%3E";
