import { setUpRink } from "./js/rink.js";
import { setUpOptions } from "./js/options.js";
import { setUpShots } from "./js/shots.js";
import { setUpTable } from "./js/table.js";
import { downloadCSV, uploadCSV } from "./js/upload-download.js";
function index() {
    d3.xml("resources/hockey-rink.svg").then(data => {
        setUpRink(data);
        setUpOptions();
        setUpTable();
        setUpShots();

        var d = new Date(Date.now());
        var defaultFileName =
            (d.getMonth() + 1).toString() +
            "." +
            d.getDate() +
            "." +
            d.getFullYear() +
            "-" +
            d.getHours() +
            "." +
            d.getMinutes();
        d3.select("#download-name").attr("placeholder", defaultFileName);
        d3.select("#download").on("click", downloadCSV);
        d3.select("#upload").on("change", e => uploadCSV(e));
    });
}

export { index };
