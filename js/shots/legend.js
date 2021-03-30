import { getOptionsList } from "../options.js";
import { createDot, colorShift } from "./dot.js";
import { cfg } from "./config.js";

function setUpLegend() {
    var options = getOptionsList();
    var div = d3.select("#legend").append("div");
    div.append("div")
        .attr("class", "center")
        .append("svg")
        .attr("id", "shot-type-legend");

    // clear svg
    shotTypeLegend();

    div.append("div")
        .attr("class", "center")
        .append("svg")
        .attr("id", "home-away-legend");

    homeAwayLegend();
}

function homeAwayLegend(id = "#home-away-legend") {
    var xOffset = 2 * cfg.legendR;
    var yOffset = 2 * cfg.legendR;
    var svg = d3.select(id);

    for (let i of [
        ["Home", cfg.homeColor],
        ["Away", cfg.awayColor],
    ]) {
        svg.append("rect")
            .attr("x", xOffset - cfg.legendR)
            .attr("y", 0.25 * yOffset)
            .attr("width", 2 * cfg.legendR)
            .attr("height", 2 * cfg.legendR)
            .style("fill", colorShift(i[1], 0));
        xOffset += 2 * cfg.legendR;
        xOffset +=
            svg
                .append("text")
                .attr("x", xOffset)
                .attr("y", yOffset)
                .text(i[0])
                .node()
                .getComputedTextLength() +
            4 * cfg.legendR;
    }
    svg.attr("width", xOffset).attr("height", 2 * yOffset);
}

function shotTypeLegend(id = "#shot-type-legend") {
    var xOffset = 2 * cfg.legendR;
    var yOffset = 2 * cfg.legendR;
    var spacing = 2 * cfg.legendR;
    var options = getOptionsList();
    var svg = d3.select(id);

    // clear svg
    svg.selectAll("*").remove();

    for (let option of options) {
        createDot(id, true, option, [xOffset, 0.75 * yOffset], xOffset, true);
        xOffset += spacing;
        xOffset +=
            svg
                .append("text")
                .attr("x", xOffset)
                .attr("y", yOffset)
                .text(option)
                .node()
                .getComputedTextLength() +
            2 * spacing;
    }

    svg.attr("width", xOffset).attr("height", 2 * yOffset);
}

export { setUpLegend, shotTypeLegend };
