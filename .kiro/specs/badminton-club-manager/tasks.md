# Implementation Plan: RTT Badminton Club Manager

## Overview

Create a complete, runnable Astro 5.x static site project from scratch. All files (config, source, tests, CI) are generated as a folder structure. The user will copy the project to a machine with Node.js/npm and run `npm install && npm run dev`. No commands are executed during task creation — this is purely file generation.

## Tasks

- [x] 1. Scaffold project configuration files
  - [x] 1.1 Create `package.json` with Astro 5.x, Vitest, and fast-check dependencies
    - Include scripts: `dev`, `build`, `preview`, `test` (`vitest --run`)
    - Include `astro`, `@astrojs/check`, `typescript`, `vitest`, `fast-check` as dependencies/devDependencies
    - _Requirements: 9.5_

  - [x] 1.2 Create `astro.config.mjs` with static output and GitHub Pages site config
    - Set `output: 'static'`, configure `site` and `base` for GitHub Pages
    - _Requirements: 9.3_

  - [x] 1.3 Create `tsconfig.json` with strict TypeScript settings extending Astro's base
    - Extend `astro/tsconfigs/strict`
    - _Requirements: (project setup)_

- [x] 2. Implement core TypeScript types and StorageService
  - [x] 2.1 Create `src/lib/types.ts` with all shared interfaces and types
    - Define `Player`, `MatchRecord`, `MatchInput`, `MMRChange`, `GameMode`, `Bill`, `CourtBill`, `ShuttlecockBill`, `DinnerBill`, `DinnerParticipant`, `BillSplitResult`, `ValidationResult`, `AppData`, `MatchAssignment`, `MatchmakingResult`
    - _Requirements: 1.1, 2.1, 3.1, 4.1, 5.1, 5.5, 7.2_

  - [x] 2.2 Create `src/lib/storage-service.ts`
    - Implement `loadData()`, `saveData()`, `savePlayers()`, `saveMatches()`, `saveBills()`, `isDataCorrupted()`
    - Store under `localStorage` key `rtt-badminton-data`
    - Handle corrupted data gracefully: return empty `AppData` and log warning
    - _Requirements: 10.1, 10.2, 10.3, 10.4_

  - [ ]* 2.3 Create `src/lib/storage-service.test.ts` with unit tests and property test for round-trip persistence
    - Unit tests: save and load players, matches, bills; handle corrupted JSON; handle empty localStorage
    - **Property 15: Data persistence round-trip**
    - **Validates: Requirements 10.1, 10.2, 10.3**

- [x] 3. Implement BillSplitter module
  - [x] 3.1 Create `src/lib/bill-splitter.ts`
    - Implement `calculateCourtSplit()`, `calculateShuttlecockSplit()`, `calculateDinnerSplit()`, `validateBill()`
    - Court/Shuttlecock: equal split, round to 2 decimals
    - Dinner: proportional share of VAT (7%) and service charge (10%), SC applied first then VAT
    - Exclude payer from owes list in all bill types
    - Validate: min 2 participants for court/shuttlecock, min 1 for dinner, positive costs, non-negative dinner item costs
    - _Requirements: 1.1–1.7, 2.1–2.8, 3.1–3.10_

  - [ ]* 3.2 Create `src/lib/bill-splitter.test.ts` with unit tests and property tests
    - Unit tests: 4-player court split of 600 = 150 each; 2-participant edge case; rounding; dinner with VAT+SC; validation errors for negative cost, <2 participants, etc.
    - **Property 1: Equal bill split correctness**
    - **Validates: Requirements 1.2, 2.2**
    - **Property 2: Payer exclusion from owes list**
    - **Validates: Requirements 1.4, 2.4, 3.7**
    - **Property 3: Dinner bill proportional share with VAT/SC ordering**
    - **Validates: Requirements 3.4, 3.5**

