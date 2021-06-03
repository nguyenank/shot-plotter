const cfg = {
    detailClass: "detail-module",
    defaultDetails: [
        { type: "shot-number", title: "#", noWidget: true },
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
        { type: "x", title: "X", noWidget: true },
        { type: "y", title: "Y", noWidget: true },
    ],
};
function getDefaultDetails() {
    return _.cloneDeep(cfg.defaultDetails);
}
export { cfg, getDefaultDetails };
