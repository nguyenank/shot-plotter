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
import { dotSizeHandler } from "../shots/dot.js";
import { cfg } from "../config.js";
import { sport } from "../../setup.js";

function createNewRow(id, rowData, specialData) {
    // add row to sessionStorage
    setRows([
        ...getRows(),
        { id: id, rowData: rowData, specialData: specialData, selected: false },
    ]);

    const numRows = getNumRows() + 1;
    setNumRows(numRows);

    if (numRows == 1) {
        // first row
        setStartRow(1);
        d3.select("#customize-btn").classed("uninteractable", true);
    }

    if (numRows - getStartRow() < getRowsPerPage()) {
        // continue adding to current page
        setEndRow(numRows);
        createRowFromData(id, rowData, specialData, false, id);
    } else {
        // switch to last page
        let startRow =
            getRowsPerPage() === 1 ? numRows : numRows - getRowsPerPage() + 1;
        setStartRow(startRow);
        setEndRow(numRows);

        d3.select("#shot-table-body")
            .selectAll("tr")
            .remove();

        createPage(startRow, numRows, id);
    }

    updateTableFooter();
}

function createRowFromData(
    id,
    rowData,
    { teamColor, numberCol, typeIndex },
    selected,
    newRow = null
) {
    // create row
    let row = d3.select("#shot-table-body").append("tr");

    teamColor = teamColor ? teamColor : "greyTeam";

    // create select checkbox
    row.append("th")
        .attr("scope", "col")
        .append("input")
        .attr("type", "checkbox")
        .attr("value", id)
        .attr("id", id)
        .on("change", function() {
            const checked = d3.select(this).property("checked");
            setRows(
                getRows().map(function(row) {
                    if (row.id === id) {
                        row.selected = checked;
                    }
                    return row;
                })
            );
            selectHandler(id, checked, teamColor, typeIndex !== 0);
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
    } else if (newRow) {
        // animate changing color when new row is added
        const t = d3.transition().duration(cfg.newRowDuration);
        row.style("background-color", cfg[teamColor]);
        row.transition(t).style("background-color", null);
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
    const numRows = getNumRows() - 1;
    setNumRows(numRows);

    if (numRows === 0) {
        d3.select("#customize-btn").classed("uninteractable", false);
    }

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

    const t = d3.transition().duration(cfg.deleteDuration);
    dotSizeHandler(id, 0, 0, cfg.deleteDuration);
    d3.select("#shot-table-body")
        .select("[id='" + id + "']")
        .transition(t)
        .remove();
    d3.select("#dots")
        .select("[id='" + id + "']")
        .transition(t)
        .remove();

    createPage(getStartRow(), getEndRow());
}

function selectHandler(id, checked, teamColor, polygonBool) {
    let row = d3.select("#shot-table-body").select("[id='" + id + "']");
    const t = d3.transition().duration(cfg.selectDuration);
    const radius = polygonBool ? cfg[sport].polyR : cfg[sport].circleR;
    if (checked) {
        // https://stackoverflow.com/a/23724356
        let toMove = d3
            .select("#dots")
            .select("[id='" + id + "']")
            .node();
        d3.select("#dots")
            .select("#selected")
            .append(() => toMove);
        dotSizeHandler(
            id,
            cfg.selectedMultiplier * radius,
            cfg.selectedMultiplier,
            cfg.selectDuration
        );
        row.transition(t).style("background-color", cfg[teamColor]);
    } else {
        const shotNumber =
            Number(
                d3
                    .select("#dots")
                    .select("[id='" + id + "']")
                    .attr("shot-number")
            ) + 1;

        let toMove = d3
            .select("#dots")
            .select("[id='" + id + "']")
            .node();
        d3.select("#dots")
            .select("#normal")
            .insert(() => toMove, "[shot-number='" + shotNumber + "']");
        dotSizeHandler(id, radius, 1, cfg.selectDuration);
        row.transition(t).style("background-color", null);
    }
}

export { createNewRow, createRowFromData };
