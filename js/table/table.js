import { setUpDeleteAllModal } from "../shots/delete-all-modal.js";
import { getDefaultDetails } from "../../setup.js";
import {
    getRows,
    getHeaderRow,
    setStartRow,
    setEndRow,
    getStartRow,
    getEndRow,
    setNumRows,
    getNumRows,
    setRowsPerPage,
    getRowsPerPage,
} from "./table-functions.js";
import { createRowFromData } from "./row.js";
import { cfgDetails } from "../details/config-details.js";

function setUpTable() {
    sessionStorage.setItem("rows", JSON.stringify([]));
    setStartRow(0);
    setEndRow(0);
    setNumRows(0);
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
    if (getNumRows() !== getEndRow()) {
        // exists another page after; add next button
        let b = nav.append("button").attr("class", "grey-btn");
        b.append("span").text("Next");
        b.append("i").attr("class", "bi bi-chevron-double-right");

        b.on("click", function () {
            let end =
                getEndRow() + getRowsPerPage() < getNumRows()
                    ? getEndRow() + getRowsPerPage()
                    : getNumRows();
            setStartRow(getEndRow() + 1);
            setEndRow(end);
            createPage(getStartRow(), end);
            updateTableFooter();
        });
    }
}

function updateTableDescription(id = "#table-description") {
    let totalRowCount = getNumRows();
    let startRow = d3
        .select(id)
        .attr("colspan", getHeaderRow().length / 2)
        .text(
            `Displaying ${getStartRow()} - ${getEndRow()} of ${totalRowCount} rows.`
        );
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

    const columns = [{ title: "" }, ...details]; // for check box
    for (const col of columns) {
        let c = headerRow.append("th").attr("scope", "col").text(col.title);
        if (col.id) {
            c.attr("data-id", col.id);
        }
        c.attr("data-type", col.type);
    }

    // for trash can
    let r = headerRow.append("th").attr("scope", "col");
    r.append("i")
        .attr("class", "bi-trash-fill")
        .on("click", () => {
            new bootstrap.Modal(
                document.getElementById("delete-all-modal")
            ).show();
        });
}

function createFilterRow(details) {
    let filterRow = d3.select("#shot-table").select("thead").select("#filters");
    // clear row
    filterRow.selectAll("*").remove();

    // add blanks for check box & trash can
    const columns = [{ type: "blank" }, ...details, { type: "blank" }];
    for (const col of columns) {
        let c = filterRow.append("th").attr("scope", "col");

        switch (col.type) {
            case "radio":

            case "player":

            case "text-field":

            case "shot-type":

            case "dropdown":

            case "time":

            case "team":

            case "shot-number":

            case "x":

            case "y":

            case "distance-calc":

            case "value-calc":

            case "in-out":

            default:
                c.text(col.type);
        }
    }
}

function createPage(startRow, endRow, newRow = null) {
    d3.select("#shot-table-body").selectAll("tr").remove();

    const rows = getRows().slice(startRow - 1, endRow);

    for (const { id, rowData, specialData, selected } of rows) {
        createRowFromData(id, rowData, specialData, selected, newRow === id);
    }
}

export { setUpTable, createTableHeader, updateTableFooter, createPage };
