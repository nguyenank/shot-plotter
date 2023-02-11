import { createDot } from "./dot.js";
import { createNewRow } from "../table/row.js";
import {
    addRow,
    getHeaderRow,
    getRows,
    addFilteredRow,
    setNumRows,
    getNumRows,
} from "../table/table-functions.js";
import { updateTableFooter } from "../table/table.js";
import { getTypeIndex } from "../details/details-functions.js";
import { heatMap } from "../toggles.js";
import { filterRows } from "../table/filter.js";
import {
    sport,
    dataStorage,
    cfgSportA,
    cfgSportGoalCoords,
    perimeterId,
} from "../../setup.js";

function setUpShots() {
    // http://thenewcode.com/1068/Making-Arrows-in-SVG
    for (let className of ["blueTeam", "orangeTeam", "greyTeam"]) {
        d3.select(`#${sport}-svg`)
            .insert("marker", "g")
            .attr("id", `arrowhead-${className}`)
            .attr("markerWidth", 10)
            .attr("markerHeight", 5)
            .attr("refX", 2.5)
            .attr("refY", 2.5)
            .attr("orient", "auto")
            .append("polygon")
            .attr("points", "0 0, 5 2.5, 0 5")
            .attr("class", className);
    }
    dataStorage.set("firstPoint", null);

    d3.select("#playing-area")
        .select(perimeterId)
        .on("click", (e) => {
            document.getSelection().removeAllRanges();
            d3.select("#ghost").selectAll("*").remove();
            let shiftHeld = dataStorage.get("shiftHeld");
            let firstPoint = dataStorage.get("firstPoint");
            if (shiftHeld && firstPoint === null) {
                // create ghost dot for first point
                dataStorage.set("firstPoint", d3.pointer(e));
                const type = d3.select("#shot-type").empty()
                    ? null
                    : d3
                          .select("#shot-type")
                          .select("select")
                          .property("value");
                createDot("#ghost", "ghost-dot", {
                    id: "ghost-dot",
                    typeIndex: getTypeIndex(type),
                    teamColor: d3
                        .select("input[name='team-bool']:checked")
                        .empty()
                        ? null
                        : d3
                              .select("input[name='team-bool']:checked")
                              .property("value"),
                    coords: d3.pointer(e),
                    ghostBool: true,
                });
            } else if (shiftHeld && firstPoint !== null) {
                dataStorage.set("firstPoint", null);
                createShotFromEvent(e, firstPoint);
            } else {
                createShotFromEvent(e);
            }
        });

    if (getRows()) {
        _.map(getRows(), (r) => {
            createShotFromData(r.id, r.rowData, r.specialData, false);
        });
    }
}

function createShotFromEvent(e, point1) {
    // https://stackoverflow.com/a/29325047

    const columns = getHeaderRow();
    const id = uuidv4();
    let rowData = {};
    let specialData = {
        // data for custom specifics like color etc.
        typeIndex: 0,
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
                const type = d3
                    .select("#" + col.id)
                    .select("select")
                    .property("value");
                specialData["typeIndex"] = getTypeIndex(type);
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
                specialData["teamColor"] = d3
                    .select("input[name='team-bool']:checked")
                    .property("value");
                rowData[col.id] = d3
                    .select(
                        specialData["teamColor"] === "blueTeam"
                            ? "#blue-team-name"
                            : "#orange-team-name"
                    )
                    .property("value");
                break;
            case "shot-number":
                rowData[col.id] = getNumRows() + 1;
                break;
            case "x":
                if (col.id === "x2") {
                    let x2 = specialData["coords2"]
                        ? (
                              specialData["coords2"][0] -
                              cfgSportA.width / 2
                          ).toFixed(2)
                        : "";
                    rowData[col.id] = x2;
                } else {
                    rowData[col.id] = (
                        specialData["coords"][0] -
                        cfgSportA.width / 2
                    ).toFixed(2);
                }
                break;
            case "y":
                if (col.id === "y2") {
                    let y2 = specialData["coords2"]
                        ? (
                              -1 *
                              (specialData["coords2"][1] - cfgSportA.height / 2)
                          ).toFixed(2)
                        : "";
                    rowData[col.id] = y2;
                } else {
                    rowData[col.id] = (
                        -1 *
                        (specialData["coords"][1] - cfgSportA.height / 2)
                    ).toFixed(2);
                }
                break;
            case "distance-calc":
                // if 2 coordinate event, record distance between points
                function distance([x1, y1], [x2, y2]) {
                    return Math.sqrt(
                        Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2)
                    );
                }

                if (specialData["coords2"]) {
                    rowData[col.id] = distance(
                        specialData["coords"],
                        specialData["coords2"]
                    ).toFixed(2);
                } else {
                    // else if 1 coordinate event, record distance to nearest goal
                    if (cfgSportGoalCoords) {
                        rowData[col.id] = Math.min(
                            ..._.map(cfgSportGoalCoords, (g) =>
                                distance(g, specialData["coords"])
                            )
                        ).toFixed(2);
                    } else {
                        rowData[col.id] = "";
                    }
                }
                break;
            case "value-calc":
                rowData[col.id] =
                    e.target.id === "left-arc" || e.target.id === "right-arc"
                        ? 2
                        : 3;
                break;
            case "in-out":
                rowData[col.id] =
                    e.target.id === "outside-perimeter" ? "In" : "Out";
                break;
            default:
                continue;
        }
    }

    // add row to dataStorage
    createShotFromData(id, rowData, specialData);
}

function createShotFromData(id, rowData, specialData, newRow = true) {
    const formattedRow = {
        id: id,
        rowData: rowData,
        specialData: specialData,
        selected: false,
    };
    if (newRow) {
        addRow(formattedRow);
        updateTableFooter();
    }
    if (filterRows([formattedRow]).length == 1) {
        createDot("#normal", id, specialData, "visible");
        if (newRow) {
            addFilteredRow(formattedRow);
            createNewRow(id, rowData, specialData);
        }
        heatMap();
    } else {
        createDot("#normal", id, specialData, "hidden");
        if (addRow) {
            setNumRows(getNumRows() + 1);
            updateTableFooter();
        }
    }
}

export { setUpShots, createShotFromData };
