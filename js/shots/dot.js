import {
    getDetails,
    getCurrentShotTypes,
} from "../details/details-functions.js";
import { cfg } from "../config.js";
import { sport } from "../../index.js";

function createDot(
    svgId,
    id,
    { typeIndex, teamColor, coords, coords2, player, legendBool }
) {
    const team = legendBool
        ? "legendTeam"
        : !teamColor
        ? "greyTeam"
        : teamColor;
    let g = d3
        .select(svgId)
        .append("g")
        .attr("id", id);

    if (coords2) {
        // create smaller first dot
        createShape({
            id: id,
            typeIndex: typeIndex,
            coords: coords,
            legendBool: legendBool,
            pointTwoBool: true,
            team: team,
        });
        // create connecting line
        const halfcoords = [
            Math.round((coords[0] + coords2[0]) / 2),
            Math.round((coords[1] + coords2[1]) / 2),
        ];
        g.append("polyline")
            .attr(
                "points",
                `${coords[0]},${coords[1]} ${halfcoords[0]},${halfcoords[1]} ${coords2[0]},${coords2[1]}`
            )
            .attr("marker-mid", `url(#arrowhead-${team})`)
            .attr("class", team)
            .style("opacity", 0);
        coords = coords2;
    }

    // create dot
    createShape({
        id: id,
        typeIndex: typeIndex,
        coords: coords,
        legendBool: legendBool,
        team: team,
    });

    // only display text if two characters or less
    if (player && player.length <= 2) {
        g.append("text")
            .attr("x", coords[0])
            .attr("y", coords[1])
            .attr("text-anchor", "middle")
            .attr("dominant-baseline", "middle")
            .style("font-size", cfg[sport].fontSize)
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
    team,
}) {
    const ghostBool = id === "ghost-dot";
    let g = legendBool
        ? d3.select("#shot-type-legend").select("[id='" + id + "']")
        : d3.select("#dots").select("[id='" + id + "']");
    if (typeIndex == 0) {
        // dot is circle
        let circle = g
            .append("circle")
            .classed("ghost-shot", ghostBool)
            .attr("cx", coords[0])
            .attr("cy", coords[1])
            .style("fill", cfg[team])
            .style("stroke-width", "0.1px")
            .style("stroke", cfg[team + "Solid"]);
        if (legendBool) {
            // do not transition for legend
            circle.attr("r", cfg.legendR);
        } else {
            // start with radius 1
            circle.attr("r", 1);
            // tranform it to have radius 0 with no transition
            dotSizeHandler(id, 0, 1, 0);
            // tranform to correct radius
            dotSizeHandler(
                id,
                pointTwoBool || ghostBool
                    ? cfg[sport].circleR / 2
                    : cfg[sport].circleR,
                1,
                cfg.newDotDuration
            );
        }
    } else {
        // dot is not circular, instead is a polygon
        const sides = typeIndex + 2;
        if (legendBool) {
            // do not transition for legend
            g.append("polygon").attr(
                "points",
                polygon(coords[0], coords[1], cfg.legendR, sides)
            );
        } else {
            // start with radius 1
            g.append("polygon")
                .classed("ghost-shot", ghostBool)
                .style("fill", cfg[team])
                .style("stroke-width", "0.05px")
                .style("stroke", cfg[team + "Solid"])
                .attr("points", polygon(coords[0], coords[1], 1, sides));
            // tranform it to have radius 0 with no transition
            dotSizeHandler(id, 0, 1, 0);
            // tranform to correct radius
            dotSizeHandler(
                id,
                pointTwoBool || ghostBool
                    ? cfg[sport].polyR / 2
                    : cfg[sport].polyR,
                1,
                cfg.newDotDuration
            );
        }
    }
}

function polygon(cx, cy, r, sides) {
    const degrees = (2 * Math.PI) / sides;
    let points = "";
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

function dotSizeHandler(id, scaleDot, scaleText, duration) {
    const t = d3.transition().duration(duration);

    function enlarge(selection, scale) {
        if (!selection.empty()) {
            // https://stackoverflow.com/a/11671373
            const bbox = selection.node().getBBox();
            const xShift = (1 - scale) * (bbox.x + bbox.width / 2);
            const yShift = (1 - scale) * (bbox.y + bbox.height / 2);
            selection
                .transition(t)
                .attr(
                    "transform",
                    `translate(${xShift},${yShift}) scale(${scale},${scale})`
                );
        }
    }

    d3.select("#dots")
        .select("[id='" + id + "']")
        .selectAll("text")
        .call(enlarge, scaleText);

    const dots = d3
        .select("#dots")
        .select("[id='" + id + "']")
        .selectAll("circle,polygon");

    // scale two dots differently
    const secondDot = dots.filter(function(d, i) {
        return i === 1;
    });

    if (secondDot.empty()) {
        // only one dot
        dots.call(enlarge, scaleDot);
    } else {
        // scale second dot
        secondDot.call(enlarge, scaleDot);

        // scale first dot
        dots.filter(function(d, i) {
            return i === 0;
        }).call(enlarge, scaleDot / 2);
    }

    const line = d3
        .select("#dots")
        .select("[id='" + id + "']")
        .select("polyline");
    if (!line.empty()) {
        line.transition(t).style(
            "opacity",
            line.style("opacity") === "0.3" ? 0.7 : 0.3
        );
    }
}

export { createDot, polygon, dotSizeHandler };
