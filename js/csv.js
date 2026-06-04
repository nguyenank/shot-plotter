import {
    getDetails,
    getDetailTitle,
    existsDetail,
    getCurrentShotTypes,
    getTypeIndex,
    saveCurrentSetup,
} from "./details/details-functions.js";
import {
    createFilterRow,
    select2Filter,
    existFilters,
} from "./table/filter.js";
import {
    clearTable,
    getHeaderRow,
    getFilteredRows,
    getRows,
} from "./table/table-functions.js";
import { updateTableFooter } from "./table/table.js";
import { createShotFromData } from "./shots/shot.js";
import { shotTypeLegend, teamLegend } from "./shots/legend.js";
import { downloadArea, uploadArea } from "./components/upload-download.js";
import { cfgSportA } from "../setup.js";
import {
    applyImportedStat,
    resetRosterForImport,
    renderRoster,
} from "./roster/roster.js";

// Canonical CSV schema — independent of the visible table headers so we can
// round-trip roster stat rows (which need the player number) without adding
// columns to the in-app table.
const CSV_HEADER = ["Period", "Team", "Type", "Player", "X", "Y"];
const STAT_LABEL_BY_KEY = {
    turnovers:     "Turnovers",
    hits:          "Hits",
    faceoffWins:   "FO Win",
    faceoffLosses: "FO Loss",
};
const STAT_KEY_BY_LABEL = _.invert(STAT_LABEL_BY_KEY);

function setUpCSVDownloadUpload() {
    // Custom Filename
    const d = new Date(Date.now());
    const defaultFileName = `${(
        d.getMonth() + 1
    ).toString()}.${d.getDate()}.${d.getFullYear()}-${d
        .getHours()
        .toString()
        .padStart(2, "0")}.${d.getMinutes().toString().padStart(2, "0")}`;
    downloadArea(
        "#csv-upload-download",
        defaultFileName,
        () => downloadCSV("#csv-upload-download"),
        ".csv"
    );
    uploadArea(
        "#csv-upload-download",
        "csv-upload",
        (e) => uploadCSV("#csv-upload-download", "#csv-upload", e),
        "Only .csv files are allowed. Columns must be: Period, Team, Type, Player, X, Y (in that order). Player is blank for shots, and holds the jersey number for roster stat events."
    );
}

export function toggleDownloadText() {
    const node = d3
        .select("#csv-upload-download")
        .select("button")
        .text(existFilters() ? "Download Filtered" : "Download");
}

