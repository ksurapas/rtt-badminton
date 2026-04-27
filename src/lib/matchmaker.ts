import type { MatchAssignment, MatchmakingResult } from './types';
import { calculateExpectedScore } from './mmr-engine';

// ── Public API ──────────────────────────────────────────────

/**
 * Calculates the win probability for team A given both teams' MMR values.
 * Uses the ELO expected score formula.
 */
export function calculateWinProbability(teamAMMR: number, teamBMMR: number): number {
  return calculateExpectedScore(teamAMMR, teamBMMR);
}

/**
 * Generates balanced matchups from a list of available player IDs.
 *
 * - 2 players → 1 singles match
 * - 3 players → best singles pair (smallest MMR diff) + 1 sit-out
 * - 4 players → 1 doubles match minimizing team MMR difference
 * - 5+ players → multiple matches minimizing overall MMR difference; odd counts have sit-outs
 *
 * Throws if fewer than 2 players are provided.
 */
export function generateMatchups(
  playerIds: string[],
  playerMMRs: Record<string, number>,
): MatchmakingResult {
  if (playerIds.length < 2) {
    throw new Error('At least 2 players are required for matchmaking.');
  }

  if (playerIds.length === 2) {
    return handleTwoPlayers(playerIds, playerMMRs);
  }

  if (playerIds.length === 3) {
    return handleThreePlayers(playerIds, playerMMRs);
  }

  if (playerIds.length === 4) {
    return handleFourPlayers(playerIds, playerMMRs);
  }

  return handleFiveOrMore(playerIds, playerMMRs);
}

// ── Private helpers ─────────────────────────────────────────

function getMMR(id: string, playerMMRs: Record<string, number>): number {
  return playerMMRs[id] ?? 1000;
}

function buildAssignment(
  type: 'singles' | 'doubles',
  teamA: string[],
  teamB: string[],
  playerMMRs: Record<string, number>,
): MatchAssignment {
  const teamAMMR = teamA.reduce((sum, id) => sum + getMMR(id, playerMMRs), 0) / teamA.length;
  const teamBMMR = teamB.reduce((sum, id) => sum + getMMR(id, playerMMRs), 0) / teamB.length;
  const mmrDifference = Math.abs(teamAMMR - teamBMMR);
  const teamAWinProbability = calculateWinProbability(teamAMMR, teamBMMR);
  const teamBWinProbability = 1 - teamAWinProbability;

  return { type, teamA, teamB, mmrDifference, teamAWinProbability, teamBWinProbability };
}

/** 2 players → 1 singles match */
function handleTwoPlayers(
  playerIds: string[],
  playerMMRs: Record<string, number>,
): MatchmakingResult {
  const match = buildAssignment('singles', [playerIds[0]], [playerIds[1]], playerMMRs);
  return { matches: [match], sittingOut: [] };
}

/** 3 players → pick the pair with smallest MMR difference for singles, third sits out */
function handleThreePlayers(
  playerIds: string[],
  playerMMRs: Record<string, number>,
): MatchmakingResult {
  const pairs: [number, number][] = [
    [0, 1],
    [0, 2],
    [1, 2],
  ];

  let bestPair = pairs[0];
  let bestDiff = Infinity;

  for (const [i, j] of pairs) {
    const diff = Math.abs(getMMR(playerIds[i], playerMMRs) - getMMR(playerIds[j], playerMMRs));
    if (diff < bestDiff) {
      bestDiff = diff;
      bestPair = [i, j];
    }
  }

  const sitOutIndex = [0, 1, 2].find((i) => i !== bestPair[0] && i !== bestPair[1])!;
  const match = buildAssignment(
    'singles',
    [playerIds[bestPair[0]]],
    [playerIds[bestPair[1]]],
    playerMMRs,
  );

  return { matches: [match], sittingOut: [playerIds[sitOutIndex]] };
}

/**
 * 4 players → try all 3 possible doubles pairings, pick the one
 * with the smallest team MMR difference.
 *
 * The 3 ways to split 4 players {A,B,C,D} into two teams of 2:
 *   (AB vs CD), (AC vs BD), (AD vs BC)
 */
function handleFourPlayers(
  playerIds: string[],
  playerMMRs: Record<string, number>,
): MatchmakingResult {
  const [a, b, c, d] = playerIds;
  const pairings: [string[], string[]][] = [
    [[a, b], [c, d]],
    [[a, c], [b, d]],
    [[a, d], [b, c]],
  ];

  let bestAssignment: MatchAssignment | null = null;

  for (const [teamA, teamB] of pairings) {
    const assignment = buildAssignment('doubles', teamA, teamB, playerMMRs);
    if (!bestAssignment || assignment.mmrDifference < bestAssignment.mmrDifference) {
      bestAssignment = assignment;
    }
  }

  return { matches: [bestAssignment!], sittingOut: [] };
}

/**
 * 5+ players → generate multiple matches minimizing overall MMR difference.
 * Odd player counts result in one player sitting out.
 *
 * Strategy: sort players by MMR, then greedily assign matches.
 * - Take groups of 4 for doubles matches (pair adjacent-MMR players across teams).
 * - If only 2 remain, create a singles match.
 * - If the count is odd, the player closest to the median MMR sits out
 *   (minimizing disruption to balance).
 */
function handleFiveOrMore(
  playerIds: string[],
  playerMMRs: Record<string, number>,
): MatchmakingResult {
  // Sort players by MMR descending
  const sorted = [...playerIds].sort((a, b) => getMMR(b, playerMMRs) - getMMR(a, playerMMRs));

  const sittingOut: string[] = [];
  let activePlayers = sorted;

  // If odd number, sit out the middle player (median MMR)
  if (activePlayers.length % 2 !== 0) {
    const midIndex = Math.floor(activePlayers.length / 2);
    sittingOut.push(activePlayers[midIndex]);
    activePlayers = activePlayers.filter((_, i) => i !== midIndex);
  }

  const matches: MatchAssignment[] = [];

  // Process players in groups — prefer doubles (groups of 4), fall back to singles (groups of 2)
  while (activePlayers.length >= 4) {
    // Take top 4 sorted players: indices 0,1,2,3
    // Best balance: pair 0+3 vs 1+2 (highest+lowest vs middle two)
    const group = activePlayers.splice(0, 4);
    const match = findBestDoublesPairing(group, playerMMRs);
    matches.push(match);
  }

  // Remaining 2 players → singles
  if (activePlayers.length === 2) {
    matches.push(buildAssignment('singles', [activePlayers[0]], [activePlayers[1]], playerMMRs));
  }

  return { matches, sittingOut };
}

/**
 * Given exactly 4 players, find the doubles pairing that minimizes
 * team MMR difference (same logic as handleFourPlayers).
 */
function findBestDoublesPairing(
  players: string[],
  playerMMRs: Record<string, number>,
): MatchAssignment {
  const [a, b, c, d] = players;
  const pairings: [string[], string[]][] = [
    [[a, b], [c, d]],
    [[a, c], [b, d]],
    [[a, d], [b, c]],
  ];

  let best: MatchAssignment | null = null;

  for (const [teamA, teamB] of pairings) {
    const assignment = buildAssignment('doubles', teamA, teamB, playerMMRs);
    if (!best || assignment.mmrDifference < best.mmrDifference) {
      best = assignment;
    }
  }

  return best!;
}
