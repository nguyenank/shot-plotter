# Perth Thunder Stats 2026 — Project Brief for Claude

## What This Is

A customised fork of [shot-plotter](https://github.com/nguyenank/shot-plotter) by An Nguyen, adapted into a full hockey stats tracking tool for the Perth Thunder 2026 season. Deployed on Railway via Docker.

**Repo:** https://github.com/alastair-punler/Perth-Thunder-Stats-2026  
**Live URL:** served at `perththunder.punler.com` (Railway deployment)

---

## Tech Stack

| Layer | Tech |
|-------|------|
| Rendering | D3.js v6 (SVG), Bootstrap 5, jQuery 3.5, Select2 |
| Logic | Vanilla JS ES6 modules — **no build step, no bundler** |
| Persistence | `localDataStorage` (localStorage wrapper), per-sport namespaced |
| CSV | PapaParse (parse) + downloadjs (export) |
| Server | nginx:alpine in Docker, `${PORT}` injected via envsubst template |
| Deployment | Railway (auto-deploys from GitHub main branch) |

---

## Repository Structure

```
shot-plotter/
├── html/
│   ├── index.html              # NHL rink (home page)
│   ├── ice-hockey.html         # NHL rink (duplicate, kept for direct URL)
│   └── ice-hockey-iihf.html    # IIHF rink (60×30 m)
├── js/
│   ├── shots/
│   │   ├── shot.js             # Click → dot + table row pipeline
│   │   ├── dot.js              # SVG dot/polygon rendering
│   │   └── legend.js           # Shot type + team colour legend
│   ├── table/
│   │   ├── table.js            # Table render + pagination
│   │   ├── table-functions.js  # getRows(), getFilteredRows(), etc.
│   │   ├── row.js              # Row render + delete (exports deleteHandler)
│   │   └── filter.js           # Filter logic
│   ├── details/                # Customisable form widget system + modal
│   ├── roster/
│   │   ├── roster.js           # Player Stats panel UI + data
│   │   └── roster-state.js     # Shared selection state (avoids circular imports)
│   ├── summary/
│   │   └── summary.js          # Summary tab: normalised rink + stats tables
│   ├── playing-area.js         # SVG scale/clip setup
│   ├── toggles.js              # Heat map, 2-location, zone labels
│   └── config-appearance.js   # Team colours, dot sizes, animation durations
├── setup.js                    # Init orchestrator, exports global state
├── supported-sports.json       # Config for all sports (only NHL + IIHF used)
├── index.css                   # All styles
├── Dockerfile                  # nginx:alpine, envsubst for PORT
├── nginx.conf                  # Serves root → html/index.html, extensionless URLs
└── railway.toml                # Health check config
```

---

## Key Architectural Decisions

### Coordinate System
- SVG origin: top-left (0,0), X right, Y down
- Rink space: NHL = 200×85 ft, IIHF = 60×30 m
- `specialData.coords = [svgX, svgY]` — raw rink-space units from `d3.pointer(e)`
- Game coords stored in `rowData["x"/"y"]`: `x = svgX - W/2`, `y = -(svgY - H/2)`
- The `#transformations` SVG group has `translate(10,10) scale(resize,resize)` applied by `playing-area.js`

### Period / Team Convention
- **P1, P3, OT**: Home (Perth Thunder / blueTeam) attacks **RIGHT** (svgX > 100)
- **P2**: Home attacks **LEFT** (svgX < 100) — ends switch
- `autoSelectTeam()` in `shot.js` auto-selects team based on click position + period
- Zone labels on rink update when period changes

### Row Data Model
```javascript
{
  id: "uuid",
  rowData: {
    "shot-number": 5,
    "period": "1"|"2"|"3"|"OT",
    "team": "Home"|"Away",
    "shot-type": "Shot"|"Goal"|"#25 — Hits"|"#25 — Turnovers"|...
  },
  specialData: {
    teamColor: "blueTeam"|"orangeTeam",
    coords: [svgX, svgY],
    typeIndex: 0,
    isStatRow: true|undefined,  // true = roster stat, no dot on rink
    player: "25"
  },
  selected: false
}
```

### `isStatRow` Flag
Roster stat events (hits, turnovers, FO win/loss) share the main shot table but have `specialData.isStatRow = true`. This flag:
- Prevents a dot being drawn in `#dots` (roster markers in `#player-events` instead)
- Triggers roster stat cleanup when table row is deleted (via `triggerDeleteStat` callback)

### Avoiding Circular Imports
`shot.js` → `roster-state.js` (shared state/callbacks), NOT `roster.js`  
`roster.js` → `shot.js` (createShotFromData), `roster-state.js`  
`row.js` → `roster-state.js` (triggerDeleteStat)

---

## Custom Features Added (vs original shot-plotter)

### 1. Hockey-only (stripped all other sports)
- Only NHL and IIHF rinks remain
- Rink switcher in Customize Setup modal (`./ice-hockey.html` ↔ `./ice-hockey-iihf.html`)

### 2. Auto Team Selection
`autoSelectTeam(svgX)` in `shot.js` — fires on every rink click, reads period, selects the correct team radio button before shot is recorded. No manual team selection needed.

### 3. Zone Labels on Rink
SVG text labels ("Home" / "Away") inside `#transformations`, update on period change. Implemented in `setUpRinkLabels()` / `updateRinkLabels()` in `shot.js`.

### 4. Period-Filtered Rink Dots
Dots on the **input rink** show only the currently selected period. Implemented via CSS class `.period-hidden { visibility: hidden !important; }` applied by `updatePeriodDotVisibility()` in `shot.js`. The shot table is unaffected.

### 5. Player Stats Panel (`js/roster/roster.js`)
- Pre-loaded with Perth Thunder 2026 roster (20 players, `DEFAULT_PLAYERS` array)
- Tracks: Turnovers (triangle, purple), Hits (diamond, red), FO Win (circle, green), FO Loss (circle, orange)
- Workflow: click player → click stat column → click ice location → records stat + ice marker + table row
- Deselects after each recording (prevents doubles)
- CSV upload/download for roster management
- `−` button per stat cell removes most recent event for that player+stat
- Stat table title: "Player Stats" (not "Home Team Roster")
- **Location**: appears ABOVE the shot table

### 6. Summary Tab (`js/summary/summary.js`)
- **Stats tables** (top): Shots by period (Home/Away/Total) + Player Stats by period (Hits/Turnovers/FO Win/FO Loss/FO%)
- **Period filter**: All / P1 / P2 / P3 / OT
- **Event type toggles**: Shots / Hits / Turnovers / Faceoffs
- **Rink**: Clones the live input rink SVG (full faceoff circles, all markings), strips interactive layers, renames `clipPath` IDs with `s-` prefix to avoid document conflicts
- **Normalisation**: P2 events flip X → `nx = W - rawX` so home always attacks right
- **Zone labels**: "Defensive Zone" (left, orange) / "Offensive Zone" (right, teal)
- **Faceoff analytics**: Nearest-neighbour clustering to 9 faceoff dot positions, shows W/L/% badge at each dot with data. Green % ≥ 50%, red % < 50%
- **Faceoff dot positions** (NHL): center (100,42.5), neutral (80/120, 20.5/64.5), end zones (31/169, 20.5/64.5)
- **Faceoff dot positions** (IIHF): center (30,15), neutral (24/36, 8/22), end zones (10/50, 8/22)

### 7. Reset All Data Button
Top-right of header, `position: absolute`. Confirm dialog → `localStorage.clear()` + `location.reload()`. Implemented in `setUpResetButton()` in `setup.js`.

---

## Shot Table Columns (current defaults)
`#`, `Period`, `Team`, `Type`, `X`, `Y`

- Player column **removed** from defaults
- Shot types reduced to **Shot** and **Goal** (Block and Miss removed)
- Stat rows show type as `"#25 — Hits"` etc. (player number embedded in type column)

---

## CSV Schema

CSV export/import uses a **fixed canonical schema** that is deliberately decoupled from the visible shot-table columns (so roster stat rows can round-trip without forcing a Player column into the UI).

**Columns (in order, exact casing):**
```
Period, Team, Type, Player, X, Y
```

- **Shot rows**: `Type` is `Shot`|`Goal`, `Player` is blank.
- **Roster stat rows**: `Type` is `Hits`|`Turnovers`|`FO Win`|`FO Loss`, `Player` is the jersey number (e.g. `25`).
- `X`/`Y` are game coords (same as `rowData.x`/`y` — origin at rink centre).

**Label ↔ stat-key map** (must match both `STAT_LABEL_BY_KEY` in `js/csv.js` and the `STATS` array in `js/roster/roster.js`):
| CSV Type | roster statKey |
|---|---|
| `Hits` | `hits` |
| `Turnovers` | `turnovers` |
| `FO Win` | `faceoffWins` |
| `FO Loss` | `faceoffLosses` |

**Export** ([js/csv.js `downloadCSV`](js/csv.js)): for stat rows, splits `#NN — Label` into separate `Player` + `Type` cells. For shots, writes `Type` as-is.

**Import** ([js/csv.js `processCSV`](js/csv.js)):
- Validates the header matches `CSV_HEADER` exactly; otherwise the row is rejected and the upload field is marked invalid.
- A row is treated as a stat row iff `Player` is non-empty AND `Type` is one of the four stat labels above. All stat rows are forced to `teamColor = "blueTeam"` (home).
- On each stat row, calls `applyImportedStat(rowId, playerNumber, statKey, svgCoords)` in `roster.js` — this increments the player's stat counter, appends an entry to `playerEvents` storage with `id === rowId`, and draws the ice marker in `#player-events`. The shared id is critical so table-row deletion still calls `cleanupStatEvent` correctly.
- `buildStatRowData` in `roster.js` is **unchanged**; the display string `#25 — Hits` is only reconstructed at the CSV layer on import.

**Upload lifecycle** ([js/csv.js `uploadCSV`](js/csv.js)): before Papa.parse, calls `clearTable()` **and** `resetRosterForImport()` (zeros all player stat counts, clears `playerEvents`, wipes `#player-events` SVG). After parse `complete`, calls `updateTableFooter()` and `renderRoster()`.

**Breaking change:** Legacy 5-column CSVs (`Period, Team, Type, X, Y`) no longer validate. They must be edited to the new schema by splitting the `#NN — Label` Type cells into separate `Type` + `Player` columns. A hand-converted sample lives at [4.19.2026-15.28.csv](4.19.2026-15.28.csv).

---

## Deployment

### Docker
```dockerfile
FROM nginx:alpine
ENV PORT=8080
RUN rm /etc/nginx/conf.d/default.conf
COPY . /usr/share/nginx/html
COPY nginx.conf /etc/nginx/templates/default.conf.template
```
`nginx.conf` uses `${PORT}` — substituted at container start by nginx's built-in envsubst. Root URL serves `html/index.html` directly (no redirect).

### Railway
- Auto-deploys on push to `main`
- `railway.toml` sets health check at `/html/`
- Custom domain: `perththunder.punler.com` (CNAME → Railway URL + TXT verification record required)

---

## Perth Thunder 2026 Roster (DEFAULT_PLAYERS in roster.js)
2-Tyler Colev, 3-Robert Haselhurst, 6-Patrick Sucher, 8-David Kudla, 11-Yu Hikosaka, 12-Kieren Webster, 13-Max Lyashenko, 15-Lynden Lodge, 16-Yannic Lodge, 19-Ville Tenosalmi, 23-Jordan Kyros, 25-Alastair Punler, 27-James Woodman, 28-Drew Robson, 32-Jacob Ruck, 36-Benjamin Breault, 71-Peter Hrehorcak, 81-Kolby Johnson, 89-Riley Langille, 93-Felix Plouffe

---

## Important Patterns & Gotchas

- **No circular imports**: always check before adding import between roster/shot/table modules
- **`cfgSportA`** is set async (inside `d3.json()` callback) — all setup functions run inside that callback
- **`d3.pointer(e)`** returns rink-space coords (0-200 for NHL) inside `#transformations` scaled group
- **Summary rink**: always clone from live DOM after Inputs tab has run; returns null if called before setup
- **Period filter**: CSS `!important` class overrides D3 inline styles — safe to layer on existing filter system
- **`dotsVisibility()`** in `dot.js` sets inline `visibility` on dots — period filter uses `!important` class to override safely
- **localStorage keys** are namespaced by sport: `"ice-hockey__rows"`, `"ice-hockey__roster"`, etc.
