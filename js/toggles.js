import { getRows } from "./table/table-functions.js";
import { perimeterId } from "../setup.js";

export function setUpToggles() {
    const toggles = d3.select("#toggles");
    toggles
        .append("div")
        .attr("class", "toggle-area center")
        .attr("id", "two-point-toggle-area");
    toggles
        .append("div")
        .attr("class", "toggle-area center")
        .attr("id", "heat-map-toggle-area");
    twoPointFunctionality();
    heatMapFunctionality();
}

export function twoPointFunctionality() {
    function setOn() {
        sessionStorage.setItem("shiftHeld", true);
        d3.select("#two-point-toggle").property("checked", true);
    }
    function setOff() {
        d3.select("#two-point-toggle").property("checked", false);
        sessionStorage.setItem("shiftHeld", false);
        sessionStorage.setItem("firstPoint", null);
        d3.select("#ghost").selectAll("*").remove();
    }
    if (d3.select("#two-point-enable").property("checked")) {
        d3.select("body")
            .on("keydown", function (e) {
                if (e.key === "Shift") {
                    setOn();
                }
            })
            .on("keyup", function (e) {
                if (e.key === "Shift") {
                    setOff();
                }
            });
        d3.select("#two-point-toggle-area").selectAll("*").remove();
        const toggleArea = d3.select("#two-point-toggle-area");
        toggleArea
            .append("label")
            .attr("class", "form-check-label")
            .attr("for", "two-point-toggle")
            .text("1-Location");
        let toggle = toggleArea
            .append("div")
            .attr("class", "form-check form-switch");
        toggle
            .append("input")
            .attr("class", "form-check-input")
            .attr("type", "checkbox")
            .attr("id", "two-point-toggle")
            .on("click", () =>
                d3.select("#two-point-toggle").property("checked")
                    ? setOn()
                    : setOff()
            );
        toggleArea
            .append("label")
            .attr("class", "form-check-label")
            .attr("for", "two-point-toggle")
            .text("2-Location");
    } else {
        setOff();
        d3.select("body").on("keydown", null).on("keyup", null);
        d3.select("#two-point-toggle-area").selectAll("*").remove();
    }
}

export function heatMapFunctionality() {
    function setOn() {
        d3.select("#heat-map-toggle").property("checked", true);
        d3.select(perimeterId).attr("pointer-events", "none");
        d3.select("#dots").attr("display", "none");
        heatMap();
    }
    function setOff() {
        d3.select("#heat-map-toggle").property("checked", false);
        d3.select(perimeterId).attr("pointer-events", "auto");
        d3.select("#dots").attr("display", "contents");
        d3.select("#heat-map").selectAll("*").remove();
    }
    if (d3.select("#heat-map-enable").property("checked")) {
        d3.select("#heat-map-toggle-area").selectAll("*").remove();

        const toggleArea = d3.select("#heat-map-toggle-area");

        toggleArea
            .append("label")
            .attr("class", "form-check-label")
            .attr("for", "heat-map-toggle")
            .text("Event Dot View");
        let toggle = toggleArea
            .append("div")
            .attr("class", "form-check form-switch");
        toggle
            .append("input")
            .attr("class", "form-check-input")
            .attr("type", "checkbox")
            .attr("id", "heat-map-toggle")
            .on("click", () =>
                d3.select("#heat-map-toggle").property("checked")
                    ? setOn()
                    : setOff()
            );
        toggleArea
            .append("label")
            .attr("class", "form-check-label")
            .attr("for", "heat-map-toggle")
            .text("Heat Map View");
    } else {
        setOff();
        d3.select("#heat-map-toggle-area").selectAll("*").remove();
    }
}

function heatMap() {
    d3.select("#heat-map").selectAll("*").remove();

    function colorFunc(colorName) {
        let color;
        switch (colorName) {
            case "blueTeam":
                color = "rgba(53, 171, 169, 0.3)";
                break;
            case "orangeTeam":
                color = "rgba(234, 142, 72, 0.3)";
                break;
            default:
                color = "rgba(170, 170, 170, 0.3)";
                break;
        }
        return d3
            .scaleLinear()
            .domain([0, 0.01]) // Points per square pixel.
            .range(["rgba(255, 255, 255, 0.3)", color]);
    }

    // compute the density data
    const data = _.map(getRows(), (r) => ({
        team: r.specialData.teamColor,
        x: r.specialData.coords[0],
        y: r.specialData.coords[1],
    }));

    const groupedData = _.groupBy(data, "team");

    for (const color in groupedData) {
        const colorRange = colorFunc(color);
        const densityData = d3
            .contourDensity()
            .x((d) => {
                return d.x;
            })
            .y((d) => d.y)
            .bandwidth(5)(groupedData[color]);

        d3.select("#heat-map")
            .insert("g", "g")
            .selectAll("path")
            .data(densityData)
            .enter()
            .append("path")
            .attr("d", d3.geoPath())
            .attr("fill", function (d) {
                return colorRange(d.value);
            });
    }
}
