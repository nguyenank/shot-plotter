import { clearTable } from "./table.js";
import { createShotFromData } from "./shots.js";

function downloadCSV() {
    var csv = "Team,Player,X,Y\n";
    d3.select("#shot-table-body")
        .selectAll("tr")
        .each(function() {
            d3.select(this)
                .selectAll("td")
                .each(function(d, i) {
                    csv += d3.select(this).text() + ",";
                });
            // remove trailing commas from trash can
            csv = csv.slice(0, -2) + "\n";
        });
    csv = csv.slice(0, -1); // remove trailing new line
    download(csv, new Date(Date.now()).toDateString(), "text/csv");
}

function uploadCSV(e) {
    // https://stackoverflow.com/a/55929686
    var f = e.target.files[0];
    if (f) {
        var r = new FileReader();
        r.onload = function(evt) {
            var contents = evt.target.result;
            console.log(contents);
            processCSV(contents);
        };
        r.readAsText(f);
    }
}

function processCSV(text) {
    var lines = text.split("\n");
    // literally the barest sprinkle of input validation
    if (lines[0] == "Team,Player,X,Y") {
        clearTable();
        for (let i = 1; i < lines.length; i++) {
            var [team, player, x, y] = lines[i].split(",");
            createShotFromData(team, player, [
                parseFloat(x) + 100,
                parseFloat(y) + 42.5,
            ]);
        }
    }
}

export { downloadCSV, uploadCSV };
