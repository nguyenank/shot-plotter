import { getHeaderRow } from "../table.js";

function createRow(data) {
    // transform info and add to data
    data["x"] = (data.coords[0] - 100).toFixed(2);
    data["y"] = (-1 * (data.coords[1] - 42.5)).toFixed(2);
    data["shotNumber"] =
        d3
            .select("#shot-table-body")
            .selectAll("tr")
            .size() + 1;
    data["team"] = d3.select(data.teamId).property("value");

    // create row
    var row = d3.select("#shot-table-body").append("tr");

    // select checkbox
    row.append("th")
        .attr("scope", "col")
        .append("input")
        .attr("type", "checkbox")
        .attr("value", data.id)
        .attr("id", data.id)
        .on("change", function() {
            var checked = d3.select(this).property("checked");
            selectHandler(data.id, checked, data.teamId);
        });

    // customizable rows
    for (let i of getHeaderRow()) {
        if (i === "shot") {
            row.append("th")
                .attr("scope", "col")
                .attr("class", "shot-number")
                .text(data.shotNumber);
        } else {
            row.append("td").text(data[i]);
        }
    }

    // trash can
    row.append("th")
        .attr("scope", "col")
        .append("i")
        .attr("class", "bi bi-trash")
        .on("click", () => deleteHandler(data.id));
    row.attr("id", data.id);
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

function selectHandler(id, checked, teamId) {
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
        row.attr(
            "class",
            teamId === "#blue-team-name" ? "blue-row" : "orange-row"
        );
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
