import { cfgSportA } from "../../setup.js";

export function onClickGuide(e) {
    const type = d3
        .select('input[name="guide-widget"]:checked')
        .property("value");
    const coords = d3.pointer(e);
    switch (type) {
        case "horizontal-line":
            createHorizontal(coords[1]);
            break;
        case "vertical-line":
            createVertical(coords[0]);
        default:
            break;
    }
}

function createHorizontal(y) {
    // horizontal line
    d3.select("#playing-area")
        .select("#guides")
        .append("line")
        .attr("x1", 0)
        .attr("x2", cfgSportA.width)
        .attr("y1", y)
        .attr("y2", y)
        .attr("stroke", "rgb(0,0,0,0.2)")
        .attr("stroke-width", cfgSportA.strokeWidth);
}

function createVertical(x) {
    // vertical line
    d3.select("#playing-area")
        .select("#guides")
        .append("line")
        .attr("x1", x)
        .attr("x2", x)
        .attr("y1", 0)
        .attr("y2", cfgSportA.height)
        .attr("stroke", "rgb(0,0,0,0.2)")
        .attr("stroke-width", cfgSportA.strokeWidth);
}
