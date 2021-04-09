import { getOptionsObject } from "./options/options.js";
import { clearTable, printHeaderRow } from "./table.js";
import { createShotFromData } from "./shots/shot.js";
import { shotTypeLegend, teamLegend } from "./shots/legend.js";

function setUpDownloadUpload() {
    setUpDownload();
    setUpUpload();
}

function setUpDownload() {
    var wrapper = d3
        .select(".upload-download")
        .append("div")
        .attr("class", "input-group");

    // Download Button
    wrapper
        .append("button")
        .attr("class", "input-group-text download-btn")
        .attr("type", "button")
        .attr("id", "download")
        .text("Download")
        .on("click", downloadCSV);

    // Custom Filename
    var d = new Date(Date.now());
    var defaultFileName = `${(
        d.getMonth() + 1
    ).toString()}.${d.getDate()}.${d.getFullYear()}-${d.getHours()}.${d.getMinutes()}`;

    wrapper
        .append("input")
        .attr("type", "text")
        .attr("class", "form-control")
        .attr("placeholder", defaultFileName)
        .attr("aria-label", "download file name")
        .attr("aria-described-by", "download file name")
        .attr("id", "download-name");

    // .csv tack-on
    wrapper
        .append("span")
        .attr("class", "input-group-text white-bg")
        .text(".csv");
}

function setUpUpload() {
    var wrapper = d3
        .select(".upload-download")
        .append("div")
        .attr("class", "input-group");

    wrapper
        .append("label")
        .attr("class", "input-group-text")
        .attr("for", "upload")
        .text("Upload");

    wrapper
        .append("input")
        .attr("type", "file")
        .attr("class", "form-control")
        .attr("id", "upload")
        .on("change", e => uploadCSV(e));
    wrapper
        .append("div")
        .attr("class", "invalid-tooltip")
        .text("Only .csv files are allowed.");
}

function downloadCSV() {
    var csv = printHeaderRow() + "\n";
    d3.select("#shot-table-body")
        .selectAll("tr")
        .each(function() {
            d3.select(this)
                .selectAll("td")
                .each(function(d, i) {
                    csv += escape(d3.select(this).text()) + ",";
                });
            // remove trailing comma
            csv = csv.slice(0, -1) + "\n";
        });
    csv = csv.slice(0, -1); // remove trailing new line
    var fileName = d3.select("#download-name").property("value");
    if (!fileName) {
        fileName = d3.select("#download-name").attr("placeholder");
    }
    download(csv, fileName + ".csv", "text/csv");
}

function escape(text) {
    return text.includes(",") ? '"' + text + '"' : text;
}

function uploadCSV(e) {
    if (/.csv$/i.exec(d3.select("#upload").property("value"))) {
        var f = e.target.files[0];
        if (f) {
            // remove invalid class if necessary
            d3.select("#upload").attr("class", "form-control");
            var swapTeamId = "#blue-team-name";
            clearTable();
            Papa.parse(f, {
                header: true,
                worker: true,
                step: function(row) {
                    swapTeamId = processCSV(row.data, swapTeamId);
                },
            });
        }
    } else {
        d3.select("#upload").attr("class", "form-control is-invalid");
    }
}

function processCSV(row, swapTeamId) {
    // add any new shot type options
    var options = getOptionsObject();
    var newSwapTeam = swapTeamId;
    if (!(row.type in options)) {
        d3.select("#shot-type")
            .append("option")
            .text(row.type);
        options = getOptionsObject();
        shotTypeLegend();
    }
    var teamId;

    // add any new team name
    if (row.team === d3.select("#blue-team-name").property("value")) {
        teamId = "#blue-team-name";
    } else if (row.team === d3.select("#orange-team-name").property("value")) {
        teamId = "#orange-team-name";
    } else {
        d3.select(swapTeamId).property("value", row.team);
        teamLegend();

        teamId = swapTeamId;
        // alternate changing team names
        newSwapTeam =
            swapTeamId === "#blue-team-name"
                ? "#orange-team-name"
                : "#blue-team-name";
    }

    // add additional attributes to row
    row["id"] = uuidv4();
    row["teamId"] = teamId;
    // undo coordinate adjustment
    row["coords"] = [parseFloat(row.x) + 100, -1 * parseFloat(row.y) + 42.5];

    createShotFromData(row);
    return newSwapTeam;
}

export { setUpDownloadUpload };
