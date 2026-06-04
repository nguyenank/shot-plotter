import { dataStorage, sport, cfgSportA } from "../../setup.js";
import { createShotFromData } from "../shots/shot.js";
import { getNumRows, getHeaderRow } from "../table/table-functions.js";
import { polygon } from "../shots/dot.js";
import { cfgAppearance } from "../config-appearance.js";
import {
    setRecordCallback, setDeleteStatCallback,
    setSelectedPlayer, getSelectedPlayer,
    setSelectedStat, getSelectedStat,
} from "./roster-state.js";
import { deleteHandler } from "../table/row.js";

const DEFAULT_PLAYERS = [
    { number: "2",  name: "Tyler Colev" },
    { number: "3",  name: "Robert Haselhurst" },
    { number: "6",  name: "Patrick Sucher" },
    { number: "8",  name: "David Kudla" },
    { number: "11", name: "Yu Hikosaka" },
    { number: "12", name: "Kieren Webster" },
    { number: "13", name: "Maxim Lyashenko" },
    { number: "15", name: "Lynden Lodge" },
    { number: "16", name: "Yannic Lodge" },
    { number: "17", name: "Brayden Maybee" },
    { number: "18", name: "Jani Kluuskeri" },
    { number: "19", name: "Ville Tenosalmi" },
    { number: "22", name: "Henri Auvinen" },
    { number: "23", name: "Jordan Kyros" },
    { number: "25", name: "Alastair Punler" },
    { number: "27", name: "James Woodman" },
    { number: "28", name: "Drew Robson" },
    { number: "32", name: "Jakob Ruck" },
    { number: "36", name: "Benjamin Breault" },
    { number: "71", name: "Peter Hrehorcak" },
    { number: "89", name: "Riley Langille" },
    { number: "93", name: "Felix Plouffe" },
    { number: "98", name: "Finlay Gordon" },
];

const STATS = [
    { key: "turnovers",     label: "Turnovers", color: "#8338ec", sides: 3 },
    { key: "hits",          label: "Hits",       color: "#e63946", sides: 4 },
    { key: "faceoffWins",   label: "FO Win",     color: "#2dc653", sides: null },
    { key: "faceoffLosses", label: "FO Loss",    color: "#fb8500", sides: null },
];

function rosterKey()  { return `${sport}__roster`; }
function eventsKey()  { return `${sport}__playerEvents`; }

function getPlayers()       { return dataStorage.get(rosterKey())  || []; }
function savePlayers(p)     { dataStorage.set(rosterKey(),  p); }
function getEvents()        { return dataStorage.get(eventsKey())  || []; }
function saveEvents(e)      { dataStorage.set(eventsKey(), e); }

// Shared cleanup: decrement stat, remove storage entry, remove SVG marker, re-render.
// Does NOT touch the table row — that's handled by deleteHandler in row.js.
function decrementStat(player, statKey) {
    const events = getEvents();
    // Find the most recent event for this player + stat
    const last = [...events].reverse().find(e => e.playerId === player.id && e.stat === statKey);
    if (!last) return;
    cleanupStatEvent(last.id);
    deleteHandler(last.id);
}

function cleanupStatEvent(eventId) {
    const events = getEvents();
    const ev = events.find(e => e.id === eventId);
    if (!ev) return;

    const players = getPlayers();
    const player  = players.find(p => p.id === ev.playerId);
    if (player) {
        player.stats[ev.stat] = Math.max(0, player.stats[ev.stat] - 1);
        savePlayers(players);
    }

    saveEvents(events.filter(e => e.id !== eventId));
    d3.select(`#pe-${eventId}`).remove();
    renderRoster();
}

// Called when the ice marker is clicked — cleans up roster AND table row.
function deleteStatEvent(eventId) {
    cleanupStatEvent(eventId);
    deleteHandler(eventId);
}

