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

    hockey: {
        width: 200,
        height: 85,
        // radii of various dots
        circleR: 2,
        polyR: 2.5,
    },

    floorball: {
        // dimensions of playing area
        width: 40,
        height: 20,

        // radii of various dots
        circleR: 0.4,
        polyR: 0.5,
    },
};

export { cfg };
