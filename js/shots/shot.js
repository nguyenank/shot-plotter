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
        coordinates: d3.pointer(e),
    };
    // this order to get right shot number on dot
    createRow(data);
    createDot(
        "#normal",
        data.teamId,
        data.player,
        data.type,
        d3.pointer(e),
        data.id
    );
}

function createShotFromData(period, teamId, player, type, coords) {
    var id = uuidv4();

    var data = {
        id: uuidv4(),
        period: period,
        teamId: teamId,
        player: player,
        type: type,
        coordinates: coords,
    };
    // this order to get right shot number on dot
    createDot("#normal", teamId, player, type, coords, data.id);
    createRow(data);
}

export { setUpShots, createShotFromData };
