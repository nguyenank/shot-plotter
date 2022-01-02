import { createDot } from "./dot.js";
import { createNewRow } from "../table/row.js";
import { getHeaderRow, getNumRows } from "../table/table-functions.js";
import { getTypeIndex } from "../details/details-functions.js";
import {
    sport,
    cfgSportA,
    cfgSportGoalCoords,
    perimeterId,
} from "../../setup.js";

function setUpShots() {
    sessionStorage.setItem("firstPoint", null);
    sessionStorage.setItem("shiftHeld", null);

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

    d3.select("#playing-area")
        .select(perimeterId)
        .on("click", (e) => {
            document.getSelection().removeAllRanges();
            d3.select("#ghost").selectAll("*").remove();
            let shiftHeld = sessionStorage.getItem("shiftHeld");
            let firstPoint =
                sessionStorage.getItem("firstPoint") === "null"
                    ? null
                    : sessionStorage
                          .getItem("firstPoint")
                          .split(",")
                          .map(parseFloat);
            if (shiftHeld === "true" && firstPoint === null) {
                // create ghost dot for first point
                sessionStorage.setItem("firstPoint", d3.pointer(e));
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
                if (specialData["coords2"]) {
                    rowData[col.id] = math
                        .distance(specialData["coords"], specialData["coords2"])
                        .toFixed(2);
                } else {
                    // else if 1 coordinate event, record distance to nearest goal
                    rowData[col.id] = math
                        .min(
                            _.map(cfgSportGoalCoords, (g) =>
                                math.distance(g, specialData["coords"])
                            )
                        )
                        .toFixed(2);
                }
                break;
            case "value-calc":
                rowData[col.id] =
                    e.target.id === "left-arc" || e.target.id === "right-arc"
                        ? 2
                        : 3;

            default:
                continue;
        }
    }

    createDot("#normal", id, specialData);
    createNewRow(id, rowData, specialData);
    heatMap();
}

function heatMap() {
    d3.select("#heat-map").remove();

    const svg = d3
        .select("#transformations")
        .append("g")
        .attr("id", "heat-map");
    const color = d3
        .scaleLinear()
        .domain([0, 0.01]) // Points per square pixel.
        .range(["rgba(255, 255, 255, 0.3)", "rgba(255,0,0,0.3)"]);

    // Add X axis

    // compute the density data
    const data = _.map(getRows(), (r) => ({
        x: r.specialData.coords[0],
        y: r.specialData.coords[1],
    }));
    const densityData = d3
        .contourDensity()
        .x((d) => {
            return d.x;
        })
        .y((d) => d.y)
        .bandwidth(5)(data);

    svg.insert("g", "g")
        .selectAll("path")
        .data(densityData)
        .enter()
        .append("path")
        .attr("d", d3.geoPath())
        .attr("fill", function (d) {
            return color(d.value);
        });
}

function createShotFromData(id, rowData, specialData) {
    createDot("#normal", id, specialData);
    createNewRow(id, rowData, specialData);
}

export { setUpShots, createShotFromData };
