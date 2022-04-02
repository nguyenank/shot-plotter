import { getFilteredRows } from "./table/table-functions.js";
import { perimeterId, cfgSportA } from "../setup.js";
import { existsDetail } from "./details/details-functions.js";

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
    toggles
        .append("div")
        .attr("class", "toggle-area center")
        .attr("id", "heat-map-team-select")
        .style("display", "none");

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
            .on("change", () =>
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
        d3.select("#dots").attr("display", "none");
        heatMap();
        if (existsDetail("#team")) {
            regenHeatMapTeamNames();
            d3.select("#heat-map-team-select").style("display", "flex");
        }
    }
    function setOff() {
        d3.select("#dots").attr("display", "contents");
        d3.select("#heat-map").selectAll("*").remove();
        d3.select("#heat-map-team-select").style("display", "none");
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
            .on("change", () =>
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
        d3.select("#heat-map-team-select").style("display", "none");
    }
}

export function heatMap() {
    if (
        d3.select("#heat-map-toggle").empty() ||
        !d3.select("#heat-map-toggle").property("checked")
    ) {
        // do not generate heat map if feature not enabled
        return;
    }
    d3.select("#heat-map").selectAll("*").remove();

    // compute the density data
    const data = _.map(getFilteredRows(), (r) => ({
        team: r.specialData.teamColor,
        x: r.specialData.coords[0],
        y: r.specialData.coords[1],
    }));

    function colorFunc(colorName) {
        const lowOpacity = cfgSportA.heatMapLowOpacity;
        const highOpacity = cfgSportA.heatMapHighOpacity;
        let color;
        let bgColor;
        switch (colorName) {
            case "blueTeam":
                bgColor = `rgba(53, 171, 169, ${lowOpacity})`;
                color = `rgba(53, 171, 169, ${highOpacity})`;
                break;
            case "orangeTeam":
                bgColor = `rgba(234, 142, 72, ${lowOpacity})`;
                color = `rgba(234, 142, 72, ${highOpacity})`;
                break;
            default:
                bgColor = `rgba(170, 170, 170, ${lowOpacity})`;
                color = `rgba(170, 170, 170, ${highOpacity})`;
                break;
        }
        return d3
            .scaleLinear()
            .domain([0, 0.01]) // Points per square pixel.
            .range([bgColor, color]);
    }

    const groupedData = _.groupBy(data, "team");

    const scale = cfgSportA.heatMapScale;
    const unscale = _.round(1 / scale, 2);

    for (const color in groupedData) {
        const colorRange = colorFunc(color);
        const densityData = d3
            .contourDensity()
            .x((d) => {
                return d.x * scale;
            })
            .y((d) => d.y * scale)
            .thresholds(10)
            .cellSize(2)
            .bandwidth(4)(groupedData[color]);
        d3.select("#heat-map")
            .insert("g", "g")
            .attr("id", color + "-heat-map-svg")
            .attr("transform", `scale(${unscale},${unscale})`)
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
