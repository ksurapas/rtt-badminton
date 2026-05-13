import type { Player, MatchRecord } from './types';
import { sortPlayersByRanking } from './ranking';

export type AchievementTier = 'bronze' | 'silver' | 'gold' | 'platinum';

export const TIER_COLORS: Record<AchievementTier, string> = {
  bronze: '#CD7F32',
  silver: '#C0C0C0',
  gold:   '#FFD700',
  platinum: '#7EC8E3',
};

export interface Achievement {
  id: string;
  name: string;
  description: string;
  tier: AchievementTier;
  icon: string; // inline SVG string
}

export interface AchievementStatus {
  achievement: Achievement;
  earned: boolean;
  progress?: { current: number; max: number };
}

// ── SVG Icons ────────────────────────────────────────────────
const ICONS: Record<string, string> = {
  'on-fire': `<svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
    <path d="M20 5 C17 11 12 13 14 21 C15 26 17.5 28.5 20 35 C22.5 28.5 25 26 26 21 C28 13 23 11 20 5Z" fill="#CD7F32"/>
    <path d="M20 18 C19.5 21 18 23 18.5 27 C19 29.5 19.5 32 20 35 C20.5 32 21 29.5 21.5 27 C22 23 20.5 21 20 18Z" fill="#FFCC88"/>
  </svg>`,

  'hot-streak': `<svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
    <path d="M10 17 C9 20 7 21 8 24 C8.5 26 10 28 11 30 C12 28 13.5 26 14 24 C15 21 13 20 10 17Z" fill="#C0C0C0"/>
    <path d="M20 8 C17 13 13 16 15 23 C16.5 27 18 29 20 34 C22 29 23.5 27 25 23 C27 16 23 13 20 8Z" fill="#C0C0C0"/>
    <path d="M30 17 C29 20 27 21 28 24 C28.5 26 30 28 31 30 C32 28 33.5 26 34 24 C35 21 33 20 30 17Z" fill="#C0C0C0"/>
    <path d="M20 20 C19.5 23 18.5 25 19 28 C19.5 30 19.8 32 20 34 C20.2 32 20.5 30 21 28 C21.5 25 20.5 23 20 20Z" fill="#E8E8E8"/>
  </svg>`,

  'unstoppable': `<svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
    <path d="M24 4 L14 22 L21 22 L17 36 L28 18 L21 18 Z" fill="#7EC8E3"/>
  </svg>`,

  'flawless-month': `<svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
    <rect x="6" y="10" width="28" height="24" rx="3" fill="none" stroke="#FFD700" stroke-width="2.5"/>
    <rect x="6" y="10" width="28" height="9" rx="3" fill="#FFD700"/>
    <line x1="14" y1="7" x2="14" y2="14" stroke="#FFD700" stroke-width="2.5" stroke-linecap="round"/>
    <line x1="26" y1="7" x2="26" y2="14" stroke="#FFD700" stroke-width="2.5" stroke-linecap="round"/>
    <path d="M12 25 L17 30 L28 20" stroke="#FFD700" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  </svg>`,

  'rising-star': `<svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
    <path d="M20 5 L23 14 L33 14 L25.5 19.5 L28 28 L20 23 L12 28 L14.5 19.5 L7 14 L17 14 Z" fill="#CD7F32"/>
    <line x1="20" y1="31" x2="20" y2="38" stroke="#CD7F32" stroke-width="2.5" stroke-linecap="round"/>
    <path d="M16 35 L20 31 L24 35" stroke="#CD7F32" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  </svg>`,

  'club-pro': `<svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
    <path d="M13 8 L27 8 L25 22 C25 26 22.5 29 20 29 C17.5 29 15 26 15 22 Z" fill="#C0C0C0"/>
    <path d="M13 10 C9 10 7 14 7 17 C7 20 9.5 22 13 21" stroke="#C0C0C0" stroke-width="2.5" fill="none" stroke-linecap="round"/>
    <path d="M27 10 C31 10 33 14 33 17 C33 20 30.5 22 27 21" stroke="#C0C0C0" stroke-width="2.5" fill="none" stroke-linecap="round"/>
    <rect x="17" y="29" width="6" height="4" fill="#C0C0C0"/>
    <rect x="13" y="33" width="14" height="3" rx="1.5" fill="#C0C0C0"/>
  </svg>`,

  'elite': `<svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
    <path d="M20 6 L30 18 L20 36 L10 18 Z" fill="#FFD700"/>
    <path d="M10 18 L20 12 L30 18" fill="#FFF9C4"/>
  </svg>`,

  'legend': `<svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
    <path d="M6 29 L6 17 L13 23 L20 9 L27 23 L34 17 L34 29 Z" fill="#7EC8E3"/>
    <rect x="6" y="29" width="28" height="5" rx="2.5" fill="#7EC8E3"/>
    <circle cx="6"  cy="17" r="2.5" fill="#B9F2FF"/>
    <circle cx="20" cy="9"  r="2.5" fill="#B9F2FF"/>
    <circle cx="34" cy="17" r="2.5" fill="#B9F2FF"/>
  </svg>`,

  'rank-1': `<svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
    <circle cx="20" cy="20" r="14" fill="none" stroke="#FFD700" stroke-width="2.5"/>
    <path d="M17 17 L20 13 L20 28" stroke="#FFD700" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
    <line x1="15" y1="28" x2="25" y2="28" stroke="#FFD700" stroke-width="3" stroke-linecap="round"/>
  </svg>`,

  'comeback-king': `<svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
    <path d="M6 20 C6 32 14 34 20 34 C26 34 32 26 34 8" stroke="#FFD700" stroke-width="3" fill="none" stroke-linecap="round"/>
    <path d="M30 12 L34 8 L38 12" stroke="#FFD700" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
    <circle cx="6" cy="20" r="3" fill="#FFD700"/>
  </svg>`,

  'first-blood': `<svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="20" cy="32" rx="5"   ry="5"   fill="#CD7F32"/>
    <ellipse cx="20" cy="29" rx="3.5" ry="3"   fill="#B8732A"/>
    <line x1="20" y1="27" x2="14" y2="9"  stroke="#CD7F32" stroke-width="1.5" stroke-linecap="round"/>
    <line x1="20" y1="27" x2="17" y2="8"  stroke="#CD7F32" stroke-width="1.5" stroke-linecap="round"/>
    <line x1="20" y1="27" x2="20" y2="7"  stroke="#CD7F32" stroke-width="1.5" stroke-linecap="round"/>
    <line x1="20" y1="27" x2="23" y2="8"  stroke="#CD7F32" stroke-width="1.5" stroke-linecap="round"/>
    <line x1="20" y1="27" x2="26" y2="9"  stroke="#CD7F32" stroke-width="1.5" stroke-linecap="round"/>
    <path d="M14 9 C16 8 18 7 20 7 C22 7 24 8 26 9" stroke="#CD7F32" stroke-width="1.5" fill="none" stroke-linecap="round"/>
  </svg>`,

  'veteran': `<svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
    <path d="M20 5 L34 10 L34 22 C34 30 27 36 20 38 C13 36 6 30 6 22 L6 10 Z" fill="#C0C0C0"/>
    <rect x="6" y="19" width="28" height="5" fill="#E8E8E8"/>
  </svg>`,

  'centurion': `<svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
    <path d="M20 34 C18 30 10 27 8 21 C11 19 14 22 15 25 C13 20 13 14 16 11 C18 10 20 13 19 16 C19 12 21 8 20 6" stroke="#FFD700" stroke-width="2" fill="none" stroke-linecap="round"/>
    <path d="M20 34 C22 30 30 27 32 21 C29 19 26 22 25 25 C27 20 27 14 24 11 C22 10 20 13 21 16 C21 12 19 8 20 6" stroke="#FFD700" stroke-width="2" fill="none" stroke-linecap="round"/>
    <circle cx="20" cy="35" r="2.5" fill="#FFD700"/>
  </svg>`,

  'solo-player': `<svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="20" cy="17" rx="11" ry="12" fill="none" stroke="#7EC8E3" stroke-width="2.5"/>
    <line x1="20" y1="29" x2="20" y2="38" stroke="#7EC8E3" stroke-width="3"   stroke-linecap="round"/>
    <line x1="16" y1="34" x2="24" y2="34" stroke="#7EC8E3" stroke-width="2"   stroke-linecap="round"/>
    <line x1="11" y1="13" x2="29" y2="13" stroke="#7EC8E3" stroke-width="1"   opacity="0.4"/>
    <line x1="10" y1="17" x2="30" y2="17" stroke="#7EC8E3" stroke-width="1"   opacity="0.4"/>
    <line x1="11" y1="21" x2="29" y2="21" stroke="#7EC8E3" stroke-width="1"   opacity="0.4"/>
    <line x1="16" y1="6"  x2="16" y2="28" stroke="#7EC8E3" stroke-width="1"   opacity="0.4"/>
    <line x1="20" y1="5"  x2="20" y2="29" stroke="#7EC8E3" stroke-width="1"   opacity="0.4"/>
    <line x1="24" y1="6"  x2="24" y2="28" stroke="#7EC8E3" stroke-width="1"   opacity="0.4"/>
    <path d="M22 8 L18 16 L21 16 L19 25 L24 15 L21 15 Z" fill="#7EC8E3"/>
  </svg>`,
};

