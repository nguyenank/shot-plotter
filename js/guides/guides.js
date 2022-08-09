import { cfgSportA } from "../../setup.js";
import {
    setNumGuides,
    getNumGuides,
    setGuides,
    getGuides
} from "./guide-table-functions.js";
import { createNewGuideRow } from "./guide-row.js";

export function onClickGuide(e) {
    const type = d3
        .select('input[name="guide-widget"]:checked')
        .property("value");
    const coords = d3.pointer(e);
    const id = uuidv4();

    let guide = { type: type, id: id };
    switch (type) {
        case "horizontal-line":
            guide.y = coords[1];
            break;
        case "vertical-line":
            guide.x = coords[0];

        default:
            break;
    }

    createGuideObject(guide);
    createNewGuideRow(guide);
}

export function createGuideObject(guide) {
    switch (guide.type) {
        case "horizontal-line":
            createHorizontal(guide.id, guide.y);
            break;
        case "vertical-line":
            createVertical(guide.id, guide.x);
        default:
            break;
    }
}

function createHorizontal(id, y) {
    // horizontal line
    d3.select("#playing-area")
        .select("#guides")
        .append("line")
        .attr("id", id)
        .attr("x1", 0)
        .attr("x2", cfgSportA.width)
        .attr("y1", y)
        .attr("y2", y)
        .attr("stroke", "black")
        .style("opacity", 0.2)
        .attr("stroke-width", cfgSportA.strokeWidth);
}

function createVertical(id, x) {
    // vertical line
    d3.select("#playing-area")
        .select("#guides")
        .append("line")
        .attr("id", id)
        .attr("x1", x)
        .attr("x2", x)
        .attr("y1", 0)
        .attr("y2", cfgSportA.height)
        .attr("stroke", "black")
        .style("opacity", 0.2)
        .attr("stroke-width", cfgSportA.strokeWidth);
}
