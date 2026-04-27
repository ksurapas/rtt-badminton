# Requirements Document

## Introduction

A badminton club management website built with the latest version of Astro, designed for a group of friends to track their badminton activities. The system handles bill splitting for court fees, shuttlecocks, and dinners, provides an ELO-style MMR ranking system with matchmaking, and maintains player profiles with match history. The site is deployed via GitHub Pages.

## Glossary

- **Club_Website**: The Astro-based static website serving as the main application
- **Bill_Splitter**: The module responsible for calculating and displaying cost splits among players
- **Court_Bill**: A bill record for badminton court rental fees paid by one person on behalf of the group
- **Shuttlecock_Bill**: A bill record for shuttlecock purchases paid by one person on behalf of the group
- **Dinner_Bill**: A bill record for a post-game dinner with per-person itemized costs and optional VAT/service charge
- **Payer**: The player who paid the full amount upfront and is owed money by other participants
- **Participant**: A player who was present and owes a share of the bill to the Payer
- **VAT**: Value Added Tax at 7%, optionally applied to Dinner_Bill totals
- **Service_Charge**: A 10% service charge, optionally applied to Dinner_Bill totals
- **MMR**: Matchmaking Rating, a numerical score representing a player's skill level
- **MMR_Engine**: The module that calculates MMR changes after each match
- **Match_Record**: A record of a completed game including players, teams, scores, and resulting MMR changes
- **Player_Profile**: A player's information page containing their picture, MMR, and match history
- **Matchmaker**: The module that generates balanced team assignments from a list of available players
- **Admin**: A user who can manage player profiles and enter match/bill data
- **Doubles**: A game mode with 2 players per team (2v2)
- **Singles**: A game mode with 1 player per team (1v1)
- **K_Factor**: A dynamic multiplier used in MMR calculation that determines the maximum possible MMR change per match
- **Expected_Score**: The predicted probability of winning based on the MMR difference between opponents

## Requirements

### Requirement 1: Court Bill Splitting

**User Story:** As a club member, I want to split the court rental fee among all players who played, so that the person who paid upfront gets reimbursed fairly.

#### Acceptance Criteria

1. WHEN a Court_Bill is created, THE Bill_Splitter SHALL require the Payer name, total court cost, and a list of Participants.
2. WHEN a Court_Bill is submitted, THE Bill_Splitter SHALL divide the total court cost equally among all Participants (including the Payer).
3. WHEN a Court_Bill is calculated, THE Bill_Splitter SHALL display the amount each Participant owes to the Payer.
4. THE Bill_Splitter SHALL exclude the Payer from the list of people who owe money (the Payer does not owe themselves).
5. WHEN a Court_Bill has a total that does not divide evenly, THE Bill_Splitter SHALL round each share to two decimal places.
6. IF a Court_Bill is submitted with fewer than 2 Participants, THEN THE Bill_Splitter SHALL display a validation error requesting at least 2 Participants.
7. IF a Court_Bill is submitted with a total cost of zero or a negative number, THEN THE Bill_Splitter SHALL display a validation error requesting a positive amount.

### Requirement 2: Shuttlecock Bill Splitting

**User Story:** As a club member, I want to split the shuttlecock cost separately from the court fee, so that the shuttlecock buyer gets reimbursed independently.

#### Acceptance Criteria

1. WHEN a Shuttlecock_Bill is created, THE Bill_Splitter SHALL require the Payer name, total shuttlecock cost, and a list of Participants.
2. WHEN a Shuttlecock_Bill is submitted, THE Bill_Splitter SHALL divide the total shuttlecock cost equally among all Participants (including the Payer).
3. WHEN a Shuttlecock_Bill is calculated, THE Bill_Splitter SHALL display the amount each Participant owes to the Payer.
4. THE Bill_Splitter SHALL exclude the Payer from the list of people who owe money.
5. THE Bill_Splitter SHALL keep Shuttlecock_Bill records separate from Court_Bill records, allowing a different Payer for each.
6. WHEN a Shuttlecock_Bill has a total that does not divide evenly, THE Bill_Splitter SHALL round each share to two decimal places.
7. IF a Shuttlecock_Bill is submitted with fewer than 2 Participants, THEN THE Bill_Splitter SHALL display a validation error requesting at least 2 Participants.
8. IF a Shuttlecock_Bill is submitted with a total cost of zero or a negative number, THEN THE Bill_Splitter SHALL display a validation error requesting a positive amount.

