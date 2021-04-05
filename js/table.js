function setUpTable() {
    var headerRow = d3
        .select("#shot-table")
        .append("thead")
        .append("tr");
    var columns = [
        "", // for check box
        "Shot",
        "Period",
        "Team",
        "Player",
        "Type",
        "X",
        "Y",
        "", // for trash can
    ];

    createHeaderRow(headerRow, columns);

    d3.select("#shot-table")
        .append("tbody")
        .attr("id", "shot-table-body");
}

function createHeaderRow(headerRow, columns) {
    function createHeaderCol(headerRow, text) {
        headerRow
            .append("th")
            .attr("scope", "col")
            .text(text);
    }
    for (let col of columns) {
        createHeaderCol(headerRow, col);
    }
}

function clearTable() {
    d3.select("#shot-table-body")
        .selectAll("tr")
        .remove();
    d3.select("#hockey-rink-svg")
        .select("#dots")
        .selectAll("circle")
        .remove();
}

function getHeaderRow() {
    // returns header row in string, separated by commas
    var s = "";
    d3.select("#shot-table")
        .selectAll("th")
        .each(function() {
            let text = d3.select(this).text();
            if (text !== "") {
                s += text + ",";
            }
        });
    return s.slice(0, -1);
}

export { setUpTable, clearTable, getHeaderRow };
