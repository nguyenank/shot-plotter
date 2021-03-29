import { getOptions } from "../options.js";
import { createDot } from "./dot.js";
import { createRow } from "./row.js";
import { cfg } from "./config.js";

function setUpShots() {
    d3.select("#hockey-rink")
        .select("#outside-perimeter")
        .on("click", e => {
            createShotFromEvent(e);
        });
}

function createShotFromEvent(e) {
    // https://stackoverflow.com/a/29325047
    var teamId = d3.select("input[name='home-away']:checked").property("value");
    var homeBool = teamId === "#home-team";
    var id = uuidv4();
    var period = d3.select("input[name='period']:checked").property("value");

    // get player field
    var player = d3
        .select("#options")
        .select("#player-input")
        .property("value");

    // get shot type field
    var type = d3.select("#shot-type").property("value");

    createDot(teamId, homeBool, type, d3.pointer(e), id);
    createRow(period, homeBool, player, type, d3.pointer(e), id);
}

function createShotFromData(period, team, player, type, coords) {
    var teamId = team === "Home" ? "#home-team" : "#away-team";
    var homeBool = teamId === "#home-team";
    var id = uuidv4();
    createDot(teamId, homeBool, type, coords, id);
    createRow(period, homeBool, player, type, coords, id);
}

export { setUpShots, createShotFromData };
