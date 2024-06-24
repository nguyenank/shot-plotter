import { sport, cfgSportA } from "../../setup.js";

export function customPlayingAreaSetup() {
    if (_.startsWith(sport, "soccer")) {
        customSoccerPlayingAreaSetup();
    }
}

function customSoccerPlayingAreaSetup() {
    const minMaxes = {
        "soccer-ifab-yd": {
            minWidth: 100,
            maxWidth: 130,
            minHeight: 50,
            maxHeight: 100,
        },
        "soccer-ifab-m": {
            minWidth: 90,
            maxWidth: 120,
            minHeight: 45,
            maxHeight: 90,
        },
        "soccer-ncaa": {
            minWidth: 115,
            maxWidth: 120,
            minHeight: 70,
            maxHeight: 75,
        },
    };
    const minMax = minMaxes[sport];
    const inYards = sport === "soccer-ncaa" || sport === "soccer-ifab-yd";
    let w = cfgSportA.width;
    console.log(w);
    w = w < minMax.minWidth || w > minMax.maxWidth ? 0 : w;
    let h = cfgSportA.height;
    console.log(h);
    h = h < minMax.minHeight || h > minMax.maxHeight || h >= w ? 0 : h;

    console.log(w, h);

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
             L ${eighteenyd} ${halfh - halfgoal - eighteenyd}
             L ${eighteenyd} ${halfh + halfgoal + eighteenyd}
             L  0 ${halfh + halfgoal + eighteenyd}`
        );

        ga.select(`#${dir}-goal-area`).attr(
            "d",
            `M 0 ${halfh - halfgoal - goalarea}
             L ${goalarea} ${halfh - halfgoal - goalarea}
             L ${goalarea} ${halfh + halfgoal + goalarea}
             L 0 ${halfh + halfgoal + goalarea}`
        );

        ga.select(`#${dir}-penalty-kick-mark`)
            .attr("cy", halfh)
            .attr("d", `M 12 ${halfh - 0.33} L 12 ${halfh + 0.33}`);

        ga.select(`#${dir}-goal-arc`).attr(
            "d",
            `M ${eighteenyd} ${halfh - arc}
             A 10 10 1 0 1 ${eighteenyd} ${halfh + arc}
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
