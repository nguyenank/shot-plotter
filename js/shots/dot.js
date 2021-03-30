import { getOptionsObject } from "../options.js";
import { cfg } from "./config.js";

function createDot(svgId, homeBool, type, coords, id, legendBool) {
    var typeIndex = getOptionsObject()[type];
    if (typeIndex == 0) {
        d3.select(svgId)
            .append("circle")
            .attr("cx", coords[0])
            .attr("cy", coords[1])
            .attr("r", legendBool ? cfg.legendR : cfg.circleR)
            .attr("id", id)
            .attr(
                "fill",
                legendBool
                    ? cfg.legendColor
                    : colorShift(homeBool ? cfg.homeColor : cfg.awayColor, 0)
            );
    } else {
        var sides = typeIndex + 2;
        d3.select(svgId)
            .append("polygon")
            .attr(
                "points",
                polygon(
                    coords[0],
                    coords[1],
                    legendBool ? cfg.legendR : cfg.polyR,
                    sides
                )
            )
            .attr("id", id)
            .attr("cx", coords[0])
            .attr("cy", coords[1])
            .attr("sides", sides)
            .attr(
                "fill",
                legendBool
                    ? cfg.legendColor
                    : colorShift(
                          homeBool ? cfg.homeColor : cfg.awayColor,
                          sides
                      )
            );
    }
}

function polygon(cx, cy, r, sides) {
    var degrees = (2 * Math.PI) / sides;
    var points = "";
    for (let i = 0; i < sides; i++) {
        let x = (cx + r * Math.cos(degrees * i))
            .toFixed(3)
            .replace(/^-0.000$/, "0");
        let y = (cy + r * Math.sin(degrees * i))
            .toFixed(3)
            .replace(/^-0.000$/, "0");
        points = points + x + "," + y + " ";
    }
    return points;
}

function colorShift(color, modifier) {
    const scale = 15;
    if (modifier % 2 == 0) {
        color = color.map(x => Math.min(255, x + scale * modifier));
    } else {
        color = color.map(x => Math.min(255, x - scale * modifier));
    }

    let s = "rgba(";

    for (let i of color) {
        s += i + ",";
    }
    s += cfg.alpha + ")";
    return s;
}

export { createDot, polygon, colorShift };
