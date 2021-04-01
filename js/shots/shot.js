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
    var teamId = d3.select("input[name='team-bool']:checked").property("value");
    var id = uuidv4();
    var period = d3.select("input[name='period']:checked").property("value");

    // get player field
    var player = d3
        .select("#options")
        .select("#player-input")
        .property("value");

    // get shot type field
    var type = d3.select("#shot-type").property("value");

    // this order to get right shot number on dot
    createRow(period, teamId, player, type, d3.pointer(e), id);
    createDot("#normal", teamId, player, type, d3.pointer(e), id);
}

function createShotFromData(period, teamId, player, type, coords) {
    var id = uuidv4();

    // this order to get right shot number on dot
    createDot("#normal", teamId, player, type, coords, id);
    createRow(period, teamId, player, type, coords, id);
}

export { setUpShots, createShotFromData };