function drawMarker(event, player) {
    const stat = STATS.find(s => s.key === event.stat);
    const r  = parseFloat(cfgSportA.circleR) * 0.9;
    const sw = parseFloat(cfgSportA.strokeWidth || "0.5") * 0.6;
    const [cx, cy] = event.coords;
    const g = d3.select("#player-events").append("g")
        .attr("id", `pe-${event.id}`);

    if (stat.sides) {
        g.append("polygon")
            .attr("points", polygon(cx, cy, r, stat.sides))
            .attr("fill", stat.color)
            .attr("fill-opacity", 0.9)
            .attr("stroke", "white")
            .attr("stroke-width", sw);
    } else {
        g.append("circle")
            .attr("cx", cx).attr("cy", cy).attr("r", r)
            .attr("fill", stat.color)
            .attr("fill-opacity", 0.9)
            .attr("stroke", "white")
            .attr("stroke-width", sw);
    }

    if (player.number) {
        g.append("text")
            .attr("x", cx).attr("y", cy)
            .attr("text-anchor", "middle")
            .attr("dominant-baseline", "central")
            .attr("font-size", r * 1.1)
            .attr("font-family", "Open Sans, sans-serif")
            .attr("font-weight", "700")
            .attr("fill", "white")
            .attr("pointer-events", "none")
            .text(player.number);
    }
}

function buildStatRowData(player, statKey, svgCoords) {
    const columns  = getHeaderRow();
    const label    = STATS.find(s => s.key === statKey).label;
    const homeName = d3.select("#blue-team-name").property("value") || "PER";
    const period   = d3.select('input[name="period"]:checked').empty()
        ? "1" : d3.select('input[name="period"]:checked').property("value");

    const rowData = {};
    for (const col of columns) {
        switch (col.type) {
            case "shot-number": rowData[col.id] = getNumRows() + 1; break;
            case "radio":
                rowData[col.id] = col.id === "period"
                    ? period
                    : (d3.select(`input[name="${col.id}"]:checked`).property("value") || "");
                break;
            case "team":  rowData[col.id] = homeName; break;
            case "shot-type":
            case "dropdown": rowData[col.id] = col.id === "shot-type" ? `#${player.number} — ${label}` : ""; break;
            case "x":
                rowData[col.id] = col.id === "x"
                    ? (svgCoords[0] - parseFloat(cfgSportA.width)  / 2).toFixed(2) : "";
                break;
            case "y":
                rowData[col.id] = col.id === "y"
                    ? (-1 * (svgCoords[1] - parseFloat(cfgSportA.height) / 2)).toFixed(2) : "";
                break;
            default: rowData[col.id] = "";
        }
    }

    const specialData = {
        typeIndex: 0,
        teamColor: "blueTeam",
        coords: svgCoords,
        player: player.number,
        numberCol: _.findIndex(columns, { type: "shot-number" }) - 1,
        isStatRow: true,
    };
    return { rowData, specialData };
}

function recordStat(player, statKey, svgCoords) {
    const players = getPlayers();
    const p = players.find(pl => pl.id === player.id);
    if (!p) return;

    p.stats[statKey]++;
    savePlayers(players);

    const event = { id: uuidv4(), playerId: p.id, stat: statKey, coords: svgCoords };
    const events = getEvents();
    events.push(event);
    saveEvents(events);

    drawMarker(event, p);

    const { rowData, specialData } = buildStatRowData(p, statKey, svgCoords);
    createShotFromData(event.id, rowData, specialData);

    setSelectedPlayer(null);
    setSelectedStat(null);
    renderRoster();
}

// Rebuild roster state for a stat row reconstructed from CSV.
// The eventId must equal the table row id so table-row deletion cleans up the stat.
function applyImportedStat(eventId, playerNumber, statKey, svgCoords) {
    const players = getPlayers();
    const player  = players.find(p => String(p.number) === String(playerNumber));

    if (player) {
        if (!player.stats) {
            player.stats = { turnovers: 0, hits: 0, faceoffWins: 0, faceoffLosses: 0 };
        }
        player.stats[statKey] = (player.stats[statKey] || 0) + 1;
        savePlayers(players);

        const ev = { id: eventId, playerId: player.id, stat: statKey, coords: svgCoords };
        const events = getEvents();
        events.push(ev);
        saveEvents(events);

        drawMarker(ev, player);
    } else {
        // Unknown jersey — draw the ice marker with a stub so the event isn't lost visually.
        drawMarker({ id: eventId, stat: statKey, coords: svgCoords }, { number: String(playerNumber) });
    }
}

// Zero every player's stat counts and clear events + ice markers.
// Called before a CSV import so counts don't accumulate.
function resetRosterForImport() {
    const players = getPlayers().map(p => ({
        ...p,
        stats: { turnovers: 0, hits: 0, faceoffWins: 0, faceoffLosses: 0 },
    }));
    savePlayers(players);
    saveEvents([]);
    d3.select("#player-events").selectAll("*").remove();
}

