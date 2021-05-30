import { createDot } from "./dot.js";
import { createRow } from "./row.js";
import { getHeaderRow } from "../table.js";

function setUpShots() {
    d3.select("#hockey-rink")
        .select("#outside-perimeter")
        .on("click", e => {
            createShotFromEvent(e);
        });
}

function createShotFromEvent(e) {
    // https://stackoverflow.com/a/29325047

    // TODO: switch these to be items, with col.id and the text value ???
    var columns = getHeaderRow();
    console.log(columns);
    let rowData = [];

    for (let col of columns) {
        switch (col.type) {
            case "radio":
                rowData.push(
                    d3
                        .select(`input[name="${col.id}"]:checked`)
                        .property("value")
                );
                break;
            case "text-field":
            case "player":
                rowData.push(
                    d3
                        .select("#" + col.id)
                        .select("input")
                        .property("value")
                );
                break;
            case "dropdown":
            case "shot-type":
                rowData.push(
                    d3
                        .select("#" + col.id)
                        .select("select")
                        .property("value")
                );
                break;
            case "team":
                rowData.push(
                    d3
                        .select("input[name='team-bool']:checked")
                        .property("value")
                );
                break;
            case "shot-number":
                rowData.push(
                    d3
                        .select("#shot-table-body")
                        .selectAll("tr")
                        .size() + 1
                );
                break;
            case "x":
                rowData.push((d3.pointer(e)[0] - 100).toFixed(2));
                break;
            case "y":
                rowData.push((-1 * (d3.pointer(e)[1] - 42.5)).toFixed(2));
                break;
            default:
                continue;
        }
    }
    console.log(rowData);
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

    var id = uuidv4();
    var dotData = {
        id: id,
        period: period,
        teamId: teamId,
        player: player,
        type: type,
        coords: d3.pointer(e),
    };

    createDot("#normal", dotData);
    createRow(id, rowData);
}

function createShotFromData(data) {
    createDot("#normal", data);
    createRow(data);
}

export { setUpShots, createShotFromData };
