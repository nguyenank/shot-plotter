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
    createHeaderRow(headerRow, "Shot");
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
        .select("#teams")
        .selectAll("circle")
        .remove();
}

export { setUpTable, clearTable };
