import {
    getDetails,
    getCurrentShotTypes,
} from "../details/details-functions.js";
import { cfg } from "./config-shots.js";

function createDot(
    svgId,
    { id, type, teamId, coords, coords2, player, legendBool }
) {
    var typeIndex = type
        ? _.findIndex(getCurrentShotTypes(), {
              value: type,
          })
        : 0;
    var className = legendBool
        ? "legend-shot"
        : !teamId
        ? "grey-shot"
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
    if (coords2) {
        let halfcoords = [
            Math.round((coords[0] + coords2[0]) / 2),
            Math.round((coords[1] + coords2[1]) / 2),
        ];
        createShape({
            id: id,
            typeIndex: typeIndex,
            coords: coords,
            legendBool: legendBool,
            pointTwoBool: true,
            className: className,
        });
        g.append("polyline")
            .attr(
                "points",
                `${coords[0]},${coords[1]} ${halfcoords[0]},${halfcoords[1]} ${coords2[0]},${coords2[1]}`
            )
            .attr("marker-mid", `url(#arrowhead-${className})`)
            .attr("class", className);
        coords = coords2;
    }
    createShape({
        id: id,
        typeIndex: typeIndex,
        coords: coords,
        legendBool: legendBool,
        className: className,
    });

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

function createShape({
    id,
    typeIndex,
    coords,
    pointTwoBool,
    legendBool,
    className,
}) {
    let ghostBool = id === "ghost-dot";
    let g = legendBool
        ? d3.select("#shot-type-legend").select("[id='" + id + "']")
        : d3.select("#dots").select("[id='" + id + "']");
    if (typeIndex == 0) {
        g.append("circle")
            .attr("cx", coords[0])
            .attr("cy", coords[1])
            .attr(
                "r",
                legendBool
                    ? cfg.legendR
                    : pointTwoBool || ghostBool
                    ? cfg.polyR / 2
                    : cfg.polyR
            )
            .attr("class", ghostBool ? className + " ghost-shot" : className);
    } else {
        var sides = typeIndex + 2;
        g.append("polygon")
            .attr(
                "points",
                polygon(
                    coords[0],
                    coords[1],
                    legendBool
                        ? cfg.legendR
                        : pointTwoBool || ghostBool
                        ? cfg.polyR / 2
                        : cfg.polyR,
                    sides
                )
            )
            .attr("class", ghostBool ? className + " ghost-shot" : className);
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
