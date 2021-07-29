import { createDot } from "./dot.js";
import { createRow } from "../table/row.js";
import {
    getHeaderRow,
    setStartRow,
    getStartRow,
    setEndRow,
    getEndRow,
} from "../table/table-functions.js";

function setUpShots() {
    sessionStorage.setItem("firstPoint", null);
    sessionStorage.setItem("shiftHeld", null);

    // http://thenewcode.com/1068/Making-Arrows-in-SVG
    for (let className of ["blue-shot", "orange-shot", "grey-shot"]) {
        d3.select("#hockey-rink-svg")
            .insert("marker", "g")
            .attr("id", `arrowhead-${className}`)
            .attr("markerWidth", 10)
            .attr("markerHeight", 5)
            .attr("refX", 5)
            .attr("refY", 2.5)
            .attr("orient", "auto")
            .append("polygon")
            .attr("points", "0 0, 5 2.5, 0 5")
            .attr("class", className);
    }

    d3.select("#hockey-rink")
        .select("#outside-perimeter")
        .on("click", e => {
            document.getSelection().removeAllRanges();
            d3.select("#ghost")
                .selectAll("*")
                .remove();
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
                createDot("#ghost", {
                    id: "ghost-dot",
                    type: d3.select("#shot-type").empty()
                        ? null
                        : d3
                              .select("#shot-type")
                              .select("select")
                              .property("value"),
                    teamId: d3.select("input[name='team-bool']:checked").empty()
                        ? null
                        : d3
                              .select("input[name='team-bool']:checked")
                              .property("value"),
                    coords: d3.pointer(e),
                    ghostBool: true,
                });
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
    var id = uuidv4();
    let rowData = { id: id };
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
                rowData[col.id] = d3
                    .select(`input[name="${col.id}"]:checked`)
                    .property("value");
                break;
            case "player":
                specialData["player"] = d3
                    .select("#" + col.id)
                    .select("input")
                    .property("value");
            case "text-field":
                rowData[col.id] = d3
                    .select("#" + col.id)
                    .select("input")
                    .property("value");
                break;
            case "shot-type":
                specialData["type"] = d3
                    .select("#" + col.id)
                    .select("select")
                    .property("value");
            case "dropdown":
                rowData[col.id] = d3
                    .select("#" + col.id)
                    .select("select")
                    .property("value");
                break;
            case "time":
                rowData[col.id] = d3
                    .select("#" + col.id)
                    .select("input")
                    .property("value");
                break;
            case "team":
                specialData["teamId"] = d3
                    .select("input[name='team-bool']:checked")
                    .property("value");
                rowData[col.id] = d3
                    .select(specialData["teamId"])
                    .property("value");
                break;
            case "shot-number":
                rowData[col.id] =
                    d3
                        .select("#shot-table-body")
                        .selectAll("tr")
                        .size() + 1;
                break;
            case "x":
                if (col.id === "x2") {
                    let x2 = specialData["coords2"]
                        ? (specialData["coords2"][0] - 100).toFixed(2)
                        : "";
                    rowData[col.id] = x2;
                } else {
                    rowData[col.id] = (specialData["coords"][0] - 100).toFixed(
                        2
                    );
                }
                break;
            case "y":
                if (col.id === "y2") {
                    let y2 = specialData["coords2"]
                        ? (-1 * (specialData["coords2"][1] - 42.5)).toFixed(2)
                        : "";
                    rowData[col.id] = y2;
                } else {
                    rowData[col.id] = (
                        -1 *
                        (specialData["coords"][1] - 42.5)
                    ).toFixed(2);
                }
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