function downloadTemplate() {
    const csv = "number,name\n11,Example Player\n22,Another Player\n";
    download(csv, "roster-template.csv", "text/csv");
}

function uploadRosterCSV(file) {
    Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
            const existing = getPlayers();
            let added = 0;
            results.data.forEach(row => {
                const number = String(row.number ?? row["#"] ?? "").trim();
                const name   = String(row.name   ?? row.Name ?? "").trim();
                if (!name) return;
                const isDupe = existing.some(p => p.number === number && p.name === name);
                if (!isDupe) {
                    existing.push({ id: uuidv4(), number, name,
                        stats: { turnovers: 0, hits: 0, faceoffWins: 0, faceoffLosses: 0 } });
                    added++;
                }
            });
            savePlayers(existing);
            renderRoster();
            if (added === 0)
                alert("No new players found in CSV (duplicates skipped).");
        },
        error: () => alert("Could not parse CSV — check the file format."),
    });
}

function selectPlayer(player) {
    const cur = getSelectedPlayer();
    setSelectedPlayer(cur && cur.id === player.id ? null : player);
    renderRoster();
}

function addPlayer() {
    const number = d3.select("#new-player-number").property("value").trim();
    const name   = d3.select("#new-player-name").property("value").trim();
    if (!name) return;
    const players = getPlayers();
    players.push({ id: uuidv4(), number, name,
        stats: { turnovers: 0, hits: 0, faceoffWins: 0, faceoffLosses: 0 } });
    savePlayers(players);
    d3.select("#new-player-number").property("value", "");
    d3.select("#new-player-name").property("value", "");
    renderRoster();
}

function removePlayer(id) {
    const cur = getSelectedPlayer();
    if (cur && cur.id === id) setSelectedPlayer(null);

    getEvents().filter(e => e.playerId === id)
        .forEach(e => d3.select(`#pe-${e.id}`).remove());

    savePlayers(getPlayers().filter(p => p.id !== id));
    saveEvents(getEvents().filter(e => e.playerId !== id));
    renderRoster();
}

