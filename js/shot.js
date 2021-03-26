function setUpShots() {
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

    // https://stackoverflow.com/a/29325047
    var teamId = d3.select("input[name='home-away']:checked").property("value");
    var player = d3
        .select("#options")
        .select("#player-input")
        .property("value");

    var homeConfig = {
        name: "Home",
        color: "rgba(53, 171, 169, 0.7)",
        rowClass: "home-row",
    };
    var awayConfig = {
        name: "Away",
        color: "rgba(234, 142, 72, 0.7)",
        rowClass: "away-row",
    };

    var config = teamId === "#home-team" ? homeConfig : awayConfig;
    var id = uuidv4();
    d3.select(teamId)
        .append("circle")
        .attr("cx", d3.pointer(e)[0])
        .attr("cy", d3.pointer(e)[1])
        .attr("r", 1.5)
        .attr("id", id)
        .style("fill", config.color);

    // create row
    var row = d3
        .select("#shot-table-body")
        .append("tr")
        .attr("class", config.rowClass);

    row.append("th")
        .attr("scope", "col")
        .text(
            d3
                .select("#shot-table-body")
                .selectAll("tr")
                .size()
        );
    row.append("td").text(config.name);
    row.append("td").text(player);
    row.append("td").text(adjustedX);
    row.append("td").text(adjustedY);
    row.attr("id", id);
    row.on("mouseover", () => {
        d3.select("#teams")
            .select("[id='" + id + "']")
            .transition()
            .duration(75)
            .attr("r", 3);
    });
    row.on("mouseout", () => {
        d3.select("#teams")
            .select("[id='" + id + "']")
            .transition()
            .duration(75)
            .attr("r", 1.5);
    });
}

export { setUpShots };