### Requirement 3: Dinner Bill Splitting

**User Story:** As a club member, I want to split the dinner bill with per-person itemized costs and optional tax/service charges, so that each person pays exactly what they ordered plus their share of extras.

#### Acceptance Criteria

1. WHEN a Dinner_Bill is created, THE Bill_Splitter SHALL require the Payer name and a list of Participants with individual item costs entered manually.
2. THE Bill_Splitter SHALL provide a checkbox to apply VAT at 7% to the Dinner_Bill total.
3. THE Bill_Splitter SHALL provide a checkbox to apply Service_Charge at 10% to the Dinner_Bill total.
4. WHEN both VAT and Service_Charge are selected, THE Bill_Splitter SHALL apply Service_Charge to the subtotal first, then apply VAT to the result (subtotal + service charge).
5. WHEN a Dinner_Bill is calculated, THE Bill_Splitter SHALL compute each Participant's share as their individual item cost plus their proportional share of VAT and Service_Charge (if selected).
6. WHEN a Dinner_Bill is calculated, THE Bill_Splitter SHALL display the amount each Participant owes to the Payer.
7. THE Bill_Splitter SHALL exclude the Payer from the list of people who owe money.
8. WHEN a Dinner_Bill has amounts that do not resolve to exact cents, THE Bill_Splitter SHALL round each share to two decimal places.
9. IF a Dinner_Bill is submitted with no Participants, THEN THE Bill_Splitter SHALL display a validation error requesting at least 1 Participant.
10. IF a Dinner_Bill Participant has an item cost of a negative number, THEN THE Bill_Splitter SHALL display a validation error requesting a non-negative amount.

### Requirement 4: MMR Calculation

**User Story:** As a club member, I want an ELO-style MMR system that reflects skill level, so that rankings are meaningful and reward upsets.

#### Acceptance Criteria

1. WHEN a new player is added, THE MMR_Engine SHALL assign an initial MMR of 1000.
2. WHEN a match result is recorded, THE MMR_Engine SHALL increase the winning player's MMR and decrease the losing player's MMR.
3. THE MMR_Engine SHALL calculate the Expected_Score for each player using the formula: Expected_Score = 1 / (1 + 10^((opponent_MMR - player_MMR) / 400)).
4. THE MMR_Engine SHALL calculate MMR change as: K_Factor * (actual_score - Expected_Score), where actual_score is 1 for a win and 0 for a loss.
5. THE MMR_Engine SHALL use a K_Factor of 32 for all players.
6. WHEN a lower-rated player defeats a higher-rated player, THE MMR_Engine SHALL award a larger MMR gain to the lower-rated player than it would for a higher-rated player defeating the same opponent.
7. FOR ALL match results, THE MMR_Engine SHALL ensure the total MMR gained by winners equals the total MMR lost by losers (zero-sum property).
8. WHEN a Doubles match result is recorded, THE MMR_Engine SHALL calculate MMR changes using the average MMR of each team as the team's rating.
9. WHEN a Doubles match result is recorded, THE MMR_Engine SHALL apply the same MMR change to both players on a team.

### Requirement 5: Match Recording

**User Story:** As a club member, I want to record match results for singles and doubles games, so that MMR and history are kept up to date.

#### Acceptance Criteria

1. WHEN a Match_Record is created, THE Club_Website SHALL require the game mode (Singles or Doubles), the players on each side, and the winning side.
2. WHEN a Singles Match_Record is submitted, THE Club_Website SHALL accept exactly 1 player per side.
3. WHEN a Doubles Match_Record is submitted, THE Club_Website SHALL accept exactly 2 players per side.
4. WHEN a Match_Record is submitted, THE MMR_Engine SHALL update each involved player's MMR according to the MMR calculation rules.
5. WHEN a Match_Record is submitted, THE Club_Website SHALL store the match date, game mode, players, winning side, and MMR changes in the Match_Record.
6. IF a Match_Record is submitted with a player appearing on both sides, THEN THE Club_Website SHALL display a validation error.
7. IF a Match_Record is submitted with duplicate players on the same side, THEN THE Club_Website SHALL display a validation error.

### Requirement 6: Matchmaking

**User Story:** As a club member, I want the system to generate balanced teams from available players, so that games are fair and competitive.

#### Acceptance Criteria

