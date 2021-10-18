const cfg = {
    // team colors
    blueTeam: "rgba(53, 171, 169, 0.7)",
    orangeTeam: "rgba(234, 142, 72, 0.7)",
    greyTeam: "rgba(170, 170, 170, 0.7)",
    blueTeamSolid: "rgba(53, 171, 169, 1)",
    orangeTeamSolid: "rgba(234, 142, 72, 1)",
    greyTeamSolid: "rgba(170, 170, 170, 1)",
    // transition durations
    newRowDuration: 650,
    selectDuration: 150,
    deleteDuration: 150,
    newDotDuration: 100,
    // how much larger a dot becomes when selected
    selectedMultiplier: 1.5,
    legendR: 9,

    "basketball-nba": {
        width: 94,
        height: 50,
        // radii of various dots
        circleR: 1,
        polyR: 1.25,
        // font-size of dots
        fontSize: "0.075rem",
        // stroke-width of line
        strokeWidth: "0.25px",
    },

    hockey: {
        width: 200,
        height: 85,
        // radii of various dots
        circleR: 2,
        polyR: 2.5,
        // font-size of dots
        fontSize: "0.15rem",
        // stroke-width of line
        strokeWidth: "0.5px",
    },

    floorball: {
        // dimensions of playing area
        width: 40,
        height: 20,

        // radii of various dots
        circleR: 0.4,
        polyR: 0.5,
        fontSize: "0.03rem",
        // stroke-width of line
        strokeWidth: "0.1px",
    },
};

export { cfg };