function downloadCSV(id) {
    let csv = CSV_HEADER.join(",") + "\n";

    const rows = getFilteredRows();
    for (const row of rows) {
        const rd = row.rowData || {};
        const sd = row.specialData || {};

        const period = rd["period"] ?? "";
        const team   = rd["team"]   ?? "";
        const x      = rd["x"]      ?? "";
        const y      = rd["y"]      ?? "";

        // Stat rows: split "#NN — Label" into Player + Type; shots keep Type as-is.
        let type   = rd["shot-type"] ?? "";
        let player = "";
        if (sd.isStatRow) {
            const m = String(type).match(/^#(\S+)\s*[—–-]\s*(.+)$/);
            if (m) {
                player = m[1];
                type   = m[2];
            } else {
                player = sd.player ?? "";
            }
        }

        csv += [period, team, type, player, x, y]
            .map(v => escape(String(v)))
            .join(",") + "\n";
    }

    csv = csv.slice(0, -1); // remove trailing newline
    let fileName = d3.select(id).select(".download-name").property("value");
    if (!fileName) {
        fileName = d3.select(id).select(".download-name").attr("placeholder");
    }
    download(csv, fileName + ".csv", "text/csv");
}

function escape(text) {
    return text.includes(",") ? '"' + text + '"' : text;
}

async function uploadCSV(id, uploadId, e) {
    if (/.csv$/i.exec(d3.select(uploadId).property("value"))) {
        const f = e.target.files[0];
        if (f) {
            // change text and wipe value to allow for same file upload
            // while preserving name
            d3.select(id).select(".upload-name-text").text(f.name);
            d3.select(id).select(".upload").property("value", "");

            // remove invalid class if necessary
            d3.select(uploadId).classed("is-invalid", false);
            let swapTeamColor = "blueTeam";
            clearTable();
            resetRosterForImport();
            Papa.parse(f, {
                header: true,
                skipEmptyLines: true,
                step: function (row) {
                    swapTeamColor = processCSV(
                        uploadId,
                        row.data,
                        swapTeamColor
                    );
                },
                complete: function () {
                    updateTableFooter();
                    renderRoster();
                },
            });
        }
    } else {
        d3.select(uploadId).classed("is-invalid", true);
    }
}

function processCSV(uploadId, row, swapTeamColor) {
    // Validate against the fixed canonical CSV schema.
    const csvHeader = Object.keys(row);
    if (!_.isEqual(csvHeader, CSV_HEADER)) {
        d3.select(uploadId).classed("is-invalid", true);
        return swapTeamColor;
    }

    const period       = row.Period;
    const teamName     = row.Team;
    const typeLabel    = row.Type;
    const playerNumber = String(row.Player ?? "").trim();
    const xGame        = parseFloat(row.X);
    const yGame        = parseFloat(row.Y);

    const isStatRow =
        playerNumber !== "" && Object.prototype.hasOwnProperty.call(STAT_KEY_BY_LABEL, typeLabel);

    // Resolve team color. Stat rows are always the home (blue) team.
    let newSwapTeam = swapTeamColor;
    let teamColor;
    if (isStatRow) {
        teamColor = "blueTeam";
    } else if (existsDetail("team")) {
        if (!teamName) {
            teamColor = "blueTeam";
        } else if (teamName === d3.select("#blue-team-name").property("value")) {
            teamColor = "blueTeam";
        } else if (teamName === d3.select("#orange-team-name").property("value")) {
            teamColor = "orangeTeam";
        } else {
            const swapTeamId =
                swapTeamColor === "blueTeam" ? "#blue-team-name" : "#orange-team-name";
            d3.select(swapTeamId).property("value", teamName);
            teamLegend();
            saveCurrentSetup();
            createFilterRow(getDetails());
            select2Filter();

            teamColor   = swapTeamColor;
            newSwapTeam = swapTeamColor === "blueTeam" ? "orangeTeam" : "blueTeam";
        }
    } else {
        teamColor = "blueTeam";
    }

    // Reconstruct the display value shown in the shot-type cell.
    // Stat rows display "#NN — Label"; shots display Type as-is.
    const displayType = isStatRow
        ? `#${playerNumber} — ${typeLabel}`
        : typeLabel;

    // Register any unseen shot types (non-stat only — stat labels aren't dropdown options).
    if (!isStatRow && existsDetail("shot-type") && displayType) {
        const typeOptions = getCurrentShotTypes().map((x) => x.value);
        if (typeOptions.indexOf(displayType) === -1) {
            d3.select("#shot-type-select").append("option").text(displayType);
            shotTypeLegend();
            saveCurrentSetup();
            createFilterRow(getDetails());
            select2Filter();
        }
    }

    const id = uuidv4();

    const svgCoords = [
        xGame + cfgSportA.width / 2,
        -1 * yGame + cfgSportA.height / 2,
    ];

    const specialData = {
        typeIndex: isStatRow ? 0 : getTypeIndex(displayType),
        teamColor: teamColor,
        coords: svgCoords,
        player: isStatRow ? playerNumber : "",
        numberCol: _.findIndex(getHeaderRow(), { type: "shot-number" }) - 1,
    };
    if (isStatRow) specialData.isStatRow = true;

    // Build rowData keyed by the live table's header ids so the row renders
    // correctly regardless of column customisation.
    const headerIds = _.without(
        _.compact(getHeaderRow().map((x) => x.id)),
        "shot-number"
    );
    const rowData =
        specialData.numberCol !== -2
            ? { "shot-number": getRows().length + 1 }
            : {};
    for (const hid of headerIds) {
        switch (hid) {
            case "period":    rowData[hid] = period;        break;
            case "team":      rowData[hid] = teamName;      break;
            case "shot-type": rowData[hid] = displayType;   break;
            case "x":         rowData[hid] = isFinite(xGame) ? xGame.toFixed(2) : ""; break;
            case "y":         rowData[hid] = isFinite(yGame) ? yGame.toFixed(2) : ""; break;
            default:          rowData[hid] = "";            break;
        }
    }

    // Rebuild roster state before creating the row so the ice marker and
    // player stat count are restored. Event id == row id, matching the live flow.
    if (isStatRow) {
        applyImportedStat(id, playerNumber, STAT_KEY_BY_LABEL[typeLabel], svgCoords);
    }

    createShotFromData(id, rowData, specialData);
    return newSwapTeam;
}

export { setUpCSVDownloadUpload };
