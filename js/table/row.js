import {
    getRows,
    getHeaderRow,
    setStartRow,
    getStartRow,
    setEndRow,
    getEndRow,
    setRows,
    getNumRows,
    setNumRows,
    getRowsPerPage,
} from "./table-functions.js";
import { updateTableFooter, createPage } from "./table.js";
import { cfg } from "./config-table.js";

function createNewRow(id, rowData, specialData) {
    // add row to sessionStorage
    setRows([
        ...getRows(),
        { id: id, rowData: rowData, specialData: specialData, selected: false },
    ]);

    var numRows = getNumRows() + 1;
    setNumRows(numRows);

    if (numRows == 1) {
        // first row
        setStartRow(1);
    }

    if (numRows - getStartRow() < getRowsPerPage()) {
        // continue adding to current page
        setEndRow(numRows);
        createRowFromData(id, rowData, specialData, false);
    } else {
        // switch to last page
        let startRow =
            getRowsPerPage() === 1 ? numRows : numRows - getRowsPerPage() + 1;
        setStartRow(startRow);
        setEndRow(numRows);

        d3.select("#shot-table-body")
            .selectAll("tr")
            .remove();

        createPage(startRow, numRows);
    }

    updateTableFooter();
}

function createRowFromData(id, rowData, { teamId, numberCol }, selected) {
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
            setRows(
                getRows().map(function(row) {
                    if (row.id === id) {
                        row.selected = checked;
                    }
                    return row;
                })
            );
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

    if (selected) {
        row.select("input")
            .property("checked", true)
            .dispatch("change");
    }
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
    setRows(
        _.differenceBy(getRows(), [{ id: id }], "id").map(function(x, i) {
            x.rowData["shot-number"] = i + 1;
            return x;
        })
    );
    var numRows = getNumRows() - 1;
    setNumRows(numRows);

    if (getEndRow() > numRows) {
        // deleted row is from last page

        setEndRow(numRows);

        if (getEndRow() === 0) {
            // set start index to 0
            setStartRow(0);
        } else if (getStartRow() !== 1) {
            setStartRow(getStartRow() - 1);
        }
    } else if (getStartRow() === 1) {
        // deleted row is from first page
        if (getEndRow() === 1) {
            // only 1 row left on first page, switch to next page
            setStartRow(1);
            setEndRow(getRowsPerPage());
        } else {
            setEndRow(getEndRow() - 1);
        }
    } else {
        // deleted row is from middle page

        setStartRow(getStartRow() - 1);
        setEndRow(getEndRow() - 1);
    }

    updateTableFooter();

    d3.select("#shot-table-body")
        .select("[id='" + id + "']")
        .remove();
    d3.select("#dots")
        .select("[id='" + id + "']")
        .remove();

    createPage(getStartRow(), getEndRow());
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

export { createNewRow, createRowFromData };
