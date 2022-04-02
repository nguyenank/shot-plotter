import { setUpDeleteAllModal } from "../shots/delete-all-modal.js";
import { getDefaultDetails } from "../../setup.js";
import {
    getFilteredRows,
    getHeaderRow,
    setStartRow,
    setEndRow,
    getStartRow,
    getEndRow,
    setNumRows,
    getNumRows,
    getNumFilteredRows,
    setNumFilteredRows,
    setRowsPerPage,
    getRowsPerPage,
    getRows,
} from "./table-functions.js";
import { createRowFromData } from "./row.js";
import { createFilterRow, clearFilters, existFilters } from "./filter.js";
import { cfgDetails } from "../details/config-details.js";

function setUpTable() {
    sessionStorage.setItem("rows", JSON.stringify([]));
    sessionStorage.setItem("filteredRows", JSON.stringify([]));
    sessionStorage.setItem("filters", JSON.stringify([]));
    setStartRow(0);
    setEndRow(0);
    setNumRows(0);
    setNumFilteredRows(0);
    setRowsPerPage(cfgDetails.defaultRowsPerPage);

    const thead = d3.select("#shot-table").append("thead");

    thead.append("tr").attr("id", "column-names");
    thead.append("tr").attr("id", "filters");

    createTableHeader(getDefaultDetails());

    d3.select("#shot-table").append("tbody").attr("id", "shot-table-body");

    d3.select("#shot-table").append("tfoot").append("tr");

    let footerRow = d3
        .select("#shot-table")
        .select("tfoot")
        .select("tr")
        .attr("class", "small-text");

    const tableWidth = getHeaderRow().length;
    footerRow
        .append("td")
        .attr("colspan", tableWidth / 2)
        .attr("id", "table-description");
    let nav = footerRow
        .append("td")
        .attr(
            "colspan",
            tableWidth % 2 == 0 ? tableWidth / 2 : tableWidth / 2 + 1
        )
        .attr("id", "table-navigation");

    updateTableFooter();

    setUpDeleteAllModal("#delete-all-modal");
}

function updateTableFooter() {
    updateTableDescription();
    updateTableNavigation();
}

function updateTableNavigation(id = "#table-navigation") {
    let nav = d3.select(id);
    nav.selectAll("*").remove();
    if (getStartRow() > 1) {
        // exists a page before; add prev button
        let b = nav.append("button").attr("class", "grey-btn");
        b.append("i").attr("class", "bi bi-chevron-double-left");
        b.append("span").text("Prev");

        b.on("click", function () {
            setStartRow(
                getStartRow() - getRowsPerPage() < 1
                    ? 1
                    : getStartRow() - getRowsPerPage()
            );
            setEndRow(getEndRow() - getRowsPerPage());
            createPage(getStartRow(), getEndRow());
            updateTableFooter();
        });
    }
    nav.append("span").text(
        `  Page ${parseInt((getEndRow() - 1) / getRowsPerPage()) + 1}  `
    );
    if (getNumFilteredRows() !== getEndRow()) {
        // exists another page after; add next button
        let b = nav.append("button").attr("class", "grey-btn");
        b.append("span").text("Next");
        b.append("i").attr("class", "bi bi-chevron-double-right");

        b.on("click", function () {
            let end =
                getEndRow() + getRowsPerPage() < getNumFilteredRows()
                    ? getEndRow() + getRowsPerPage()
                    : getNumFilteredRows();
            setStartRow(getEndRow() + 1);
            setEndRow(end);
            createPage(getStartRow(), end);
            updateTableFooter();
        });
    }
}

function updateTableDescription(id = "#table-description") {
    const numFilteredRows = getNumFilteredRows();
    const numRows = getNumRows();
    let text = `Displaying ${
        numFilteredRows === 0 ? 0 : getStartRow()
    } - ${getEndRow()} of ${numFilteredRows} rows`;

    if (existFilters()) {
        text += ` (filtered from ${numRows} rows)`;
    }
    text += ".";

    let startRow = d3
        .select(id)
        .attr("colspan", getHeaderRow().length / 2)
        .text(text);
}

function createTableHeader(details) {
    createHeaderRow(details);
    createFilterRow(details);
}

function createHeaderRow(details) {
    let headerRow = d3
        .select("#shot-table")
        .select("thead")
        .select("#column-names");
    // clear row
    headerRow.selectAll("*").remove();

    // for checkbox, use for filters
    const filterIconCell = headerRow
        .append("th")
        .attr("scope", "col")
        .attr("rowspan", "2")
        .attr("class", "row-span centered-cell");
    filterIconCell
        .append("i")
        .attr("class", "bi bi-funnel-fill")
        .on("click", function () {
            // toggle whether filterRow is visible or not
            const filterRow = d3.select("#filters");
            const headerRow = d3.select("#column-names").selectAll("th");
            const filterIcon = d3.select(this);
            const clearFiltersIcon = d3.select("#clear-filter-icon");
            if (filterRow.style("visibility") === "collapse") {
                filterRow.style("visibility", "visible");
                filterIcon.classed("open", true);
                // don't adjust padding for filter and trash can cells
                headerRow.each(function () {
                    const node = d3.select(this);
                    if (!node.classed("row-span")) {
                        node.style("padding-bottom", 0);
                    }
                });
                toggleClearFiltersIcon();
            } else {
                filterRow.style("visibility", "collapse");
                filterIcon.classed("open", false);
                headerRow.style("padding-bottom", "0.5rem");
                clearFiltersIcon.style("display", "none");
            }
        })
        .classed(
            "open",
            d3.select("#filters").style("visibility") !== "collapse"
        );

    filterIconCell
        .append("i")
        .attr("id", "clear-filter-icon")
        .attr("class", "bi bi-x-square-fill")
        .style("display", "none")
        .on("click", clearFilters);

    const columns = [{ title: "" }, ...details]; // for check box
    for (const col of details) {
        let c = headerRow.append("th").attr("scope", "col").text(col.title);
        if (col.id) {
            c.attr("data-id", col.id);
        }
        c.attr("data-type", col.type);
    }

    // for trash can
    let r = headerRow
        .append("th")
        .attr("scope", "col")
        .attr("rowspan", "2")
        .attr("class", "row-span centered-cell");
    r.append("i")
        .attr("class", "bi-trash-fill")
        .on("click", () => {
            new bootstrap.Modal(
                document.getElementById("delete-all-modal")
            ).show();
        });
}

export function toggleClearFiltersIcon() {
    const filterRow = d3.select("#filters");
    const clearFiltersIcon = d3.select("#clear-filter-icon");
    filterRow.style("visibility") === "collapse"
        ? clearFiltersIcon.style("display", "none")
        : existFilters()
        ? clearFiltersIcon.style("display", "block")
        : clearFiltersIcon.style("display", "none");
}

function createPage(startRow, endRow, newRow = null) {
    d3.select("#shot-table-body").selectAll("tr").remove();
    const rows = getFilteredRows().slice(startRow - 1, endRow);
    for (const { id, rowData, specialData, selected } of rows) {
        createRowFromData(id, rowData, specialData, selected, newRow === id);
    }
}

export { setUpTable, createTableHeader, updateTableFooter, createPage };
