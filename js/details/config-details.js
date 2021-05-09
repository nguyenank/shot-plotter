const cfg = {
    detailClass: "detail-module",
    defaultDetails: [
        { type: "shot-number", title: "shot", noWidget: true },
        {
            type: "radio",
            class: "period-select",
            title: "period",
            id: "period", // id and name are the same
            options: [
                { value: "1", checked: true },
                { value: "2" },
                { value: "3" },
                { value: "OT" },
            ],
        },
        {
            type: "team",
            title: "team",
            class: "team-select",
            id: "team",
            blueTeamName: "Home",
            orangeTeamName: "Away",
            checked: "blue-team-select",
        },
        {
            type: "player",
            title: "player",
            id: "player-input",
            defaultValue: "",
        },
        {
            type: "shot-type",
            title: "type",
            id: "shot-type",
            options: [
                { value: "Shot", selected: true },
                { value: "Goal" },
                { value: "Block" },
                { value: "Miss" },
            ],
        },
        { type: "x", title: "x", noWidget: true },
        { type: "y", title: "y", noWidget: true },
    ],
};

export { cfg };
