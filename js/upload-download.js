import { getOptionsObject } from "./options.js";
import { clearTable } from "./table.js";
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
}

function downloadCSV() {
    var csv = "Period,Team,Player,Type,X,Y\n";
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
    // https://stackoverflow.com/a/55929686
    var f = e.target.files[0];
    if (f) {
        var r = new FileReader();
        r.onload = function(evt) {
            var contents = evt.target.result;
            processCSV(contents);
        };
        r.readAsText(f);
    }
}

function processCSV(text) {
    var lines = text.split("\n");
    var options = getOptionsObject();
    // literally the barest sprinkle of input validation

    // swap blue team name first
    var swapTeamId = "#blue-team-name";
    if (lines[0] == "Period,Team,Player,Type,X,Y") {
        clearTable();
        for (let i = 1; i < lines.length; i++) {
            var [period, team, player, type, x, y] = lines[i].split(",");
            if (!(type in options)) {
                d3.select("#shot-type")
                    .append("option")
                    .text(type);
                options = getOptionsObject();
                shotTypeLegend();
            }
            var teamId;

            if (team === d3.select("#blue-team-name").property("value")) {
                teamId = "#blue-team-name";
            } else if (
                team === d3.select("#orange-team-name").property("value")
            ) {
                teamId = "#orange-team-name";
            } else {
                d3.select(swapTeamId).property("value", team);
                teamLegend();

                teamId = swapTeamId;
                // alternate changing team names
                swapTeamId =
                    swapTeamId === "#blue-team-name"
                        ? "#orange-team-name"
                        : "#blue-team-name";
            }

            createShotFromData(period, teamId, player, type, [
                parseFloat(x) + 100,
                -1 * parseFloat(y) + 42.5,
            ]); // undo coordinate adjustment
        }
    }
}

export { setUpDownloadUpload };
