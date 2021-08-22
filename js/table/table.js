import { setUpDeleteAllModal } from "../shots/delete-all-modal.js";
import { getDefaultDetails } from "../details/config-details.js";
import {
    getRows,
    getHeaderRow,
    setStartRow,
    setEndRow,
    getStartRow,
    getEndRow,
} from "./table-functions.js";
import { createRowFromData } from "./row.js";
import { cfg } from "./config-table.js";

function setUpTable() {
    sessionStorage.setItem("rows", JSON.stringify([]));
    setStartRow(0);
    setEndRow(0);

    d3.select("#shot-table")
        .append("thead")
        .append("tr");

    createHeaderRow(getDefaultDetails());

    d3.select("#shot-table")
        .append("tbody")
        .attr("id", "shot-table-body");

    d3.select("#shot-table")
        .append("tfoot")
        .append("tr");

    var footerRow = d3
        .select("#shot-table")
        .select("tfoot")
        .select("tr")
        .attr("class", "small-text");

    var tableWidth = getHeaderRow().length;
    footerRow
        .append("td")
        .attr("colspan", tableWidth / 2)
        .attr("id", "table-description");
    var nav = footerRow
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
    var nav = d3.select(id);
    nav.selectAll("*").remove();
    if (getStartRow() > 1) {
        let b = nav.append("button").attr("class", "grey-btn");
        b.append("i").attr("class", "bi bi-chevron-double-left");
        b.append("span").text("Prev");

        b.on("click", function() {
            setStartRow(getStartRow() - cfg.pageSize);
            setEndRow(getStartRow() + cfg.pageSize - 1);
            createPage(getStartRow(), getEndRow());
            updateTableFooter();
        });
    }
    nav.append("span").text(
        `  Page ${parseInt((getStartRow() - 1) / cfg.pageSize) + 1}  `
    );
    if (getRows().length !== parseInt(getEndRow())) {
        let b = nav.append("button").attr("class", "grey-btn");
        b.append("span").text("Next");
        b.append("i").attr("class", "bi bi-chevron-double-right");

        b.on("click", function() {
            let end =
                getEndRow() + cfg.pageSize < getRows().length
                    ? getEndRow() + cfg.pageSize
                    : getRows().length;
            setStartRow(getStartRow() + cfg.pageSize);
            setEndRow(end);
            createPage(getStartRow(), end);
            updateTableFooter();
        });
    }
}

function updateTableDescription(id = "#table-description") {
    let totalRowCount = getRows().length;
    let startRow = d3
        .select(id)
        .attr("colspan", getHeaderRow().length / 2)
        .text(
            `Displaying ${getStartRow()} - ${getEndRow()} of ${totalRowCount} rows.`
        );
}

function createHeaderRow(details) {
    var headerRow = d3
        .select("#shot-table")
        .select("thead")
        .select("tr");
    // clear row
    headerRow.selectAll("*").remove();

    var columns = [{ title: "" }, ...details]; // for check box
    for (let col of columns) {
        var c = headerRow
            .append("th")
            .attr("scope", "col")
            .text(col.title);
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

function createPage(startRow, endRow) {
    d3.select("#shot-table-body")
        .selectAll("tr")
        .remove();

    var rows = getRows().slice(startRow - 1, endRow);

    for (let { id, rowData, specialData, selected } of rows) {
        createRowFromData(id, rowData, specialData, selected);
    }
}

export { setUpTable, createHeaderRow, updateTableFooter, createPage };
