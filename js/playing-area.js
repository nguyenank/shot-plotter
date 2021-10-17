import { cfg } from "./config.js";
import { sport } from "../index.js";

function setUpPlayingArea(data) {
    d3.select("#playing-area")
        .node()
        .append(data.documentElement);

    // dimensions of padding, window and playing area
    const padding = 20;
    const maxWidth =
        window.innerWidth >= 768 ? window.innerWidth * 0.7 : window.innerWidth;
    const paWidth = cfg[sport].width;
    const paHeight = cfg[sport].height;
    const scalar = Math.max(paWidth, paHeight);

    // floor resizing factor to the nearest 0.5
    const resize = (
        (Math.floor((maxWidth - 2 * padding) / scalar) +
            Math.round((maxWidth - 2 * padding) / scalar)) /
        2
    ).toFixed(1);
    d3.select(`#${sport}-svg`)
        .attr("width", resize * paWidth + padding)
        .attr("height", resize * paHeight + padding);

    d3.select("#playing-area")
        .select("#transformations")
        .attr(
            "transform",
            "translate(10,10) scale(" + resize + "," + resize + ")"
        );
}

export { setUpPlayingArea };
