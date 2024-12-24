export function customConfigSetup(config) {
    if (
        _.startsWith(config.id, "soccer") ||
        _.startsWith(config.id, "indoor-lacrosse")
    ) {
        return customWidthHeightSetup(config);
    }
}

function customWidthHeightSetup(config) {
    const urlParams = new URLSearchParams(window.location.search);
    const w = parseFloat(urlParams.get("width")) || config.appearance.width;
    const h = parseFloat(urlParams.get("height")) || config.appearance.height;
    config.appearance.width = w;
    config.appearance.height = h;
    config.goalCoords = [
        [0, h / 2],
        [w, h / 2],
    ];

    const ice_hockey_width = 200;
    const ice_hockey = {
        circleR: "2",
        polyR: "2.75",
        fontSize: "0.15", //rem
        strokeWidth: "0.5", //px
        heatMapScale: 1.25,
    };

    const scaleFactor = parseFloat(ice_hockey_width) / Math.max(w, h);
    for (const key in ice_hockey) {
        if (key === "heatMapScale") {
            config.appearance[key] = parseFloat(ice_hockey[key]) * scaleFactor;
        } else {
            const val = parseFloat(ice_hockey[key]) / scaleFactor;
            const suffix =
                key === "fontSize" ? "rem" : key === "strokeWidth" ? "px" : "";
            config.appearance[key] = `${val.toFixed(3)}${suffix}`;
        }
    }
    return config;
}
