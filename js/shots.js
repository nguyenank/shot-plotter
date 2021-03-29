const cfg = {
    circleR: 1.5,
    polyR: 1.75,
    largerCR: 2.75,
    largerPR: 3,
};

function setUpShots() {
    d3.select("#hockey-rink")
        .select("#outside-perimeter")
        .on("click", e => {
            createShotFromEvent(e);
        });
}

function createShotFromEvent(e) {
    // https://stackoverflow.com/a/29325047
    var teamId = d3.select("input[name='home-away']:checked").property("value");
    var homeBool = teamId === "#home-team";
    var id = uuidv4();
    var period = d3.select("input[name='period']:checked").property("value");

    // get player field
    var player = d3
        .select("#options")
        .select("#player-input")
        .property("value");

    // get shot type field
    var type = d3.select("#shot-type").property("value");

    createDot(teamId, homeBool, type, d3.pointer(e), id);
    createRow(period, homeBool, player, type, d3.pointer(e), id);
}

function createShotFromData(period, team, player, type, coords) {
    var teamId = team === "Home" ? "#home-team" : "#away-team";
    var homeBool = teamId === "#home-team";
    var id = uuidv4();
    createDot(teamId, homeBool, type, coords, id);
    createRow(period, homeBool, player, type, coords, id);
}

function createDot(teamId, homeBool, type, coords, id) {
    function getOptions() {
        var options = {};
        d3.select("#shot-type")
            .selectAll("option")
            .each(function(d, i) {
                options[d3.select(this).property("value")] = i;
            });
        return options;
    }
    var typeIndex = getOptions()[type];
    if (typeIndex == 0) {
        d3.select(teamId)
            .append("circle")
            .attr("cx", coords[0])
            .attr("cy", coords[1])
            .attr("r", cfg.circleR)
            .attr("id", id)
            .attr("class", homeBool ? "home-shot" : "away-shot");
    } else {
        var sides = typeIndex + 2;
        d3.select(teamId)
            .append("polygon")
            .attr(
                "points",
                createPolygon(coords[0], coords[1], cfg.polyR, sides)
            )
            .attr("id", id)
            .attr("cx", coords[0])
            .attr("cy", coords[1])
            .attr("sides", sides)
            .attr("class", homeBool ? "home-shot" : "away-shot");
    }
}

function createPolygon(cx, cy, r, sides) {
    var degrees = (2 * Math.PI) / sides;
    var points = "";
    for (let i = 0; i < sides; i++) {
        let x = (cx + r * Math.cos(degrees * i)).toFixed(3);
        let y = (cy + r * Math.sin(degrees * i)).toFixed(3);
        points = points + x + "," + y + " ";
    }
    return points;
}

function createRow(period, homeBool, player, type, coords, id) {
    var adjustedX = (coords[0] - 100).toFixed(2);
    var adjustedY = (coords[1] - 42.5).toFixed(2);

    // create row
    var row = d3
        .select("#shot-table-body")
        .append("tr")
        .attr("class", homeBool ? "home-row" : "away-row");

    // get shot number
    row.append("th")
        .attr("scope", "col")
        .text(
            d3
                .select("#shot-table-body")
                .selectAll("tr")
                .size()
        );
    row.append("td").text(period);
    row.append("td").text(homeBool ? "Home" : "Away");
    row.append("td").text(player);
    row.append("td").text(type);
    row.append("td").text(adjustedX);
    row.append("td").text(adjustedY);
    row.append("td")
        .append("i")
        .attr("class", "bi bi-trash-fill")
        .on("click", () => deleteHandler(id));
    row.attr("id", id);
    row.on("mouseover", () => {
        dotSizeHandler(id, true);
    });
    row.on("mouseout", () => {
        dotSizeHandler(id, false);
    });
}

function dotSizeHandler(id, largerBool) {
    var d = d3.select("#teams").select("[id='" + id + "']");
    var r;
    let circleBool = d.node().tagName === "circle";
    if (circleBool) {
        r = largerBool ? cfg.largerCR : cfg.circleR;
        d.transition()
            .duration(75)
            .attr("r", r);
    } else {
        r = largerBool ? cfg.largerPR : cfg.polyR;
        d.transition()
            .duration(75)
            .attr(
                "points",
                createPolygon(
                    Number(d.attr("cx")),
                    Number(d.attr("cy")),
                    r,
                    Number(d.attr("sides"))
                )
            );
    }
}

function deleteHandler(id) {
    d3.select("#shot-table-body")
        .select("[id='" + id + "']")
        .remove();
    d3.select("#teams")
        .select("[id='" + id + "']")
        .remove();

    d3.select("#shot-table-body")
        .selectAll("th")
        .each(function(d, i) {
            d3.select(this).text(i + 1);
        });
}

export { setUpShots, createShotFromData };