1. WHEN a list of available players is provided, THE Matchmaker SHALL generate team assignments for the session.
2. WHEN 2 players are available, THE Matchmaker SHALL create a Singles match.
3. WHEN 4 players are available, THE Matchmaker SHALL create a Doubles match pairing players to minimize the MMR difference between teams.
4. WHEN 3 players are available, THE Matchmaker SHALL indicate that one player must sit out and suggest the fairest Singles match from the three.
5. WHEN more than 4 players are available, THE Matchmaker SHALL generate multiple matches and assign players to minimize overall MMR difference across all matches.
6. WHEN more than 4 players are available and the count is odd, THE Matchmaker SHALL indicate which players sit out for each round.
7. THE Matchmaker SHALL display the expected win probability for each side based on current MMR values.
8. IF fewer than 2 players are provided, THEN THE Matchmaker SHALL display a validation error requesting at least 2 players.

### Requirement 7: Player Profile

**User Story:** As a club member, I want each player to have a profile page with their picture, MMR, and match history, so that I can track progress over time.

#### Acceptance Criteria

1. THE Club_Website SHALL display a Player_Profile page for each registered player.
2. THE Player_Profile SHALL display the player's name, profile picture, current MMR, and match history.
3. THE Player_Profile SHALL list all Match_Records involving the player in reverse chronological order.
4. WHEN a player does not have a profile picture, THE Club_Website SHALL display a default placeholder image.
5. THE Club_Website SHALL allow a player or the Admin to upload a profile picture for the player.
6. WHEN a profile picture is uploaded, THE Club_Website SHALL accept image files in JPEG, PNG, or WebP format.
7. IF a profile picture upload exceeds 5MB, THEN THE Club_Website SHALL display a validation error requesting a smaller file.

### Requirement 8: Player Ranking

**User Story:** As a club member, I want to see a leaderboard of all players ranked by MMR, so that I can see who is the best in the group.

#### Acceptance Criteria

1. THE Club_Website SHALL display a ranking page listing all players sorted by MMR in descending order.
2. THE Club_Website SHALL display each player's rank position, name, profile picture, current MMR, total wins, and total losses on the ranking page.
3. WHEN two or more players have the same MMR, THE Club_Website SHALL rank them by total number of wins (higher wins ranked first).
4. WHEN two or more players have the same MMR and the same number of wins, THE Club_Website SHALL rank them alphabetically by name.

### Requirement 9: Deployment Documentation

**User Story:** As a non-technical user, I want a step-by-step README explaining how to set up a GitHub remote and deploy to GitHub Pages, so that I can publish the website without prior deployment experience.

#### Acceptance Criteria

1. THE Club_Website SHALL include a README.md file in the project root.
2. THE README.md SHALL contain step-by-step instructions for creating a GitHub repository and setting up a Git remote.
3. THE README.md SHALL contain step-by-step instructions for deploying the Astro site to GitHub Pages.
4. THE README.md SHALL be written in plain language suitable for a user with no prior deployment experience.
5. THE README.md SHALL include instructions for installing project dependencies and running the site locally.

### Requirement 10: Data Persistence

**User Story:** As a club member, I want all player data, match records, and bill records to persist across sessions, so that nothing is lost when the browser is closed.

#### Acceptance Criteria

1. THE Club_Website SHALL store all Player_Profile data, Match_Records, and bill records in the browser's localStorage.
2. WHEN the Club_Website is loaded, THE Club_Website SHALL restore all previously saved data from localStorage.
3. WHEN any data is created or modified, THE Club_Website SHALL save the updated data to localStorage immediately.
4. IF localStorage data is corrupted or unparseable, THEN THE Club_Website SHALL start with empty data and display a warning to the user.

### Requirement 11: MMR Calculation Round-Trip Integrity

**User Story:** As a developer, I want to verify that MMR calculations are consistent and reversible in aggregate, so that the ranking system is trustworthy.

#### Acceptance Criteria

1. FOR ALL Match_Records, THE MMR_Engine SHALL produce identical MMR changes when the same match inputs (player MMRs, match result) are provided (deterministic property).
2. FOR ALL Match_Records, THE MMR_Engine SHALL ensure the sum of all MMR changes across all players in a single match equals zero (zero-sum round-trip property).
3. FOR ALL players, THE Player_Profile MMR SHALL equal 1000 plus the sum of all MMR changes from the player's Match_Records (audit trail property).