function renderRoster() {
    const players      = getPlayers();
    const selPlayer    = getSelectedPlayer();
    const selStatKey   = getSelectedStat();
    const selStat      = selStatKey ? STATS.find(s => s.key === selStatKey) : null;
    const panel        = d3.select("#roster-panel");
    panel.selectAll("*").remove();

    // Title
    panel.append("h3").attr("class", "center roster-title").text("Player Stats");

    // Mode indicator
    let modeText;
    if (selPlayer && selStat)
        modeText = `▶  #${selPlayer.number} ${selPlayer.name} — ${selStat.label} — click the ice to record`;
    else if (selPlayer)
        modeText = `#${selPlayer.number} ${selPlayer.name} selected — click a stat column header`;
    else if (selStat)
        modeText = `${selStat.label} selected — click a player row`;
    else
        modeText = "Click a player row, then a stat column header, then click the ice";

    panel.append("div")
        .attr("class", "roster-mode" + (selPlayer && selStat ? " roster-mode-ready" : ""))
        .text(modeText);

    if (players.length === 0) return;

    // Table
    const table = panel.append("table").attr("class", "table roster-table");
    const hRow  = table.append("thead").append("tr");

    hRow.append("th").attr("class", "roster-col-num").text("#");
    hRow.append("th").attr("class", "roster-col-name").text("Name");

    STATS.forEach(stat => {
        const isActive = selStatKey === stat.key;
        hRow.append("th")
            .attr("class", "roster-stat-hdr" + (isActive ? " roster-stat-active" : ""))
            .style("background-color", isActive ? stat.color : null)
            .style("color", isActive ? "white" : null)
            .style("cursor", "pointer")
            .text(stat.label)
            .on("click", () => { setSelectedStat(isActive ? null : stat.key); renderRoster(); });
    });

    hRow.append("th").attr("class", "roster-col-num").text("FO%");
    hRow.append("th").attr("class", "roster-col-del");

    const tbody = table.append("tbody");
    players.forEach(player => {
        const foTotal   = player.stats.faceoffWins + player.stats.faceoffLosses;
        const foPercent = foTotal > 0
            ? Math.round((player.stats.faceoffWins / foTotal) * 100) + "%"
            : "—";
        const isActive  = selPlayer && selPlayer.id === player.id;

        const row = tbody.append("tr")
            .attr("class", "roster-row" + (isActive ? " roster-player-active" : ""))
            .style("cursor", "pointer");

        row.append("td").text(player.number)
            .on("click", () => selectPlayer(player));
        row.append("td").attr("class", "roster-col-name").text(player.name)
            .on("click", () => selectPlayer(player));

        STATS.forEach(stat => {
            const count = player.stats[stat.key];
            const cell  = row.append("td").attr("class", "roster-col-stat");
            cell.append("span").text(count);
            if (count > 0) {
                cell.append("button")
                    .attr("class", "grey-btn roster-minus-btn")
                    .text("−")
                    .on("click", e => {
                        e.stopPropagation();
                        decrementStat(player, stat.key);
                    });
            }
        });

        row.append("td").attr("class", "roster-col-num").text(foPercent);
        row.append("td").attr("class", "roster-col-del")
            .append("button").attr("class", "grey-btn roster-del-btn").text("×")
            .on("click", e => { e.stopPropagation(); removePlayer(player.id); });
    });

    // Add-player form
    const form = panel.append("div").attr("class", "add-player-form");
    form.append("input").attr("type", "text").attr("id", "new-player-number")
        .attr("placeholder", "#").attr("class", "roster-input roster-input-num");
    form.append("input").attr("type", "text").attr("id", "new-player-name")
        .attr("placeholder", "Player name").attr("class", "roster-input roster-input-name");
    form.append("button").attr("class", "grey-btn").text("Add Player").on("click", addPlayer);

    // CSV upload / template download
    const csvRow = panel.append("div").attr("class", "roster-csv-row");
    csvRow.append("button").attr("class", "grey-btn roster-csv-btn")
        .text("⬇ Download CSV Template")
        .on("click", downloadTemplate);

    const uploadLabel = csvRow.append("label").attr("class", "grey-btn roster-csv-btn roster-upload-label");
    uploadLabel.append("span").text("⬆ Upload Roster CSV");
    uploadLabel.append("input")
        .attr("type", "file").attr("accept", ".csv").attr("hidden", true)
        .on("change", function() {
            if (this.files[0]) uploadRosterCSV(this.files[0]);
            this.value = "";
        });
}

function renderRosterLegend() {
    const svg = d3.select("#roster-stat-legend");
    if (svg.empty()) return;
    svg.selectAll("*").remove();

    const r       = cfgAppearance.legendR;
    const spacing = 2 * r;
    let xOffset   = 2 * r;
    const yOffset = 2 * r;

    STATS.forEach(stat => {
        if (stat.sides) {
            svg.append("polygon")
                .attr("points", polygon(xOffset, 0.625 * yOffset, r, stat.sides))
                .attr("fill", stat.color)
                .attr("fill-opacity", 0.9);
        } else {
            svg.append("circle")
                .attr("cx", xOffset).attr("cy", 0.625 * yOffset).attr("r", r)
                .attr("fill", stat.color)
                .attr("fill-opacity", 0.9);
        }
        xOffset += spacing;
        xOffset += svg.append("text")
            .attr("x", xOffset).attr("y", yOffset)
            .text(stat.label)
            .node().getComputedTextLength() + 2 * spacing;
    });
    xOffset -= 2 * spacing;
    svg.attr("width", xOffset).attr("height", 2 * yOffset);
}

export { applyImportedStat, resetRosterForImport, renderRoster };

export function setUpRoster() {
    d3.select("#transformations").insert("g", "#dots").attr("id", "player-events");
    setRecordCallback(recordStat);
    setDeleteStatCallback(cleanupStatEvent);

    // Roster stat legend row
    d3.select("#legend").append("div").attr("class", "center")
        .append("svg").attr("id", "roster-stat-legend");
    renderRosterLegend();

    // Seed default roster on first load
    if (getPlayers().length === 0) {
        savePlayers(DEFAULT_PLAYERS.map(p => ({
            id: uuidv4(), number: p.number, name: p.name,
            stats: { turnovers: 0, hits: 0, faceoffWins: 0, faceoffLosses: 0 },
        })));
    }

    const players = getPlayers();
    getEvents().forEach(ev => {
        const p = players.find(pl => pl.id === ev.playerId);
        if (p) drawMarker(ev, p);
    });

    renderRoster();
}
