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
import { getRosterSelection, triggerRecord } from "../roster/roster-state.js";

function autoSelectTeam(svgX) {
    if (d3.select('input[name="team-bool"]').empty()) return;
    const isRightSide = svgX > cfgSportA.width / 2;
    const period = d3.select('input[name="period"]:checked').empty()
        ? "1"
        : d3.select('input[name="period"]:checked').property("value");
    const homeShootsRight = period !== "2";
    const isHomeTeam = homeShootsRight ? isRightSide : !isRightSide;
    d3.select(isHomeTeam ? "#blue-team-select" : "#orange-team-select")
        .property("checked", true);
}

function updateRinkLabels() {
    if (d3.select("#rink-label-left").empty()) return;
    const period = d3.select('input[name="period"]:checked').empty()
        ? "1"
        : d3.select('input[name="period"]:checked').property("value");
    const homeShootsRight = period !== "2";
    const homeName = d3.select("#blue-team-name").property("value") || "PER";
    const awayName = d3.select("#orange-team-name").property("value") || "Away";

    d3.select("#rink-label-left")
        .text((homeShootsRight ? awayName : homeName) + " Shoots")
        .attr("fill", homeShootsRight ? "#ea8e48" : "#35aba9");
    d3.select("#rink-label-right")
        .text((homeShootsRight ? homeName : awayName) + " Shoots")
        .attr("fill", homeShootsRight ? "#35aba9" : "#ea8e48");
}

function setUpRinkLabels() {
    const w = parseFloat(cfgSportA.width);
    const h = parseFloat(cfgSportA.height);
    const fontSize = h * 0.09;
    // Insert inside #transformations (which carries the scale transform) so
    // labels use rink coordinate units and resize with the window.
    // Insert before #dots so dots render on top of the labels.
    const g = d3.select("#transformations");

    g.insert("text", "#dots")
        .attr("id", "rink-label-left")
        .attr("x", w * 0.25)
        .attr("y", h * 0.13)
        .attr("text-anchor", "middle")
        .attr("font-size", fontSize)
        .attr("font-family", "Open Sans, sans-serif")
        .attr("font-weight", "600")
        .attr("pointer-events", "none");

    g.insert("text", "#dots")
        .attr("id", "rink-label-right")
        .attr("x", w * 0.75)
        .attr("y", h * 0.13)
        .attr("text-anchor", "middle")
        .attr("font-size", fontSize)
        .attr("font-family", "Open Sans, sans-serif")
        .attr("font-weight", "600")
        .attr("pointer-events", "none");

    updateRinkLabels();

    d3.select("#details").on("change.rinkLabels", (e) => {
        if (e.target.name === "period") {
            updateRinkLabels();
            updatePeriodDotVisibility();
        }
    });
    d3.select("#details").on("input.rinkLabels", (e) => {
        if (e.target.id === "blue-team-name" || e.target.id === "orange-team-name")
            updateRinkLabels();
    });
}

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
            if (getRosterSelection()) {
                triggerRecord(d3.pointer(e));
                return;
            }
            autoSelectTeam(d3.pointer(e)[0]);
            let shiftHeld = dataStorage.get("shiftHeld");
            let firstPoint = dataStorage.get("firstPoint");
            if (shiftHeld && firstPoint === null) {
                // create ghost dot for first point
                dataStorage.set("firstPoint", d3.pointer(e));
                const type = d3.select('input[name="shot-type"]:checked').empty()
                    ? null
                    : d3.select('input[name="shot-type"]:checked').property("value");
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
        updatePeriodDotVisibility();
    }

    setUpRinkLabels();
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
            case "shot-type": {
                const type = d3
                    .select(`input[name="${col.id}"]:checked`)
                    .property("value");
                specialData["typeIndex"] = getTypeIndex(type);
                rowData[col.id] = type;
                break;
            }
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
                let adjXFactor =
                    !d3.select("#adj-coords-toggle").empty() &&
                    !d3.select("#adj-coords-toggle").property("checked") &&
                    (col.id == "xadj" || col.id == "x2adj")
                        ? -1
                        : 1;
                if (col.id === "x2" || col.id === "x2adj") {
                    let x2 = specialData["coords2"]
                        ? (
                              adjXFactor *
                              (specialData["coords2"][0] - cfgSportA.width / 2)
                          ).toFixed(2)
                        : "";
                    rowData[col.id] = x2;
                } else {
                    rowData[col.id] = (
                        adjXFactor *
                        (specialData["coords"][0] - cfgSportA.width / 2)
                    ).toFixed(2);
                }
                break;
            case "y":
                let adjYFactor =
                    !d3.select("#adj-coords-toggle").empty() &&
                    !d3.select("#adj-coords-toggle").property("checked") &&
                    (col.id == "yadj" || col.id == "y2adj")
                        ? -1
                        : 1;
                if (col.id === "y2" || col.id === "y2adj") {
                    let y2 = specialData["coords2"]
                        ? (
                              -1 *
                              adjYFactor *
                              (specialData["coords2"][1] - cfgSportA.height / 2)
                          ).toFixed(2)
                        : "";
                    rowData[col.id] = y2;
                } else {
                    rowData[col.id] = (
                        -1 *
                        adjYFactor *
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
        if (!specialData.isStatRow) {
            createDot("#normal", id, specialData, "visible");
            applyPeriodClass(id, rowData["period"]);
        }
        if (newRow) {
            addFilteredRow(formattedRow);
            createNewRow(id, rowData, specialData);
        }
        heatMap();
    } else {
        if (!specialData.isStatRow) {
            createDot("#normal", id, specialData, "hidden");
            applyPeriodClass(id, rowData["period"]);
        }
        if (addRow) {
            setNumRows(getNumRows() + 1);
            updateTableFooter();
        }
    }
}

// Hide/show a single dot based on whether its period matches the selected period.
function applyPeriodClass(id, dotPeriod) {
    const selected = d3.select('input[name="period"]:checked').property("value");
    d3.select("#normal").select(`[id='${id}']`).classed("period-hidden", dotPeriod !== selected);
}

// Re-apply period visibility to all dots — called when period radio changes.
export function updatePeriodDotVisibility() {
    const selected = d3.select('input[name="period"]:checked').property("value");
    (getRows() || []).forEach(row => {
        if (row.specialData?.isStatRow) return;
        d3.select("#normal").select(`[id='${row.id}']`)
            .classed("period-hidden", row.rowData["period"] !== selected);
    });
}

export { setUpShots, createShotFromData, updateRinkLabels };
