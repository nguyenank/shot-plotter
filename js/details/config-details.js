const cfg = {
    detailClass: "detail-module",
    defaultDetails: [
        { type: "shot-number", title: "#", id: "shot-number", noWidget: true },
        {
            type: "radio",
            title: "Period",
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
            title: "Team",
            className: "team-select",
            id: "team",
            blueTeamName: "Home",
            orangeTeamName: "Away",
            checked: "blue-team-select",
        },
        {
            type: "player",
            title: "Player",
            id: "player-input",
            defaultValue: "",
        },
        {
            type: "shot-type",
            title: "Type",
            id: "shot-type",
            options: [
                { value: "Shot", selected: true },
                { value: "Goal" },
                { value: "Block" },
                { value: "Miss" },
            ],
        },
        {
            type: "time",
            title: "Game Time",
            id: "game-time",
            startTime: "60:00",
        },
        { type: "x", title: "X", id: "x", noWidget: true },
        { type: "y", title: "Y", id: "y", noWidget: true },
    ],
};
function getDefaultDetails() {
    return _.cloneDeep(cfg.defaultDetails);
}
export { cfg, getDefaultDetails };
