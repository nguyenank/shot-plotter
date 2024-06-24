import { sport, cfgSportA, cfgSportCustomSetup } from "../setup.js";

function generateCustomSoccerSVG() {
    console.log("hit");
    const inYards = _.endsWith(sport, "-yd");
    const w = cfgSportA.width;
    const h = cfgSportA.height;
    const halfw = w / 2;
    const halfh = h / 2;

    const goal = inYards ? 8 : 7.32;
    const halfgoal = goal / 2;
    const eighteenyd = inYards ? 18 : 16.5;
    const goalarea = inYards ? 6 : 5.5;
    const arc = inYards ? 8 : 7.312;

    const svg = d3.select(`#${sport}-svg`);
    svg.attr("viewBox", `-1 -1 ${w + 2} ${h + 2}`);

    const trans = svg.select("#transformations");

    trans.select("clipPath").select("rect").attr("width", w).attr("height", h);
    trans.select("#background").attr("width", w).attr("height", h);

    trans.select("#halfway-line").attr("d", `M ${halfw} 0 L ${halfw} ${h}`);
    trans.select("#halfway-circle").attr("cx", halfw).attr("cy", halfh);

    trans.select("#outside-perimeter").attr("width", w).attr("height", h);

    for (const dir of ["left", "right"]) {
        const ga = trans.select(`#${dir}-goal`);
        if (dir === "right") {
            ga.attr("transform", `translate(${w} ${h}) rotate(180)`);
        }

        ga.select(`#${dir}-eighteen-yd-box`).attr(
            "d",
            `M  0 ${halfh - halfgoal - eighteenyd}
             L 18 ${halfh - halfgoal - eighteenyd}
             L 18 ${halfh + halfgoal + eighteenyd}
             L  0 ${halfh + halfgoal + eighteenyd}`
        );

        ga.select(`#${dir}-goal-area`).attr(
            "d",
            `M 0 ${halfh - halfgoal - goalarea}
             L 6 ${halfh - halfgoal - goalarea}
             L 6 ${halfh + halfgoal + goalarea}
             L 0 ${halfh + halfgoal + goalarea}`
        );

        ga.select(`#${dir}-penalty-kick-mark`).attr("cy", halfh);

        ga.select(`#${dir}-goal-arc`).attr(
            "d",
            `M 18 ${halfh - arc}
             A 10 10 1 0 1 18 ${halfh + arc}
            `
        );

        ga.select(`#${dir}-goal-line`).attr(
            "d",
            `M 0 ${halfh - halfgoal}
             L 0 ${halfh + halfgoal}
            `
        );

        ga.select(`#${dir}-bottom-corner`).attr(
            "d",
            `M 0 ${h - 1}
             A 1 1 0 0 1 1 ${h}
            `
        );
    }
}

function setUpPlayingArea() {
    if (cfgSportCustomSetup) {
        if (_.startsWith(sport, "soccer-ifab")) {
            generateCustomSoccerSVG();
        }
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
        console.log(adjFactor);
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
