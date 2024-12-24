import { sport, cfgSportA, dataStorage } from "../../setup.js";
import { setRows, getRows } from "../table/table-functions.js";

export function customPlayingAreaSetup() {
    if (_.startsWith(sport, "soccer") && !_.startsWith(sport, "soccer-net")) {
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
    let h = cfgSportA.height;
    let errorString = [];
    if (w < minMax.minWidth || w > minMax.maxWidth) {
        errorString.push(
            `Specified width (${w}) not within permitted range [${minMax.minWidth}, ${minMax.maxWidth}].`
        );
        w = 0;
    }
    if (h < minMax.minHeight || h > minMax.maxHeight) {
        errorString.push(
            `Specified height (${h}) not within permitted range [${minMax.minHeight}, ${minMax.maxHeight}].`
        );
        h = 0;
    }
    if (h >= w && w != 0) {
        errorString.push(
            `Specified width (${w}) must be larger than specified height (${h}).`
        );
        h = 0;
    }

    if (errorString.length > 0) {
        const errorMessage = d3
            .select("#playing-area")
            .insert("div", "svg")
            .attr("class", "center")
            .attr("id", "custom-pa-error-message")
            .append("div");
        errorMessage
            .append("div")
            .text("ERROR: Invalid Dimensions")
            .attr("class", "bold");
        for (const line of errorString) {
            errorMessage.append("div").text(line);
        }
    }

    const storedWidth = dataStorage.get("width");
    const storedHeight = dataStorage.get("height");

    const halfw = w / 2;
    const halfh = h / 2;

    if (w !== 0 && h !== 0 && (storedWidth !== w || storedHeight !== h)) {
        dataStorage.set("width", w);
        dataStorage.set("height", h);
        let rows = getRows();
        if (rows) {
            for (let row of rows) {
                // readjust coords
                row.specialData.coords = [
                    halfw + parseFloat(row.rowData.x),
                    halfh + parseFloat(row.rowData.y),
                ];
                if (row.specialData.coords2) {
                    row.specialData.coords2 = [
                        halfw + parseFloat(row.rowData.x2),
                        halfh + parseFloat(row.rowData.y2),
                    ];
                }
            }
            setRows(rows);
        }
    }

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
