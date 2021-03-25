function setUpRink(data) {
    d3.select("#hockey-rink")
        .node()
        .append(data.documentElement);

    var maxWidth =
        window.innerWidth >= 768 ? window.innerWidth * 0.75 : window.innerWidth;

    // floor to 0.5
    var resize = (
        (Math.floor(maxWidth / 200) + Math.round(maxWidth / 200)) /
        2
    ).toFixed(1);
    d3.select("#hockey-rink-svg")
        .attr("width", resize * 200 + 20)
        .attr("height", resize * 85 + 20);

    var transform = d3.select("#hockey-rink").select("#transformations");
    transform.attr(
        "transform",
        "translate(10,10) scale(" + resize + "," + resize + ")"
    );
}

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
    createHeaderRow(headerRow, "Player #");
    createHeaderRow(headerRow, "X");
    createHeaderRow(headerRow, "Y");

    d3.select("#shot-table")
        .append("tbody")
        .attr("id", "shot-table-body");
}

function setUp(data) {
    setUpRink(data);
    setUpTable();
}

export { setUp };
