import { db } from './firebase';
import { ref, set, onValue, get } from 'firebase/database';
import type { AppData, Player, MatchRecord, Bill } from './types';

const DB_PATH = 'rtt-badminton-data';

function emptyAppData(): AppData {
  return { players: [], matches: [], bills: [] };
}

// ── In-memory cache (synced with Firebase in real-time) ─────
let cachedData: AppData = emptyAppData();
let initialized = false;
let initResolve: (() => void) | null = null;
const initPromise = new Promise<void>((resolve) => { initResolve = resolve; });

// ── Start real-time listener ────────────────────────────────
if (typeof window !== 'undefined') {
  const dbRef = ref(db, DB_PATH);
  onValue(dbRef, (snapshot) => {
    const val = snapshot.val();
    if (val && typeof val === 'object') {
      cachedData = {
        players: Array.isArray(val.players) ? val.players : [],
        matches: Array.isArray(val.matches) ? val.matches : [],
        bills: Array.isArray(val.bills) ? val.bills : [],
      };
    } else {
      cachedData = emptyAppData();
    }
    if (!initialized) {
      initialized = true;
      initResolve?.();
    }
    // Dispatch event so pages can re-render
    window.dispatchEvent(new CustomEvent('rtt-data-updated'));
  });
}

/**
 * Wait for the initial Firebase data load.
 * Call this once at page startup before reading data.
 */
export async function waitForData(): Promise<void> {
  if (initialized) return;
  // Timeout 5 second
  await Promise.race([
    initPromise,
    new Promise<void>((resolve) => setTimeout(() => {
      if (!initialized) {
        console.warn('RTT Badminton: Firebase connection timed out. Starting with empty data.');
        initialized = true;
      }
      resolve();
    }, 5000)),
  ]);
}

/**
 * Load data synchronously from the in-memory cache.
 * The cache is kept in sync with Firebase via the real-time listener.
 */
export function loadData(): AppData {
  return cachedData;
}

/** Persist a full AppData object to Firebase. */
export function saveData(data: AppData): void {
  cachedData = data;
  const dbRef = ref(db, DB_PATH);
  set(dbRef, data).catch((err) => {
    console.error('RTT Badminton: Failed to save data to Firebase:', err);
  });
}

/** Save only the players array. */
export function savePlayers(players: Player[]): void {
  const data = loadData();
  data.players = players;
  saveData(data);
}

/** Save only the matches array. */
export function saveMatches(matches: MatchRecord[]): void {
  const data = loadData();
  data.matches = matches;
  saveData(data);
}

/** Save only the bills array. */
export function saveBills(bills: Bill[]): void {
  const data = loadData();
  data.bills = bills;
  saveData(data);
}

// Keep these for backward compatibility
export function isDataCorrupted(raw: string | null): boolean {
  if (raw === null) return false;
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
