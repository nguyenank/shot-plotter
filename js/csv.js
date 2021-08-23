import {
    getDetails,
    existsDetail,
    getCurrentShotTypes,
} from "./details/details-functions.js";
import { clearTable, getHeaderRow, getRows } from "./table/table-functions.js";
import { createShotFromData } from "./shots/shot.js";
import { shotTypeLegend, teamLegend } from "./shots/legend.js";
import { downloadArea, uploadArea } from "./components/upload-download.js";

function setUpCSVDownloadUpload() {
    // Custom Filename
    var d = new Date(Date.now());
    var defaultFileName = `${(
        d.getMonth() + 1
    ).toString()}.${d.getDate()}.${d.getFullYear()}-${d
        .getHours()
        .toString()
        .padStart(2, "0")}.${d
        .getMinutes()
        .toString()
        .padStart(2, "0")}`;
    downloadArea(
        "#csv-upload-download",
        defaultFileName,
        () => downloadCSV("#csv-upload-download"),
        ".csv"
    );
    uploadArea(
        "#csv-upload-download",
        "csv-upload",
        e => uploadCSV("#csv-upload-download", "#csv-upload", e),
        "Only .csv files are allowed. The column headers in the .csv file must be identical to the column headers in the table, excluding #. Order matters."
    );
}

function downloadCSV(id) {
    // set up header row
    var csv = "";
    var header = [];
    d3.select("#shot-table")
        .select("thead")
        .selectAll("th")
        .each(function() {
            header.push(d3.select(this).attr("data-id"));
            let text = d3.select(this).text();
            if (text !== "" && text !== "#") {
                csv += text + ",";
            }
        });
    csv = csv.slice(0, -1) + "\n";
    var rows = getRows();
    for (let row of rows) {
        for (let col of _.compact(header)) {
            if (col !== "shot-number") {
                csv += escape(row.rowData[col].toString()) + ",";
            }
        }
        // remove trailing comma
        csv = csv.slice(0, -1) + "\n";
    }

    csv = csv.slice(0, -1); // remove trailing new line
    var fileName = d3
        .select(id)
        .select(".download-name")
        .property("value");
    if (!fileName) {
        fileName = d3
            .select(id)
            .select(".download-name")
            .attr("placeholder");
    }
    download(csv, fileName + ".csv", "text/csv");
}

function escape(text) {
    return text.includes(",") ? '"' + text + '"' : text;
}

function uploadCSV(id, uploadId, e) {
    if (/.csv$/i.exec(d3.select(uploadId).property("value"))) {
        var f = e.target.files[0];
        if (f) {
            // change text and wipe value to allow for same file upload
            // while preserving name
            d3.select(id)
                .select(".upload-name-text")
                .text(f.name);
            d3.select(id)
                .select(".upload")
                .property("value", "");

            // remove invalid class if necessary
            d3.select(uploadId).attr("class", "form-control");
            var swapTeamId = "#blue-team-name";
            clearTable();
            Papa.parse(f, {
                header: true,
                step: function(row) {
                    swapTeamId = processCSV(uploadId, row.data, swapTeamId);
                },
            });
        }
    } else {
        d3.select(uploadId).attr("class", "form-control is-invalid");
    }
}

function processCSV(uploadId, row, swapTeamId) {
    // only process if current table header (minus shot) is Identical to the current header
    var tableHeader = [];
    d3.select("#shot-table")
        .select("thead")
        .selectAll("th")
        .each(function() {
            let text = d3.select(this).text();
            if (text.length > 0 && text !== "#") {
                tableHeader.push(text);
            }
        });
    var csvHeader = Object.keys(row);
    if (!_.isEqual(tableHeader, csvHeader)) {
        d3.select(uploadId).attr("class", "form-control is-invalid");
        return swapTeamId;
    }

    // add any new shot type options
    if (existsDetail("#shot-type")) {
        var typeOptions = getCurrentShotTypes().map(x => x.value);
        if (typeOptions.indexOf(row.Type) === -1) {
            d3.select("#shot-type-select")
                .append("option")
                .text(row.Type);
            shotTypeLegend();
        }
    }

    var newSwapTeam = swapTeamId;

    if (existsDetail("#team")) {
        var teamId;

        // add any new team name
        if (!row.Team) {
            teamId = "#blue-team-name";
        } else if (
            row.Team === d3.select("#blue-team-name").property("value")
        ) {
            teamId = "#blue-team-name";
        } else if (
            row.Team === d3.select("#orange-team-name").property("value")
        ) {
            teamId = "#orange-team-name";
        } else {
            d3.select(swapTeamId).property("value", row.Team);
            teamLegend();

            teamId = swapTeamId;
            // alternate changing team names
            newSwapTeam =
                swapTeamId === "#blue-team-name"
                    ? "#orange-team-name"
                    : "#blue-team-name";
        }
    }

    // add additional attributes to row
    let id = uuidv4();

    let specialData = {
        type: row.Type,
        teamId: teamId,
        coords: [parseFloat(row.X) + 100, -1 * parseFloat(row.Y) + 42.5], // undo coordinate adjustment
        player: row.Player,
        numberCol: _.findIndex(getHeaderRow(), { type: "shot-number" }) - 1,
    };
    let rowData = Object.values(row);

    if (specialData.numberCol !== -2) {
        // add #
        rowData.splice(
            specialData.numberCol,
            0,
            d3
                .select("#shot-table-body")
                .selectAll("tr")
                .size() + 1
        );
    }
    createShotFromData(id, rowData, specialData);
    return newSwapTeam;
}

export { setUpCSVDownloadUpload };
