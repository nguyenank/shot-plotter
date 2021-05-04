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
    var period = d3.select("input[name='period']").empty()
        ? ""
        : d3.select("input[name='period']:checked").property("value");
    var teamId = d3.select("input[name='team-bool']").empty()
        ? null
        : d3.select("input[name='team-bool']:checked").property("value");
    var player = d3.select("#player-input").empty()
        ? ""
        : d3
              .select("#player-input")
              .select("input")
              .property("value");
    var type = d3.select("#shot-type-select").empty()
        ? null
        : d3.select("#shot-type-select").property("value");
    var data = {
        id: uuidv4(),
        period: period,
        teamId: teamId,
        player: player,
        type: type,
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
