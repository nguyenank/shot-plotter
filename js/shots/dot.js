import { getOptions } from "../options/options.js";
import { cfg } from "./config.js";

function createDot(svgId, data) {
    var typeIndex = getOptions()[data.type];
    var className = data.legendBool
        ? "legend-shot"
        : data.teamId === "#blue-team-name"
        ? "blue-shot"
        : "orange-shot";
    let g = d3
        .select(svgId)
        .append("g")
        .attr("id", data.id)
        .attr(
            "shot-number",
            d3
                .select("#shot-table-body")
                .selectAll("tr")
                .size()
        );

    if (typeIndex == 0) {
        g.append("circle")
            .attr("cx", data.coords[0])
            .attr("cy", data.coords[1])
            .attr("r", data.legendBool ? cfg.legendR : cfg.circleR)
            .attr("class", className);
    } else {
        var sides = typeIndex + 2;
        g.append("polygon")
            .attr(
                "points",
                polygon(
                    data.coords[0],
                    data.coords[1],
                    data.legendBool ? cfg.legendR : cfg.polyR,
                    sides
                )
            )
            .attr("class", className);
    }
    // only display text if two characters or less
    if (data.player.length <= 2) {
        g.append("text")
            .attr("x", data.coords[0])
            .attr("y", data.coords[1])
            .attr("text-anchor", "middle")
            .attr("dominant-baseline", "middle")
            .text(data.player)
            .attr("class", "dot-text");
    }
}

function polygon(cx, cy, r, sides) {
    var degrees = (2 * Math.PI) / sides;
    var points = "";
    for (let i = 0; i < sides; i++) {
        // shift by 100 to make triangle point down for max space
        let x = (cx + r * Math.cos(degrees * i + 100))
            .toFixed(3)
            .replace(/^-0.000$/, "0");
        let y = (cy + r * Math.sin(degrees * i + 100))
            .toFixed(3)
            .replace(/^-0.000$/, "0");
        points = points + x + "," + y + " ";
    }
    return points;
}

export { createDot, polygon };
