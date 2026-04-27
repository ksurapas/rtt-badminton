// ── Game Mode ────────────────────────────────────────────────
export type GameMode = 'singles' | 'doubles';

// ── Player ──────────────────────────────────────────────────
export interface Player {
  id: string;
  name: string;
  profilePicture: string | null; // base64 data URL or null for default
  mmr: number;
  wins: number;
  losses: number;
  createdAt: string;
}

// ── Match Recording ─────────────────────────────────────────
export interface MatchInput {
  mode: GameMode;
  teamA: string[]; // player IDs
  teamB: string[]; // player IDs
  winner: 'teamA' | 'teamB';
}

export interface MMRChange {
  playerId: string;
  previousMMR: number;
  newMMR: number;
  delta: number;
}

export interface MatchRecord {
  id: string;
  date: string;
  mode: GameMode;
  teamA: string[];
  teamB: string[];
  winner: 'teamA' | 'teamB';
  mmrChanges: MMRChange[];
}

// ── Bill Splitting ──────────────────────────────────────────
export type BillType = 'court' | 'shuttlecock' | 'dinner';

export interface CourtBill {
  id: string;
  type: 'court';
  payer: string;
  totalCost: number;
  participants: string[];
  createdAt: string;
}

export interface ShuttlecockBill {
  id: string;
  type: 'shuttlecock';
  payer: string;
  totalCost: number;
  participants: string[];
  createdAt: string;
}

export interface DinnerParticipant {
  name: string;
  itemCost: number;
}

export interface DinnerBill {
  id: string;
  type: 'dinner';
  payer: string;
  participants: DinnerParticipant[];
  applyVAT: boolean;
  applyServiceCharge: boolean;
  createdAt: string;
}

export type Bill = CourtBill | ShuttlecockBill | DinnerBill;

export interface BillSplitResult {
  shares: { name: string; owes: number }[];
  totalPerPerson?: number; // For equal-split bills
  subtotal?: number;
  serviceChargeAmount?: number;
  vatAmount?: number;
  grandTotal?: number;
}

// ── Validation ──────────────────────────────────────────────
export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

// ── Matchmaking ─────────────────────────────────────────────
export interface MatchAssignment {
  type: 'singles' | 'doubles';
  teamA: string[];
  teamB: string[];
  mmrDifference: number;
  teamAWinProbability: number;
  teamBWinProbability: number;
}

export interface MatchmakingResult {
  matches: MatchAssignment[];
  sittingOut: string[];
}

// ── App Data (localStorage) ─────────────────────────────────
export interface AppData {
  players: Player[];
  matches: MatchRecord[];
  bills: Bill[];
}
