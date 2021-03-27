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

        d3.select("#download").on("click", downloadCSV);
        d3.select("#upload").on("change", e => uploadCSV(e));
    });
}

export { index };
