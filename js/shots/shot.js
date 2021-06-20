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

    var columns = getHeaderRow();
    let rowData = [];
    var id = uuidv4();
    let specialData = {
        // data for custom specfics like color etc.
        id: id,
        coords: d3.pointer(e),
        numberCol: _.findIndex(columns, { type: "shot-number" }) - 1, // subtract out checkbox column
    };

    for (let col of columns) {
        switch (col.type) {
            case "radio":
                rowData.push(
                    d3
                        .select(`input[name="${col.id}"]:checked`)
                        .property("value")
                );
                break;
            case "player":
                specialData["player"] = d3
                    .select("#" + col.id)
                    .select("input")
                    .property("value");
            case "text-field":
                rowData.push(
                    d3
                        .select("#" + col.id)
                        .select("input")
                        .property("value")
                );
                break;
            case "shot-type":
                specialData["type"] = d3
                    .select("#" + col.id)
                    .select("select")
                    .property("value");
            case "dropdown":
                rowData.push(
                    d3
                        .select("#" + col.id)
                        .select("select")
                        .property("value")
                );
                break;
            case "time":
                rowData.push(
                    d3
                        .select("#" + col.id)
                        .select("input")
                        .property("value")
                );
                break;
            case "team":
                specialData["teamId"] = d3
                    .select("input[name='team-bool']:checked")
                    .property("value");
                rowData.push(
                    d3.select(specialData["teamId"]).property("value")
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

    createDot("#normal", specialData);
    createRow(rowData, specialData);
}

function createShotFromData(rowData, specialData) {
    createDot("#normal", specialData);
    createRow(rowData, specialData);
}

export { setUpShots, createShotFromData };
