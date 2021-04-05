function setUpTable() {
    function createHeaderRow(headerRow, text) {
        headerRow
            .append("th")
            .attr("scope", "col")
            .text(text);
    }
    var headerRow = d3
        .select("#shot-table")
        .append("thead")
        .append("tr");
    createHeaderRow(headerRow, ""); // space for check box
    createHeaderRow(headerRow, "Shot");
    createHeaderRow(headerRow, "Period");
    createHeaderRow(headerRow, "Team");
    createHeaderRow(headerRow, "Player");
    createHeaderRow(headerRow, "Type");
    createHeaderRow(headerRow, "X");
    createHeaderRow(headerRow, "Y");
    createHeaderRow(headerRow, ""); // space for trash can

    d3.select("#shot-table")
        .append("tbody")
        .attr("id", "shot-table-body");
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
