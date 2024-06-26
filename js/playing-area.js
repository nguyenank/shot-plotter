import { sport, cfgSportA, cfgSportCustomSetup } from "../setup.js";
import { customPlayingAreaSetup } from "./custom-setups/playing-area-setup.js";

function setUpPlayingArea() {
    if (cfgSportCustomSetup) {
        customPlayingAreaSetup();
    }
    // dimensions of padding, window and playing area
    const padding = 20;
    const maxWidth =
        window.innerWidth >= 768 ? window.innerWidth * 0.7 : window.innerWidth;
    const paWidth = cfgSportA.width;
    const paHeight = cfgSportA.height;
    const scalar = Math.max(paWidth, paHeight);

    // floor resizing factor to the nearest 0.5
    let resize = (
        (Math.floor((maxWidth - 2 * padding) / scalar) +
            Math.round((maxWidth - 2 * padding) / scalar)) /
        2
    ).toFixed(1);

    if (paWidth / paHeight < 1.3) {
        const adjFactor = 0.6 + (Math.max(paWidth / paHeight, 1) - 1);
        resize = (Number(resize) * adjFactor).toFixed(1);
    }

    d3.select(`#${sport}-svg`)
        .attr("viewBox", undefined)
        .attr("width", resize * paWidth + padding)
        .attr("height", resize * paHeight + padding);

    let dots = d3
        .select("#playing-area")
        .select("#transformations")
        .attr("clip-path", "url(#clipBorder)")
        .attr(
            "transform",
            "translate(10,10) scale(" + resize + "," + resize + ")"
        )
        .insert("svg:g", "#outside-perimeter")
        .attr("id", "dots");

    for (const id of ["ghost", "normal", "selected"]) {
        dots.append("svg:g").attr("id", id).style("visibility", "hidden");
    }

    d3.select("#transformations")
        .insert("g", "#outside-perimeter")
        .attr("id", "heat-map");
}

export { setUpPlayingArea };
