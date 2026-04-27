import type { MatchInput, MMRChange } from './types';

// ── Constants ───────────────────────────────────────────────
const K_FACTOR = 32;
const INITIAL_MMR = 1000;

// ── Public API ──────────────────────────────────────────────

/**
 * Returns the initial MMR assigned to new players.
 */
export function getInitialMMR(): number {
  return INITIAL_MMR;
}

/**
 * Calculates the expected score (win probability) for a player
 * against an opponent using the ELO formula.
 *
 * Expected_Score = 1 / (1 + 10^((opponentMMR - playerMMR) / 400))
 */
export function calculateExpectedScore(playerMMR: number, opponentMMR: number): number {
  return 1 / (1 + Math.pow(10, (opponentMMR - playerMMR) / 400));
}

/**
 * Calculates the raw MMR change for a single player.
 *
 * MMR_Change = K * (actualScore - expectedScore)
 * actualScore is 1 for a win, 0 for a loss.
 */
export function calculateMMRChange(
  playerMMR: number,
  opponentMMR: number,
  won: boolean,
  kFactor: number = K_FACTOR,
): number {
  const expected = calculateExpectedScore(playerMMR, opponentMMR);
  const actual = won ? 1 : 0;
  return kFactor * (actual - expected);
}

/**
 * Processes a match and returns MMR changes for every player involved.
 *
 * For singles: each player's MMR is used directly.
 * For doubles: team rating = average of both players' MMRs;
 *              both players on a team receive the same delta.
 *
 * Accepts a `playerMMRs` map (playerId → current MMR) so the caller
 * can supply the lookup however they like.
 *
 * Zero-sum property: the sum of all deltas is always 0.
 */
export function processMatch(
  match: MatchInput,
  playerMMRs: Record<string, number>,
): MMRChange[] {
  const teamAMMRs = match.teamA.map((id) => playerMMRs[id] ?? INITIAL_MMR);
  const teamBMMRs = match.teamB.map((id) => playerMMRs[id] ?? INITIAL_MMR);

  const teamARating = teamAMMRs.reduce((sum, v) => sum + v, 0) / teamAMMRs.length;
  const teamBRating = teamBMMRs.reduce((sum, v) => sum + v, 0) / teamBMMRs.length;

  const teamAWon = match.winner === 'teamA';

  // Delta computed from team ratings — same for every member of a team
  const teamADelta = Math.round(calculateMMRChange(teamARating, teamBRating, teamAWon));
  const teamBDelta = Math.round(calculateMMRChange(teamBRating, teamARating, !teamAWon));

  const changes: MMRChange[] = [];

  for (const id of match.teamA) {
    const prev = playerMMRs[id] ?? INITIAL_MMR;
    changes.push({
      playerId: id,
      previousMMR: prev,
      newMMR: prev + teamADelta,
      delta: teamADelta,
    });
  }

  for (const id of match.teamB) {
    const prev = playerMMRs[id] ?? INITIAL_MMR;
    changes.push({
      playerId: id,
      previousMMR: prev,
      newMMR: prev + teamBDelta,
      delta: teamBDelta,
    });
  }

  return changes;
}
