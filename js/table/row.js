import { addRow, getRows, getHeaderRow } from "./table-functions.js";

function createRow(rowData, { id, teamId, numberCol }) {
    // add row to sessionStorage
    addRow(rowData);

    // create row
    var row = d3.select("#shot-table-body").append("tr");

    // create select checkbox
    row.append("th")
        .attr("scope", "col")
        .append("input")
        .attr("type", "checkbox")
        .attr("value", id)
        .attr("id", id)
        .on("change", function() {
            var checked = d3.select(this).property("checked");
            selectHandler(id, checked, teamId ? teamId : "#grey");
        });

    let headerRow = getHeaderRow().map(item => item.id);
    _.pull(headerRow, null);

    // row data
    headerRow.forEach(item => {
        if (item === "shot-number") {
            row.append("th")
                .attr("scope", "col")
                .attr("class", "shot-number")
                .text(rowData[item]);
        } else {
            row.append("td").text(rowData[item]);
        }
    });

    // trash can
    row.append("th")
        .attr("scope", "col")
        .append("i")
        .attr("class", "bi bi-trash")
        .on("click", () => deleteHandler(id));
    row.attr("id", id);
    row.attr("selected", false);
}

function dotSizeHandler(id, scale) {
    function enlarge() {
        // https://stackoverflow.com/a/11671373
        var bbox = d3
            .select(this)
            .node()
            .getBBox();
        var xShift = (1 - scale) * (bbox.x + bbox.width / 2);
        var yShift = (1 - scale) * (bbox.y + bbox.height / 2);
        d3.select(this).attr(
            "transform",
            `translate(${xShift},${yShift}) scale(${scale},${scale})`
        );
    }
    d3.select("#dots")
        .select("[id='" + id + "']")
        .selectAll("circle")
        .each(enlarge);
    d3.select("#dots")
        .select("[id='" + id + "']")
        .selectAll("polygon")
        .each(enlarge);
    let line = d3
        .select("#dots")
        .select("[id='" + id + "']")
        .select("polyline");
    if (!line.empty()) {
        if (line.style("opacity") === "0.3") {
            line.style("opacity", 0.7);
        } else {
            line.style("opacity", 0.3);
        }
    }
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
            teamId === "#blue-team-name"
                ? "blue-row"
                : teamId === "#grey"
                ? "grey-row"
                : "orange-row"
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
