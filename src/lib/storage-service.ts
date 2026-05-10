import { db } from './firebase';
import { ref, set, onValue, get, remove } from 'firebase/database';
import type { AppData, Player, MatchRecord, Bill } from './types';

const DB_PATH = 'rtt-badminton-data';
const PHOTOS_PATH = 'rtt-badminton-photos';

function emptyAppData(): AppData {
  return { players: [], matches: [], bills: [], seasons: [] };
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
        seasons: Array.isArray(val.seasons) ? val.seasons : [],
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
  }, (error) => {
    console.error('RTT Badminton: Firebase read failed:', error.code, error.message);
    if (!initialized) {
      initialized = true;
      initResolve?.();
    }
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
export function saveData(data: AppData): Promise<void> {
  cachedData = data;
  const dbRef = ref(db, DB_PATH);
  return set(dbRef, data).catch((err) => {
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

// ── Per-player photo storage (separate path to avoid bulk downloads) ──

/** Fetch a single player's photo. Returns null if none saved. */
export async function loadPlayerPhoto(playerId: string): Promise<string | null> {
  const photoRef = ref(db, `${PHOTOS_PATH}/${playerId}`);
  const snapshot = await get(photoRef);
  return snapshot.val() as string | null;
}

/** Save a compressed base64 photo for one player. */
export async function savePlayerPhoto(playerId: string, dataUrl: string): Promise<void> {
  const photoRef = ref(db, `${PHOTOS_PATH}/${playerId}`);
  await set(photoRef, dataUrl);
}

/** Remove a player's photo (call when deleting the player). */
export async function deletePlayerPhoto(playerId: string): Promise<void> {
  const photoRef = ref(db, `${PHOTOS_PATH}/${playerId}`);
  await remove(photoRef);
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
