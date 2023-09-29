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
    setFilteredRows,
    setNumFilteredRows,
    getNumFilteredRows,
    getRowsPerPage,
} from "./table-functions.js";
import { getDetails } from "../details/details-functions.js";
import { filterRows } from "./filter.js";
import { updateTableFooter, createPage } from "./table.js";
import { heatMap } from "../toggles.js";
import { dotSizeHandler } from "../shots/dot.js";
import { cfgAppearance } from "../config-appearance.js";
import { cfgSportA } from "../../setup.js";

function createNewRow(id, rowData, specialData) {
    const numRows = getNumRows() + 1;
    setNumRows(numRows);

    const numFilteredRows = getNumFilteredRows() + 1;
    setNumFilteredRows(numFilteredRows);

    if (numFilteredRows == 1) {
        // first row
        setStartRow(1);
        d3.select("#customize-btn").classed("uninteractable", true);
    }

    if (numFilteredRows - getStartRow() < getRowsPerPage()) {
        // continue adding to current page
        setEndRow(numFilteredRows);
        createRowFromData(id, rowData, specialData, false, id);
    } else {
        // switch to last page
        let startRow =
            getRowsPerPage() === 1
                ? numFilteredRows
                : numFilteredRows - getRowsPerPage() + 1;
        setStartRow(startRow);
        setEndRow(numFilteredRows);

        d3.select("#shot-table-body").selectAll("tr").remove();

        createPage(startRow, numFilteredRows, id);
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
        .attr("scope", "row")
        .attr("class", "centered-cell")
        .append("input")
        .attr("type", "checkbox")
        .attr("value", id)
        .attr("id", id)
        .on("change", function () {
            const checked = d3.select(this).property("checked");
            setRows(
                getRows().map(function (row) {
                    if (row.id === id) {
                        row.selected = checked;
                    }
                    return row;
                })
            );
            selectHandler(id, checked, teamColor, typeIndex !== 0);
        });

    let headerRow = getHeaderRow().map((item) => ({
        item: item.id,
        editable: _.find(getDetails(), ["id", item.id])?.dataTableEditable,
    }));
    _.pullAllBy(headerRow, [{ item: null, editable: null }], "item");
    // row data
    headerRow.forEach(({ item, editable }) => {
        if (item === "shot-number") {
            row.append("th")
                .attr("scope", "col")
                .attr("class", "shot-number")
                .text(rowData[item]);
        } else {
            const entry = row.append("td");
            if (editable) {
                entry
                    .append("input")
                    .attr("type", "text")
                    .attr("class", "form-control")
                    .property("value", rowData[item])
                    .on("change", function (e) {
                        const rowId = d3
                            .select(this.parentNode.parentNode)
                            .attr("id");
                        const newValue = d3.select(this).property("value");
                        setRows(
                            getRows().map(function (row) {
                                if (row.id === rowId) {
                                    row.rowData[item] = newValue;
                                }
                                return row;
                            })
                        );

                        setFilteredRows(getRows());
                    });
            } else {
                entry.text(rowData[item]);
            }
        }
    });

    // trash can
    row.append("th")
        .attr("scope", "row")
        .attr("class", "centered-cell")
        .append("i")
        .attr("class", "bi bi-trash")
        .on("click", () => deleteHandler(id));
    row.attr("id", id);
    row.attr("selected", false);

    if (selected) {
        row.select("input").property("checked", true).dispatch("change");
    } else if (newRow) {
        // animate changing color when new row is added
        const t = d3.transition().duration(cfgAppearance.newRowDuration);
        row.style("background-color", cfgAppearance[teamColor]);
        row.transition(t).style("background-color", null);
    }
}

function deleteHandler(id) {
    event.stopPropagation();
    const rows = _.differenceBy(getRows(), [{ id: id }], "id").map(function (
        x,
        i
    ) {
        x.rowData["shot-number"] = i + 1;
        return x;
    });
    setRows(rows);

    setFilteredRows(filterRows(rows));

    const numRows = getNumRows() - 1;
    setNumRows(numRows);

    const numFilteredRows = getNumFilteredRows() - 1;
    setNumFilteredRows(numFilteredRows);

    if (numFilteredRows === 0) {
        d3.select("#customize-btn").classed("uninteractable", false);
    }

    if (getEndRow() > numFilteredRows) {
        // deleted row is from last page

        setEndRow(numFilteredRows);

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

    const t = d3.transition().duration(cfgAppearance.deleteDuration);
    dotSizeHandler(id, 0, 0, cfgAppearance.deleteDuration);
    d3.select("#shot-table-body")
        .select("[id='" + id + "']")
        .transition(t)
        .remove();
    d3.select("#dots")
        .select("[id='" + id + "']")
        .transition(t)
        .remove();
    heatMap();
    createPage(getStartRow(), getEndRow());
}

function selectHandler(id, checked, teamColor, polygonBool) {
    let row = d3.select("#shot-table-body").select("[id='" + id + "']");
    const t = d3.transition().duration(cfgAppearance.selectDuration);
    const radius = polygonBool ? cfgSportA.polyR : cfgSportA.circleR;
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
            cfgAppearance.selectedMultiplier * radius,
            cfgAppearance.selectedMultiplier,
            cfgAppearance.selectDuration
        );
        row.transition(t).style("background-color", cfgAppearance[teamColor]);
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
        dotSizeHandler(id, radius, 1, cfgAppearance.selectDuration);
        row.transition(t).style("background-color", null);
    }
}

export { createNewRow, createRowFromData };
