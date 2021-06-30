import { createDot } from "./dot.js";
import { createRow } from "./row.js";
import { getHeaderRow } from "../table.js";

function setUpShots() {
    d3.select("body")
        .on("keydown", function(e) {
            if (e.key === "Shift") {
                sessionStorage.setItem("shiftHeld", true);
            }
        })
        .on("keyup", function(e) {
            if (e.key === "Shift") {
                sessionStorage.setItem("shiftHeld", false);
                sessionStorage.setItem("firstPoint", null);
            }
        });

    // http://thenewcode.com/1068/Making-Arrows-in-SVG
    d3.select("#hockey-rink-svg")
        .insert("marker", "g")
        .attr("id", "arrowhead-blue-shot")
        .attr("markerWidth", 10)
        .attr("markerHeight", 5)
        .attr("refX", 5)
        .attr("refY", 2.5)
        .attr("orient", "auto")
        .append("polygon")
        .attr("points", "0 0, 5 2.5, 0 5")
        .attr("class", "blue-shot");

    d3.select("#hockey-rink-svg")
        .insert("marker", "marker")
        .attr("id", "arrowhead-orange-shot")
        .attr("markerWidth", 10)
        .attr("markerHeight", 5)
        .attr("refX", 5)
        .attr("refY", 2.5)
        .attr("orient", "auto")
        .append("polygon")
        .attr("points", "0 0, 5 2.5, 0 5")
        .attr("class", "orange-shot");

    d3.select("#hockey-rink")
        .select("#outside-perimeter")
        .on("click", e => {
            document.getSelection().removeAllRanges();
            let shiftHeld = sessionStorage.getItem("shiftHeld");
            let firstPoint =
                sessionStorage.getItem("firstPoint") === "null"
                    ? null
                    : sessionStorage
                          .getItem("firstPoint")
                          .split(",")
                          .map(parseFloat);
            if (shiftHeld === "true" && firstPoint === null) {
                sessionStorage.setItem("firstPoint", d3.pointer(e));
            } else if (shiftHeld === "true" && firstPoint !== null) {
                sessionStorage.setItem("firstPoint", null);
                createShotFromEvent(e, firstPoint);
            } else {
                createShotFromEvent(e);
            }
        });
}

function createShotFromEvent(e, point1) {
    // https://stackoverflow.com/a/29325047

    var columns = getHeaderRow();
    let rowData = [];
    var id = uuidv4();
    let specialData = {
        // data for custom specfics like color etc.
        id: id,
        coords: point1 ? point1 : d3.pointer(e),
        coords2: point1 ? d3.pointer(e) : null,
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
                rowData.push((specialData["coords"][0] - 100).toFixed(2));
                break;
            case "y":
                rowData.push(
                    (-1 * (specialData["coords"][1] - 42.5)).toFixed(2)
                );
                break;
            case "x2":
                let x2 = specialData["coords2"]
                    ? (specialData["coords2"][0] - 100).toFixed(2)
                    : "";
                rowData.push(x2);
                break;
            case "y2":
                let y2 = specialData["coords2"]
                    ? (-1 * (specialData["coords2"][1] - 42.5)).toFixed(2)
                    : "";
                rowData.push(y2);
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
