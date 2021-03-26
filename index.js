import { setUpRink } from "./js/rink.js";
import { setUpOptions } from "./js/options.js";
import { setUpShots } from "./js/shots.js";
import { setUpTable } from "./js/table.js";
function index() {
    d3.xml("resources/hockey-rink.svg").then(data => {
        setUpRink(data);
        setUpOptions();
        setUpTable();
        setUpShots();
    });
}

export { index };
