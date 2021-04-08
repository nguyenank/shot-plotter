import { getOptionsObject } from "../options.js";
import { cfg } from "./config.js";

function createDot(svgId, teamId, player, type, coords, id, legendBool) {
    var data = {
        period: period,
        teamId: teamId,
        player: player,
        type: type,
        coordinates: coords,
    };
    var typeIndex = getOptionsObject()[type];
    var className = legendBool
        ? "legend-shot"
        : teamId === "#blue-team-name"
        ? "blue-shot"
        : "orange-shot";
    let g = d3
        .select(svgId)
        .append("g")
        .attr("id", id)
        .attr(
            "shot-number",
            d3
                .select("#shot-table-body")
                .selectAll("tr")
                .size()
        );

    if (typeIndex == 0) {
        g.append("circle")
            .attr("cx", coords[0])
            .attr("cy", coords[1])
            .attr("r", legendBool ? cfg.legendR : cfg.circleR)
            .attr("class", className);
    } else {
        var sides = typeIndex + 2;
        g.append("polygon")
            .attr(
                "points",
                polygon(
                    coords[0],
                    coords[1],
                    legendBool ? cfg.legendR : cfg.polyR,
                    sides
                )
            )
            .attr("class", className);
    }
    // only display text if two characters or less
    if (player && player.length <= 2) {
        g.append("text")
            .attr("x", coords[0])
            .attr("y", coords[1])
            .attr("text-anchor", "middle")
            .attr("dominant-baseline", "middle")
            .text(player)
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
