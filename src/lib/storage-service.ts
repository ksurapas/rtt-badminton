import type { AppData, Player, MatchRecord, Bill } from './types';

const STORAGE_KEY = 'rtt-badminton-data';

function emptyAppData(): AppData {
  return { players: [], matches: [], bills: [] };
}

/**
 * Check whether a raw localStorage string is corrupted (not valid JSON
 * or missing the expected top-level arrays).
 */
export function isDataCorrupted(raw: string | null): boolean {
  if (raw === null) return false; // null means no data yet, not corrupted
  try {
    const parsed = JSON.parse(raw);
    return (
      typeof parsed !== 'object' ||
      parsed === null ||
      !Array.isArray(parsed.players) ||
      !Array.isArray(parsed.matches) ||
      !Array.isArray(parsed.bills)
    );
  } catch {
    return true;
  }
}

/**
 * Load persisted data from localStorage.
 * Returns empty AppData when nothing is stored or data is corrupted.
 */
export function loadData(): AppData {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (raw === null) return emptyAppData();

  if (isDataCorrupted(raw)) {
    console.warn(
      'RTT Badminton: localStorage data is corrupted or unparseable. Starting with empty data.',
    );
    return emptyAppData();
  }

  return JSON.parse(raw) as AppData;
}

/** Persist a full AppData object to localStorage. */
export function saveData(data: AppData): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

/** Save only the players array (merges with existing data). */
export function savePlayers(players: Player[]): void {
  const data = loadData();
  data.players = players;
  saveData(data);
}

/** Save only the matches array (merges with existing data). */
export function saveMatches(matches: MatchRecord[]): void {
  const data = loadData();
  data.matches = matches;
  saveData(data);
}

/** Save only the bills array (merges with existing data). */
export function saveBills(bills: Bill[]): void {
  const data = loadData();
  data.bills = bills;
  saveData(data);
}