// ── Achievement Definitions ──────────────────────────────────
export const ACHIEVEMENTS: Achievement[] = [
  // Win Streaks
  { id: 'on-fire',        name: 'On Fire',        description: 'Win 3 matches in a row',             tier: 'bronze',   icon: ICONS['on-fire'] },
  { id: 'hot-streak',     name: 'Hot Streak',      description: 'Win 5 matches in a row',             tier: 'silver',   icon: ICONS['hot-streak'] },
  { id: 'unstoppable',    name: 'Unstoppable',     description: 'Win 10 matches in a row',            tier: 'platinum', icon: ICONS['unstoppable'] },
  { id: 'flawless-month', name: 'Flawless Month',  description: 'Never lose in a calendar month',     tier: 'gold',     icon: ICONS['flawless-month'] },
  // MMR Milestones
  { id: 'rising-star',    name: 'Rising Star',     description: 'Reach MMR 1100',                         tier: 'bronze',   icon: ICONS['rising-star'] },
  { id: 'club-pro',       name: 'Club Pro',        description: 'Reach MMR 1200',                         tier: 'silver',   icon: ICONS['club-pro'] },
  { id: 'elite',          name: 'Elite',           description: 'Reach MMR 1300',                         tier: 'gold',     icon: ICONS['elite'] },
  { id: 'legend',         name: 'Legend',          description: 'Reach MMR 1400',                         tier: 'platinum', icon: ICONS['legend'] },
  { id: 'rank-1',         name: 'Rank 1',          description: 'Reach #1 ranking',                       tier: 'gold',     icon: ICONS['rank-1'] },
  { id: 'comeback-king',  name: 'Comeback King',   description: 'Recover 200+ MMR after a losing streak', tier: 'gold',     icon: ICONS['comeback-king'] },
  // Match Volume
  { id: 'first-blood',    name: 'First Blood',     description: 'Play your first match',              tier: 'bronze',   icon: ICONS['first-blood'] },
  { id: 'veteran',        name: 'Veteran',         description: 'Play 50 matches',                    tier: 'silver',   icon: ICONS['veteran'] },
  { id: 'centurion',      name: 'Centurion',       description: 'Play 100 matches',                   tier: 'gold',     icon: ICONS['centurion'] },
  { id: 'solo-player',    name: 'Solo Player',     description: 'Play 5 matches in a single session', tier: 'platinum', icon: ICONS['solo-player'] },
];

