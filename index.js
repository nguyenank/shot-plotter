import { setUp } from "./js/setUp.js";
import { setUpOptions } from "./js/options.js";
import { setUpShots } from "./js/shot.js";
function index() {
    d3.xml("resources/hockey-rink.svg").then(data => {
        setUp(data);
        setUpShots();
        setUpOptions();
    });
}

export { index };
