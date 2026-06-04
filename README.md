# Perth Thunder Stats 2026

A web-based ice hockey stats tracking tool built for the Perth Thunder 2026 season. Built on top of [shot-plotter](https://github.com/nguyenank/shot-plotter) by An Nguyen.

---

## Features

### Rink & Shot Tracking
- Click anywhere on the ice to record a shot or goal
- Supports **NHL** (200 × 85 ft) and **IIHF** (60 × 30 m) rink sizes — switch between them via the Customize Setup menu
- The rink is divided into attack/defend zones that automatically update with each period:
  - **Periods 1, 3 & OT** — Home attacks the right side
  - **Period 2** — Home attacks the left side (ends switch)
- Clicking a zone auto-selects the correct team — no manual selection needed
- Zone labels on the rink show which team is attacking each end, updating in real time as you change periods

### Player Stats Panel
- Tracks per-player stats for the Home team roster
- **Stats tracked:** Turnovers, Hits, Faceoff Wins, Faceoff Losses
- Faceoff % is calculated automatically
- To record a player stat:
  1. Click the player's row
  2. Click the stat column header (e.g. Hits)
  3. Click the location on the ice where it occurred
- After each recording, selection resets to prevent accidental duplicates
- Stats are also added as rows in the main event table (with period and team)

### On-Ice Markers
Each stat type has a distinct shape and colour on the rink:

| Stat | Shape | Colour |
|------|-------|--------|
| Turnovers | Triangle | Purple |
| Hits | Diamond | Red |
| FO Win | Circle | Green |
| FO Loss | Circle | Orange |

Player jersey number is shown inside each marker.

### Roster Management
- The Perth Thunder 2026 roster is pre-loaded by default
- Add players on the fly using the number + name form
- Upload a full roster from a CSV file (download a template to get the format)
- Roster and all stats persist across browser sessions via localStorage

### Event Table
- Every shot, goal, and player stat appears in the main table below the rink
- Filter by period, team, type, coordinates, and more
- Download the full table as a CSV for further analysis
- Upload a previous CSV to restore a session

---

## Default Roster — Perth Thunder 2026

| # | Name |
|---|------|
| 2 | Tyler Colev |
| 3 | Robert Haselhurs |
| 6 | Patrick Sucher |
| 8 | David Kudla |
| 11 | Yu Hikosaka |
| 12 | Kieren Webster |
| 13 | Max Lyashenko |
| 15 | Lynden Lodge |
| 16 | Yannic Lodge |
| 19 | Ville Tenosalmi |
| 23 | Jordan Kyros |
| 25 | Alastair Punler |
| 27 | James Woodman |
| 28 | Drew Robson |
| 32 | Jacob Ruck |
| 36 | Benjamin Breault |
| 71 | Peter Hrehorcak |
| 81 | Kolby Johnson |
| 89 | Riley Langille |
| 93 | Felix Plouffe |

---

## Tech Stack

- [D3.js](https://d3js.org/) — SVG rink rendering and interaction
- [Bootstrap 5](https://getbootstrap.com/) — UI layout and modals
- [PapaParse](https://www.papaparse.com/) — CSV import/export
- [localDataStorage](https://github.com/macmcmeans/localDataStorage) — localStorage persistence
- Vanilla JavaScript (ES6 modules) — no build step required

---

## Running Locally

Open `html/index.html` directly in a browser, or serve the project root with any static file server:

```bash
npx serve .
```

Then navigate to `http://localhost:3000/html/`.

---

## Credits

Built on [shot-plotter](https://github.com/nguyenank/shot-plotter) by [An Nguyen](https://github.com/nguyenank), customised for Perth Thunder ice hockey stats tracking.
