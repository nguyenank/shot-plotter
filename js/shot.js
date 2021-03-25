function setUpShots() {
    var transform = d3.select("#hockey-rink").select("#transformations");

    transform.append("g").attr("id", "home-team");
    transform.append("g").attr("id", "away-team");
    d3.select("#hockey-rink")
        .select("#outside-perimeter")
        .on("click", e => {
            clickHandler(e);
        });
}

function clickHandler(e) {
    var adjustedX = (d3.pointer(e)[0] - 100).toFixed(2);
    var adjustedY = (d3.pointer(e)[1] - 42.5).toFixed(2);

    // create dot
    d3.select("#home-team")
        .append("circle")
        .attr("cx", d3.pointer(e)[0])
        .attr("cy", d3.pointer(e)[1])
        .attr("r", 1.5)
        .style("fill", "rgba(169, 167, 254, .8)");

    // create row
    var row = d3.select("#shot-table-body").append("tr");

    row.append("th")
        .attr("scope", "col")
        .text(
            d3
                .select("#shot-table-body")
                .selectAll("tr")
                .size()
        );
    row.append("td").text("Home");
    row.append("td").text("42");
    row.append("td").text(adjustedX);
    row.append("td").text(adjustedY);
}

export { setUpShots };
