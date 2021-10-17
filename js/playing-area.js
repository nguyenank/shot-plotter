import { cfg } from "./config.js";

function setUpPlayingArea(sport, data) {
    d3.select("#playing-area")
        .node()
        .append(data.documentElement);

    // dimensions of window and playing area
    const maxWidth =
        window.innerWidth >= 768 ? window.innerWidth * 0.7 : window.innerWidth;
    const paWidth = cfg[sport].width;
    const paHeight = cfg[sport].height;
    const scalar = Math.max(paWidth, paHeight);

    // floor resizing factor to the nearest 0.5
    const resize = (
        (Math.floor(maxWidth / scalar) + Math.round(maxWidth / scalar)) /
        2
    ).toFixed(1);
    d3.select(`#${sport}-svg`)
        .attr("width", resize * paWidth + 20) // 20 fixed padding
        .attr("height", resize * paHeight + 20);

    d3.select("#playing-area")
        .select("#transformations")
        .attr(
            "transform",
            "translate(10,10) scale(" + resize + "," + resize + ")"
        );
}

export { setUpPlayingArea };
