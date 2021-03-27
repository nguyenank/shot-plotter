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
    createHeaderRow(headerRow, "X");
    createHeaderRow(headerRow, "Y");
    createHeaderRow(headerRow, ""); // space for trash can

    d3.select("#shot-table")
        .append("tbody")
        .attr("id", "shot-table-body");
}

export { setUpTable };