- [x] 4. Implement MMREngine module
  - [x] 4.1 Create `src/lib/mmr-engine.ts`
    - Implement `calculateExpectedScore()`, `calculateMMRChange()`, `processMatch()`, `getInitialMMR()`
    - ELO formula with K=32, initial MMR 1000
    - Doubles: team rating = average of both players' MMRs, both players get same delta
    - Zero-sum property: total deltas sum to 0
    - _Requirements: 4.1–4.9, 5.4, 11.1, 11.2_

  - [ ]* 4.2 Create `src/lib/mmr-engine.test.ts` with unit tests and property tests
    - Unit tests: initial MMR = 1000, K=32, equal-MMR match gives ±16, specific doubles scenario, determinism check
    - **Property 4: MMR winners gain, losers lose**
    - **Validates: Requirements 4.2**
    - **Property 5: Expected scores sum to one**
    - **Validates: Requirements 4.3**
    - **Property 6: MMR upset bonus**
    - **Validates: Requirements 4.6**
    - **Property 7: MMR zero-sum**
    - **Validates: Requirements 4.7, 11.2**
    - **Property 8: Doubles MMR consistency**
    - **Validates: Requirements 4.8, 4.9**
    - **Property 9: Match recording integrity**
    - **Validates: Requirements 5.4, 5.5**
    - **Property 16: MMR determinism**
    - **Validates: Requirements 11.1**
    - **Property 17: MMR audit trail**
    - **Validates: Requirements 11.3**

- [x] 5. Checkpoint — Verify core logic modules
  - Ensure all tests pass, ask the user if questions arise.

- [x] 6. Implement Matchmaker and Ranking modules
  - [x] 6.1 Create `src/lib/matchmaker.ts`
    - Implement `generateMatchups()` and `calculateWinProbability()`
    - 2 players → singles; 3 → best singles + sit-out; 4 → doubles minimizing MMR diff; 5+ → multiple matches with sit-outs
    - Win probability from ELO expected score
    - Validate: at least 2 players
    - _Requirements: 6.1–6.8_

  - [ ]* 6.2 Create `src/lib/matchmaker.test.ts` with unit tests and property tests
    - Unit tests: 2-player singles, 4-player doubles optimal pairing, 5-player multi-match with sit-out, <2 player validation
    - **Property 10: Matchmaker minimizes MMR difference**
    - **Validates: Requirements 6.3, 6.4**
    - **Property 11: Matchmaker assignment completeness**
    - **Validates: Requirements 6.5, 6.6**
    - **Property 12: Matchmaker win probability validity**
    - **Validates: Requirements 6.7**

  - [x] 6.3 Create `src/lib/ranking.ts`
    - Implement `sortPlayersByRanking()` — sort by MMR desc, then wins desc, then name alphabetically
    - Implement `getMatchHistoryForPlayer()` — filter and sort matches reverse chronological
    - _Requirements: 8.1, 8.3, 8.4, 7.3_

  - [ ]* 6.4 Create `src/lib/ranking.test.ts` with unit tests and property tests
    - Unit tests: basic sorting, tie-breaking by wins, tie-breaking by name, match history ordering
    - **Property 13: Match history sorted by date descending**
    - **Validates: Requirements 7.3**
    - **Property 14: Ranking sorted correctly**
    - **Validates: Requirements 8.1, 8.3, 8.4**

- [x] 7. Checkpoint — Verify all lib modules
  - Ensure all tests pass, ask the user if questions arise.

- [x] 8. Create Astro layouts and shared UI components
  - [x] 8.1 Create `src/layouts/Layout.astro` — base HTML layout with nav, head, global styles
    - Navigation links: Home, Players, Ranking, Matches, Matchmaking, Bills
    - Responsive layout, badminton-themed color scheme
    - _Requirements: (project structure)_

  - [x] 8.2 Create `src/components/PlayerCard.astro` — BWF-style player card for grid views
    - Profile photo (or placeholder), name (first + LAST NAME caps), MMR badge, W/L record
    - Links to player profile page
    - _Requirements: 7.2, 7.4_

  - [x] 8.3 Create `src/lib/utils.ts` — shared utility functions
    - UUID generation, date formatting, default placeholder image data URL
    - _Requirements: (shared utilities)_

- [x] 9. Create page components — Home, Players, Player Profile
  - [x] 9.1 Create `src/pages/index.astro` — Dashboard/home page
    - Quick links to all sections, brief club overview
    - _Requirements: (navigation)_

  - [x] 9.2 Create `src/pages/players/index.astro` — Player list page (BWF-style card grid)
    - Search bar for filtering by name
    - Card grid using `PlayerCard` component
    - "Add Player" form: name input, profile picture upload (JPEG/PNG/WebP, max 5MB)
    - Client-side hydration with `client:load` for interactivity
    - _Requirements: 7.1, 7.2, 7.4, 7.5, 7.6, 7.7_

  - [x] 9.3 Create `src/pages/players/[id].astro` — Player profile page (BWF-style)
    - Hero banner with gradient, large profile photo, player name (first + LAST NAME caps)
    - Stats row: MMR, rank position, W/L record
    - Match history list: date, mode, opponents, result, MMR delta — reverse chronological
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 11.3_

