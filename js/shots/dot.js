import {
    getDetails,
    getCurrentShotTypes,
} from "../details/details-functions.js";
import { cfg } from "../config.js";
function createDot(
    svgId,
    id,
    { typeIndex, teamColor, coords, coords2, player, legendBool }
) {
    var className = legendBool
        ? "legendTeam"
        : !teamColor
        ? "greyTeam"
        : teamColor;
    let g = d3
        .select(svgId)
        .append("g")
        .attr("id", id);
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
    const t = d3.transition().duration(cfg.newDotDuration);
    if (typeIndex == 0) {
        let circle = g
            .append("circle")
            .classed("ghost-shot", ghostBool)
            .attr("cx", coords[0])
            .attr("cy", coords[1]);
        if (!legendBool) {
            // do not transition for legend
            circle = circle.transition(t);
        }
        circle
            .attr(
                "r",
                legendBool
                    ? cfg.legendR
                    : pointTwoBool || ghostBool
                    ? cfg.polyR / 2
                    : cfg.polyR
            )
            .style("fill", cfg[className])
            .style("stroke-width", "0.1px")
            .style("stroke", cfg[className + "Solid"]);
    } else {
        var sides = typeIndex + 2;
        if (legendBool) {
            // do not transition for legend
            g.append("polygon")
                .style("fill", cfg[className])
                .style("stroke-width", "0.1px")
                .style("stroke", cfg[className + "Solid"])
                .attr(
                    "points",
                    polygon(coords[0], coords[1], cfg.legendR, sides)
                );
        } else {
            g.append("polygon")
                .classed("ghost-shot", ghostBool)
                .style("fill", cfg[className])
                .style("stroke-width", "0.05px")
                .style("stroke", cfg[className + "Solid"])
                .attr("points", polygon(coords[0], coords[1], 1, sides));
            dotSizeHandler(
                id,
                pointTwoBool || ghostBool ? cfg.polyR / 2 : cfg.polyR
            );
        }
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

function dotSizeHandler(id, scale) {
    function enlarge() {
        // https://stackoverflow.com/a/11671373
        var bbox = d3
            .select(this)
            .node()
            .getBBox();
        var xShift = (1 - scale) * (bbox.x + bbox.width / 2);
        var yShift = (1 - scale) * (bbox.y + bbox.height / 2);
        const t = d3.transition().duration(cfg.selectDuration);
        d3.select(this)
            .transition(t)
            .attr(
                "transform",
                `translate(${xShift},${yShift}) scale(${scale},${scale})`
            );
    }
    d3.select("#dots")
        .select("[id='" + id + "']")
        .selectAll("circle")
        .each(enlarge);
    d3.select("#dots")
        .select("[id='" + id + "']")
        .selectAll("polygon")
        .each(enlarge);
    let line = d3
        .select("#dots")
        .select("[id='" + id + "']")
        .select("polyline");
    if (!line.empty()) {
        if (line.style("opacity") === "0.3") {
            line.style("opacity", 0.7);
        } else {
            line.style("opacity", 0.3);
        }
    }
}

export { createDot, polygon, dotSizeHandler };