// ── Compute Achievements ─────────────────────────────────────
export function computeAchievements(
  player: Player,
  allMatches: MatchRecord[],
  allPlayers: Player[],
): AchievementStatus[] {
  const playerMatches = allMatches
    .filter((m) => m.teamA.includes(player.id) || m.teamB.includes(player.id))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const totalMatches = playerMatches.length;

  // Win streak: scan chronologically, track current and max
  let currentStreak = 0;
  let maxStreak = 0;
  for (const match of playerMatches) {
    const winTeam = match.winner === 'teamA' ? match.teamA : match.teamB;
    if (winTeam.includes(player.id)) {
      currentStreak++;
      maxStreak = Math.max(maxStreak, currentStreak);
    } else {
      currentStreak = 0;
    }
  }

  // MMR history for milestone and comeback analysis
  const mmrHistory: number[] = [];
  for (const match of playerMatches) {
    const change = match.mmrChanges.find((c) => c.playerId === player.id);
    if (change) mmrHistory.push(change.newMMR);
  }
  const maxMMR = mmrHistory.length > 0 ? Math.max(...mmrHistory) : player.mmr;

  // Best comeback: max(newMMR - lowestMMRSeen) at any point in history
  let minMMRSoFar = mmrHistory[0] ?? player.mmr;
  let maxRecovery = 0;
  for (const mmr of mmrHistory) {
    if (mmr > minMMRSoFar) {
      maxRecovery = Math.max(maxRecovery, mmr - minMMRSoFar);
    } else {
      minMMRSoFar = Math.min(minMMRSoFar, mmr);
    }
  }

  // Flawless month: any calendar month with wins and zero losses
  const monthMap: Record<string, { wins: number; losses: number }> = {};
  for (const match of playerMatches) {
    const key = match.date.slice(0, 7); // "YYYY-MM"
    if (!monthMap[key]) monthMap[key] = { wins: 0, losses: 0 };
    const won = (match.winner === 'teamA' ? match.teamA : match.teamB).includes(player.id);
    if (won) monthMap[key].wins++;
    else monthMap[key].losses++;
  }
  const flawlessMonth = Object.values(monthMap).some((m) => m.wins > 0 && m.losses === 0);

  // Solo Player: max matches played in a single day
  const dayMap: Record<string, number> = {};
  for (const match of playerMatches) {
    const day = match.date.slice(0, 10); // "YYYY-MM-DD"
    dayMap[day] = (dayMap[day] ?? 0) + 1;
  }
  const maxSingleDay = Object.values(dayMap).length > 0 ? Math.max(...Object.values(dayMap)) : 0;

  // Rank 1: currently #1 in rankings AND has played at least one match
  const ranked = sortPlayersByRanking(allPlayers);
  const isRankOne = ranked[0]?.id === player.id && totalMatches > 0;

  return ACHIEVEMENTS.map((achievement): AchievementStatus => {
    switch (achievement.id) {
      case 'on-fire':
        return { achievement, earned: maxStreak >= 3,  progress: { current: Math.min(currentStreak, 3),   max: 3 } };
      case 'hot-streak':
        return { achievement, earned: maxStreak >= 5,  progress: { current: Math.min(currentStreak, 5),   max: 5 } };
      case 'unstoppable':
        return { achievement, earned: maxStreak >= 10, progress: { current: Math.min(currentStreak, 10),  max: 10 } };
      case 'flawless-month':
        return { achievement, earned: flawlessMonth };
      case 'rising-star':
        return { achievement, earned: maxMMR >= 1100,  progress: { current: Math.min(player.mmr, 1100),   max: 1100 } };
      case 'club-pro':
        return { achievement, earned: maxMMR >= 1200,  progress: { current: Math.min(player.mmr, 1200),   max: 1200 } };
      case 'elite':
        return { achievement, earned: maxMMR >= 1300,  progress: { current: Math.min(player.mmr, 1300),   max: 1300 } };
      case 'legend':
        return { achievement, earned: maxMMR >= 1400,  progress: { current: Math.min(player.mmr, 1400),   max: 1400 } };
      case 'rank-1':
        return { achievement, earned: isRankOne };
      case 'comeback-king':
        return { achievement, earned: maxRecovery >= 200, progress: { current: Math.min(Math.round(maxRecovery), 200), max: 200 } };
      case 'first-blood':
        return { achievement, earned: totalMatches >= 1,   progress: { current: Math.min(totalMatches, 1),   max: 1 } };
      case 'veteran':
        return { achievement, earned: totalMatches >= 50,  progress: { current: Math.min(totalMatches, 50),  max: 50 } };
      case 'centurion':
        return { achievement, earned: totalMatches >= 100, progress: { current: Math.min(totalMatches, 100), max: 100 } };
      case 'solo-player':
        return { achievement, earned: maxSingleDay >= 5,   progress: { current: Math.min(maxSingleDay, 5),   max: 5 } };
      default:
        return { achievement, earned: false };
    }
  });
}
