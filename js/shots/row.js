function createRow(period, homeBool, player, type, coords, id) {
    var adjustedX = (coords[0] - 100).toFixed(2);
    var adjustedY = (-1 * (coords[1] - 42.5)).toFixed(2);
    var shotNumber =
        d3
            .select("#shot-table-body")
            .selectAll("tr")
            .size() + 1;
    // create row
    var row = d3.select("#shot-table-body").append("tr");

    row.append("th")
        .attr("scope", "col")
        .append("input")
        .attr("type", "checkbox")
        .attr("value", id)
        .attr("id", id)
        .on("change", function() {
            var checked = d3.select(this).property("checked");
            selectHandler(id, checked, homeBool);
        });
    // get shot number
    row.append("th")
        .attr("scope", "col")
        .attr("class", "shot-number")
        .text(shotNumber);
    row.append("td").text(period);
    row.append("td").text(homeBool ? "Home" : "Away");
    row.append("td").text(player);
    row.append("td").text(type);
    row.append("td").text(adjustedX);
    row.append("td").text(adjustedY);
    row.append("th")
        .attr("scope", "col")
        .append("i")
        .attr("class", "bi bi-trash-fill")
        .on("click", () => deleteHandler(id));
    row.attr("id", id);
    row.attr("selected", false);
}

function dotSizeHandler(id, scale) {
    var d = d3.select("#dots").select("[id='" + id + "']");
    // https://stackoverflow.com/a/11671373
    var bbox = d.node().getBBox();
    var xShift = (1 - scale) * (bbox.x + bbox.width / 2);
    var yShift = (1 - scale) * (bbox.y + bbox.height / 2);
    d.attr(
        "transform",
        `translate(${xShift},${yShift}) scale(${scale},${scale})`
    );
}

function deleteHandler(id) {
    event.stopPropagation();
    d3.select("#shot-table-body")
        .select("[id='" + id + "']")
        .remove();
    d3.select("#dots")
        .select("[id='" + id + "']")
        .remove();
    d3.select("#shot-table-body")
        .selectAll("tr")
        .each(function(d, i) {
            d3.select(this)
                .select(".shot-number")
                .text(i + 1);
        });
    d3.select("#shot-table-body")
        .selectAll("tr")
        .each(function(d, i) {
            d3.select(this)
                .select(".shot-number")
                .text(i + 1);
            var id = d3.select(this).attr("id");
            d3.select("#dots")
                .select("[id='" + id + "']")
                .attr("shot-number", i + 1);
        });
}

function selectHandler(id, checked, homeBool) {
    var row = d3.select("#shot-table-body").select("[id='" + id + "']");
    if (checked) {
        // https://stackoverflow.com/a/23724356
        var toMove = d3
            .select("#dots")
            .select("[id='" + id + "']")
            .node();
        d3.select("#dots")
            .select("#selected")
            .append(() => toMove);
        dotSizeHandler(id, 1.5);
        row.attr("class", homeBool ? "home-row" : "away-row");
    } else {
        var shotNumber = d3
            .select("#dots")
            .select("[id='" + id + "']")
            .attr("shot-number");
        shotNumber = Number(shotNumber) + 1;

        var toMove = d3
            .select("#dots")
            .select("[id='" + id + "']")
            .node();
        d3.select("#dots")
            .select("#normal")
            .insert(() => toMove, "[shot-number='" + shotNumber + "']");
        dotSizeHandler(id, 1);
        row.attr("class", "");
    }
}

export { createRow };
