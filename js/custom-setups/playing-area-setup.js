import {
    sport,
    cfgSportA,
    dataStorage,
    cfgSportGoalCoords,
    setCfgSportGoalCoords,
} from "../../setup.js";
import { setRows, getRows } from "../table/table-functions.js";
import { minMaxes } from "./min-max.js";

export function customPlayingAreaSetup() {
    if (_.startsWith(sport, "soccer") && !_.startsWith(sport, "soccer-net")) {
        customSoccerPlayingAreaSetup();
    } else if (_.startsWith(sport, "indoor-lacrosse")) {
        customIndoorLacrossePlayingAreaSetup();
    } else if (sport === "ice-hockey-iihf") {
        customIceHockeyPlayingAreaSetup();
    }
}

function customSoccerPlayingAreaSetup() {
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
                    halfh - parseFloat(row.rowData.y),
                ];
                if (row.specialData.coords2) {
                    row.specialData.coords2 = [
                        halfw + parseFloat(row.rowData.x2),
                        halfh - parseFloat(row.rowData.y2),
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

    setCfgSportGoalCoords([
        [0, halfh],
        [w, halfh],
    ]);

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

function customIndoorLacrossePlayingAreaSetup() {
    const minMax = minMaxes[sport];

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

    const goalLine = 12;
    setCfgSportGoalCoords([
        [goalLine, halfh],
        [w - goalLine, halfh],
    ]);

    if (w !== 0 && h !== 0 && (storedWidth !== w || storedHeight !== h)) {
        dataStorage.set("width", w);
        dataStorage.set("height", h);
        let rows = getRows();
        if (rows) {
            for (let row of rows) {
                // readjust coords
                row.specialData.coords = [
                    halfw + parseFloat(row.rowData.x),
                    halfh - parseFloat(row.rowData.y),
                ];
                if (row.specialData.coords2) {
                    row.specialData.coords2 = [
                        halfw + parseFloat(row.rowData.x2),
                        halfh - parseFloat(row.rowData.y2),
                    ];
                }
            }
            setRows(rows);
        }
    }

    const svg = d3.select(`#${sport}-svg`);
    svg.attr("viewBox", `-1 -1 ${w + 2} ${h + 2}`);

    const borderPath = `
    M 0 28
    A 28 28 0 0 1 28 0
    L ${w - 28} 0
    A 28 28 0 0 1 ${w} 28
    L ${w} ${h - 28}
    A 28 28 0 0 1 ${w - 28} ${h}
    L 28 ${h}
    A 28 28 0 0 1 0 ${h - 28}
    L 0 28
    `;

    const trans = svg.select("#transformations");

    trans.select("clipPath").select("path").attr("d", borderPath);
    trans.select("#background").attr("d", borderPath);
    trans.select("#outside-perimeter").attr("d", borderPath);

    trans
        .select("#center-line")
        .attr("y2", h)
        .attr("x1", halfw)
        .attr("x2", halfw);
    trans.select("#center-dot").attr("cx", halfw).attr("cy", halfh);
    trans.select("#dotted-circle").attr("cx", halfw).attr("cy", halfh);
    trans.select("#outer-central-circle").attr("cx", halfw).attr("cy", halfh);

    trans
        .select("#line-change-area")
        .attr(
            "d",
            `M ${halfw - 36} 0 L ${halfw - 36} 3 L ${halfw + 36} 3 L ${
                halfw + 36
            } 0`
        );

    trans
        .select("#timer-crease")
        .attr("d", `M ${halfw - 10} ${h} A 10 10 0 0 1 ${halfw + 10} ${h}`);

    for (const dir of ["left", "right"]) {
        const ga = trans.select(`#${dir}-side`);
        if (dir === "right") {
            ga.attr("transform", `translate(${w} ${h}) rotate(180)`);
        }

        ga.select(`#${dir}-restraining-line`)
            .attr("y2", h)
            .attr("x1", halfw - 42.5)
            .attr("x2", halfw - 42.5);

        ga.select(`#${dir}-upper-faceoff-dot`).attr("cx", halfw - 42.5 - 15);

        ga.select(`#${dir}-lower-faceoff-dot`)
            .attr("cx", halfw - 42.5 - 15)
            .attr("cy", h - 15);

        ga.select(`#${dir}-goal-line`)
            .attr("y1", halfh - 9.25)
            .attr("y2", halfh + 9.25);

        const halfgoal = 4.75 / 2;
        const goal_depth = Math.sqrt(4.5 ** 2 - halfgoal ** 2);
        ga.select(`#${dir}-goal-net`).attr(
            "d",
            `M ${goalLine} ${halfh - halfgoal}
                 L ${goalLine - goal_depth} ${halfh}
                 L ${goalLine} ${halfh + halfgoal}`
        );

        const intersect = Math.sqrt(9.25 ** 2 - (goal_depth - 1) ** 2);
        ga.select(`#${dir}-goal-crease`).attr(
            "d",
            `M ${goalLine - goal_depth - 1} ${halfh - intersect}
             A 9.25 9.25 0 1 1  ${goalLine - goal_depth - 1} ${
                halfh + intersect
            }
             Z`
        );
    }
}

function customIceHockeyPlayingAreaSetup() {
    const minMax = minMaxes[sport];

    let w = cfgSportA.width;
    let h = cfgSportA.height;
    let crad = cfgSportA.cornerRadius;
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
    if (crad < minMax.minCornerRadius || crad > minMax.maxCornerRadius) {
        errorString.push(
            `Specified corner radius (${crad}) not within permitted range [${minMax.minCornerRadius}, ${minMax.maxCornerRadius}].`
        );
        crad = 0;
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

    const iihfGoalLineDistance = 4;
    setCfgSportGoalCoords([
        [iihfGoalLineDistance, halfh],
        [w - iihfGoalLineDistance, halfh],
    ]);

    if (w !== 0 && h !== 0 && (storedWidth !== w || storedHeight !== h)) {
        dataStorage.set("width", w);
        dataStorage.set("height", h);
        let rows = getRows();
        if (rows) {
            for (let row of rows) {
                // readjust coords
                console.log(row);
                row.specialData.coords = [
                    halfw + parseFloat(row.rowData.x),
                    halfh - parseFloat(row.rowData.y),
                ];
                if (row.specialData.coords2) {
                    row.specialData.coords2 = [
                        halfw + parseFloat(row.rowData.x2),
                        halfh - parseFloat(row.rowData.y2),
                    ];
                }
            }
            setRows(rows);
        }
    }

    const svg = d3.select(`#${sport}-svg`);
    svg.attr("viewBox", `-1 -1 ${w + 2} ${h + 2}`);

    const borderPath = `
    M 0 ${crad}
    A ${crad} ${crad} 0 0 1 ${crad} 0
    L ${w - crad} 0
    A ${crad} ${crad} 0 0 1 ${w} ${crad}
    L ${w} ${h - crad}
    A ${crad} ${crad} 0 0 1 ${w - crad} ${h}
    L ${crad} ${h}
    A ${crad} ${crad} 0 0 1 0 ${h - crad}
    L 0 ${crad}
    `;

    const trans = svg.select("#transformations");

    trans.selectAll("clipPath").selectAll("path").attr("d", borderPath);
    trans.select("#background").attr("d", borderPath);
    trans.select("#outside-perimeter").attr("d", borderPath);

    trans.select("#center-dot").attr("cy", halfh);
    trans.select("#center-circle").attr("cy", halfh);
    trans
        .select("#center-line")
        .attr(
            "d",
            `M 30 0 L 30 ${halfh - 0.25} M 30 ${halfh + 0.25} L 30 ${h}`
        );

    trans
        .select("#officials-crease")
        .attr("d", `M 27 ${h} A 3 3 0 0 1 33 ${h}`);

    for (const dir of ["left", "right"]) {
        const ga = trans.select(`#${dir}-goalie-crease`);
        if (dir === "right") {
            ga.attr("transform", `translate(${w} ${h}) rotate(180)`);
        }

        ga.select(`#${dir}-trapezoid`).attr(
            "d",
            `M 4 ${halfh - 3.4} L 0 ${halfh - 4.3} M 4 ${halfh + 3.54} L 0 ${
                halfh + 4.3
            }`
        );

        ga.select(`#${dir}-goal-crease`).attr(
            "d",
            `M 4 ${halfh - 2.45 / 2}
            L 5.36 ${halfh - 2.45 / 2}
            A 1.83 1.83 0 0 1 5.36 ${halfh + 2.45 / 2}
            L 4 ${halfh + 2.45 / 2}`
        );

        ga.select(`#${dir}-goal-crease-markings`).attr(
            "d",
            `M 5.22 ${halfh - 2.45 / 2}
            L 5.22 ${halfh - 2.45 / 2 + 0.2}
            M 5.22  ${halfh + 2.45 / 2 - 0.2}
            L 5.22 ${halfh + 2.45 / 2}`
        );

        ga.select(`#${dir}-goal`).attr(
            "d",
            `
                  M 4 ${halfh - 0.915}
                  L 3.6 ${halfh - 0.915}
                  A 0.4 0.4 0 0 0 3.4 ${halfh - 0.515}
                  L 3.4 ${halfh + 0.515}
                  A 0.4 0.4 0 0 0 3.6 ${halfh + 0.915}
                  L 4 ${halfh + 0.915}

                  L 3.38 ${halfh + 1.025}
                  A 0.5 0.5 0 0 1 2.88 ${halfh + 0.525}
                  L 2.88 ${halfh - 0.525}
                  A 0.5 0.5 0 0 1 3.38 ${halfh - 1.025}
                  L 4 ${halfh - 0.915}`
        );
    }

    const faceoffDots = trans.select("#faceoff-dots");
    faceoffDots
        .select("#top-left-dot")
        .attr("transform", `translate(24, ${halfh - 7})`);
    faceoffDots
        .select("#top-right-dot")
        .attr("transform", `translate(36, ${halfh - 7})`);
    faceoffDots
        .select("#bottom-left-dot")
        .attr("transform", `translate(24, ${halfh + 7})`);
    faceoffDots
        .select("#bottom-right-dot")
        .attr("transform", `translate(36, ${halfh + 7})`);

    const faceOffCircles = trans.select("#faceoff-circles");
    faceOffCircles
        .select("#top-left-circle")
        .attr("transform", `translate(10, ${halfh - 7})`);
    faceOffCircles
        .select("#top-right-circle")
        .attr("transform", `translate(50, ${halfh - 7})`);
    faceOffCircles
        .select("#bottom-left-circle")
        .attr("transform", `translate(10, ${halfh + 7})`);
    faceOffCircles
        .select("#bottom-right-circle")
        .attr("transform", `translate(50, ${halfh + 7})`);
}
