import { setUp } from "./js/setUp.js";
import { setUpShots } from "./js/shot.js";
function index() {
    d3.xml("resources/hockey-rink.svg").then(data => {
        setUp(data);
        setUpShots();
    });
}

export { index };