- [x] 10. Create page components — Ranking, Matches, Matchmaking
  - [x] 10.1 Create `src/pages/ranking.astro` — Leaderboard page
    - Table: rank, thumbnail, name, MMR, wins, losses
    - Top 3 highlighted with gold/silver/bronze accents
    - Sorted by MMR desc, ties broken by wins then name
    - _Requirements: 8.1, 8.2, 8.3, 8.4_

  - [x] 10.2 Create `src/pages/matches.astro` — Match recording page
    - Form: game mode toggle (Singles/Doubles), player selectors for each side, winner selection
    - Validation: no player on both sides, no duplicates, correct player count per mode
    - On submit: call `processMatch()`, update player MMR, save to storage
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 5.7_

  - [x] 10.3 Create `src/pages/matchmaking.astro` — Matchmaker page
    - Player selection (checkboxes from registered players)
    - "Generate Matchups" button
    - Results: match cards with team assignments, MMR difference, win probability
    - Sit-out indicators for odd counts
    - Validation: at least 2 players
    - _Requirements: 6.1–6.8_

- [x] 11. Create Bills page with tabbed interface
  - [x] 11.1 Create `src/pages/bills.astro` — Bill splitting page
    - Tab navigation: Court | Shuttlecock | Dinner
    - Court tab: payer, total cost, participant checkboxes, submit → display split
    - Shuttlecock tab: same as court tab
    - Dinner tab: payer, per-person item cost inputs, VAT/SC checkboxes, submit → display itemized split
    - Past bills list per tab
    - Validation errors displayed inline
    - _Requirements: 1.1–1.7, 2.1–2.8, 3.1–3.10_

- [x] 12. Checkpoint — Verify all pages render and wire together
  - Ensure all tests pass, ask the user if questions arise.

- [x] 13. Create static assets and public files
  - [x] 13.1 Create `public/favicon.svg` — simple badminton shuttlecock icon
    - _Requirements: (project completeness)_

  - [x] 13.2 Create `src/styles/global.css` — global stylesheet
    - Badminton-themed color palette, responsive grid, BWF-inspired card and profile styles
    - _Requirements: (UI design)_

- [x] 14. Create GitHub Actions workflow and README
  - [x] 14.1 Create `.github/workflows/deploy.yml` — GitHub Pages deployment workflow
    - Trigger on push to `main`
    - Steps: checkout, setup Node, install deps, build, deploy to GitHub Pages
    - _Requirements: 9.3_

  - [x] 14.2 Create `README.md` with complete setup and deployment instructions
    - Step-by-step: install Node.js (link to nodejs.org), verify with `node -v` and `npm -v`
    - Step-by-step: copy the project folder to the target PC, open terminal in that folder
    - Step-by-step: `npm install` to install dependencies
    - Step-by-step: `npm run dev` to start the local dev server, explain what `localhost:4321` means and how to open it in a browser
    - Step-by-step: `npm run build` to create a production build, `npm run preview` to preview the built site locally
    - Step-by-step: create a GitHub account (if needed), create a new repository, set up Git remote (`git init`, `git remote add origin`, `git push`)
    - Step-by-step: enable GitHub Pages in repo Settings → Pages → Source: GitHub Actions
    - Step-by-step: push code to trigger automatic deployment via GitHub Actions
    - Running tests: `npm test`
    - Written in plain, beginner-friendly language — assume the user has never used terminal, Git, or GitHub before
    - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5_

- [x] 15. Final checkpoint — Complete project verification
  - Ensure all tests pass, ask the user if questions arise.
  - Verify the project folder is self-contained and ready to copy to another machine.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- No commands are run during implementation — all tasks produce files only
- The user will copy the entire project folder to a PC with Node.js/npm and run `npm install` then `npm run dev`
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Property tests validate universal correctness properties from the design document
- Unit tests validate specific examples and edge cases
