import {
    getDetails,
    existsDetail,
    getCurrentShotTypes,
} from "./details/details-functions.js";
import {
    clearTable,
    getHeaderRow,
    getRows,
    getNumRows,
} from "./table/table-functions.js";
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
            d3.select(uploadId).classed("is-invalid", false);
            var swapTeamColor = "blueTeam";
            clearTable();
            Papa.parse(f, {
                header: true,
                step: function(row) {
                    swapTeamColor = processCSV(
                        uploadId,
                        row.data,
                        swapTeamColor
                    );
                },
            });
        }
    } else {
        d3.select(uploadId).classed("is-invalid", true);
    }
}

function processCSV(uploadId, row, swapTeamColor) {
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
        d3.select(uploadId).classed("is-invalid", true);
        return swapTeamColor;
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

    var newSwapTeam = swapTeamColor;

    if (existsDetail("#team")) {
        var teamColor;

        // add any new team name
        if (!row.Team) {
            teamColor = "blueTeam";
        } else if (
            row.Team === d3.select("#blue-team-name").property("value")
        ) {
            teamColor = "blueTeam";
        } else if (
            row.Team === d3.select("#orange-team-name").property("value")
        ) {
            teamColor = "orangeTeam";
        } else {
            d3.select(swapTeamColor).property("value", row.Team);
            teamLegend();

            teamColor = swapTeamColor;
            // alternate changing team names
            newSwapTeam =
                swapTeamColor === "blueTeam" ? "orangeTeam" : "blueTeam";
        }
    }

    // add additional attributes to row
    let id = uuidv4();

    let specialData = {
        typeIndex: row.Type
            ? _.findIndex(getCurrentShotTypes(), { value: row.Type })
            : 0,
        teamColor: teamColor,
        coords: [parseFloat(row.X) + 100, -1 * parseFloat(row.Y) + 42.5], // undo coordinate adjustment
        player: row.Player,
        numberCol: _.findIndex(getHeaderRow(), { type: "shot-number" }) - 1,
    };

    let headerIds = _.without(
        _.compact(getHeaderRow().map(x => x.id)),
        "shot-number"
    );
    let rowData =
        specialData.numberCol !== -2 ? { "shot-number": getNumRows() + 1 } : {};
    _.forEach(_.zip(headerIds, Object.values(row)), function([header, value]) {
        rowData[header] = value;
    });

    createShotFromData(id, rowData, specialData);
    return newSwapTeam;
}

export { setUpCSVDownloadUpload };
