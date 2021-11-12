import {
    getDetails,
    existsDetail,
    getCurrentShotTypes,
} from "../details/details-functions.js";
import { createDot } from "./dot.js";
import { cfgAppearance } from "../config-appearance.js";

function setUpLegend() {
    let div = d3.select("#legend").append("div");
    div.append("div")
        .attr("class", "center")
        .append("svg")
        .attr("id", "shot-type-legend");

    shotTypeLegend();

    div.append("div")
        .attr("class", "center")
        .append("svg")
        .attr("id", "team-legend");

    teamLegend();
}

function shotTypeLegend(id = "#shot-type-legend") {
    let xOffset = 2 * cfgAppearance.legendR;
    let yOffset = 2 * cfgAppearance.legendR;
    const spacing = 2 * cfgAppearance.legendR;
    let svg = d3.select(id);

    // clear svg
    svg.selectAll("*").remove();

    // if shot-type not in the details
    if (!existsDetail("#shot-type")) {
        svg.attr("width", 0).attr("height", 0);
        return;
    }

    const typeOptions = getCurrentShotTypes();

    typeOptions.forEach(function(value, i) {
        let data = {
            teamId: true,
            player: "",
            typeIndex: i,
            coords: [xOffset, 0.625 * yOffset],
            legendBool: true,
        };
        createDot(id, `legend-${Math.round(xOffset)}`, data);
        xOffset += spacing;
        xOffset +=
            svg
                .append("text")
                .attr("x", xOffset)
                .attr("y", yOffset)
                .text(typeOptions[i].value)
                .node()
                .getComputedTextLength() +
            2 * spacing;
    });
    xOffset -= 2 * spacing;

    svg.attr("width", xOffset).attr("height", 2 * yOffset);
}

function teamLegend(id = "#team-legend") {
    let xOffset = 2 * cfgAppearance.legendR;
    let yOffset = 2 * cfgAppearance.legendR;
    const spacing = 2 * cfgAppearance.legendR;
    const svg = d3.select(id);

    // clear svg
    svg.selectAll("*").remove();

    // do not do anything if team widget isn't present
    if (!existsDetail("#team")) {
        svg.attr("width", 0).attr("height", 0);
        return;
    }

    for (let [teamColor, text] of [
        ["blueTeam", d3.select("#blue-team-name").property("value")],
        ["orangeTeam", d3.select("#orange-team-name").property("value")],
    ]) {
        svg.append("rect")
            .attr("x", xOffset - cfgAppearance.legendR)
            .attr("y", 0.25 * yOffset)
            .attr("width", 2 * cfgAppearance.legendR)
            .attr("height", 2 * cfgAppearance.legendR)
            .style("fill", cfgAppearance[teamColor])
            .style("stroke-width", "0.05em")
            .style("stroke", cfgAppearance[teamColor + "Solid"]);
        xOffset += spacing;
        xOffset +=
            svg
                .append("text")
                .attr("x", xOffset)
                .attr("y", yOffset)
                .text(text)
                .node()
                .getComputedTextLength() +
            2 * spacing;
    }
    xOffset -= 2 * spacing;
    svg.attr("width", xOffset).attr("height", 2 * yOffset);
}

export { setUpLegend, shotTypeLegend, teamLegend };
