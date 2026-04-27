import type { Player, MatchRecord } from './types';

/**
 * Sort players by ranking: MMR descending, then wins descending, then name alphabetically.
 * Requirements: 8.1, 8.3, 8.4
 */
export function sortPlayersByRanking(players: Player[]): Player[] {
  return [...players].sort((a, b) => {
    if (b.mmr !== a.mmr) return b.mmr - a.mmr;
    if (b.wins !== a.wins) return b.wins - a.wins;
    return a.name.localeCompare(b.name);
  });
}

/**
 * Get match history for a specific player, sorted in reverse chronological order.
 * Requirements: 7.3
 */
export function getMatchHistoryForPlayer(
  playerId: string,
  matches: MatchRecord[],
): MatchRecord[] {
  return matches
    .filter((m) => m.teamA.includes(playerId) || m.teamB.includes(playerId))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}
