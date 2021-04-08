import { createDot } from "./dot.js";
import { createRow } from "./row.js";

function setUpShots() {
    d3.select("#hockey-rink")
        .select("#outside-perimeter")
        .on("click", e => {
            createShotFromEvent(e);
        });
}

function createShotFromEvent(e) {
    // https://stackoverflow.com/a/29325047

    var data = {
        id: uuidv4(),
        period: d3.select("input[name='period']:checked").property("value"),
        teamId: d3.select("input[name='team-bool']:checked").property("value"),
        player: d3
            .select("#options")
            .select("#player-input")
            .property("value"),
        type: d3.select("#shot-type").property("value"),
        coords: d3.pointer(e),
    };

    createDot("#normal", data);
    createRow(data);
}

function createShotFromData(data) {
    createDot("#normal", data);
    createRow(data);
}

export { setUpShots, createShotFromData };
