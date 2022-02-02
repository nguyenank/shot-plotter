import { updateTableFooter } from "./table.js";
function addRow(rowData) {
    sessionStorage.setItem("rows", JSON.stringify([...getRows(), rowData]));
}

function setRows(rows) {
    sessionStorage.setItem("rows", JSON.stringify(rows));
}

function getRows() {
    return JSON.parse(sessionStorage.getItem("rows"));
}

function setFilteredRows(rows) {
    sessionStorage.setItem("filteredRows", JSON.stringify(rows));
}

function getFilteredRows() {
    return JSON.parse(sessionStorage.getItem("filteredRows"));
}

function getStartRow() {
    return parseInt(sessionStorage.getItem("startRow"));
}

function setStartRow(i) {
    sessionStorage.setItem("startRow", i);
}

function getEndRow() {
    return parseInt(sessionStorage.getItem("endRow"));
}

function setEndRow(i) {
    sessionStorage.setItem("endRow", i);
}

function getNumRows() {
    return parseInt(sessionStorage.getItem("numRows"));
}

function setNumRows(i) {
    sessionStorage.setItem("numRows", i);
}

function getRowsPerPage() {
    return parseInt(sessionStorage.getItem("rowsPerPage"));
}

function setRowsPerPage(i) {
    sessionStorage.setItem("rowsPerPage", i);
}

function getHeaderRow() {
    let l = [];
    d3.select("#shot-table")
        .select("thead")
        .selectAll("th")
        .each(function () {
            let dataId = d3.select(this).attr("data-id");
            let dataType = d3.select(this).attr("data-type");
            l.push({ id: dataId, type: dataType });
        });
    return l;
}

function clearTable() {
    sessionStorage.setItem("rows", JSON.stringify([]));
    setStartRow(0);
    setEndRow(0);
    setNumRows(0);
    updateTableFooter();

    d3.select("#customize-btn").classed("uninteractable", false);

    d3.select("#shot-table-body").selectAll("tr").remove();

    let dots = d3.select("#playing-area").select("#dots");

    dots.select("#normal").selectAll("*").remove();
    dots.select("#selected").selectAll("*").remove();

    d3.select("#heat-map").selectAll("*").remove();
}

export {
    setRows,
    getRows,
    setFilteredRows,
    getFilteredRows,
    getHeaderRow,
    clearTable,
    getStartRow,
    getEndRow,
    setStartRow,
    setEndRow,
    getNumRows,
    setNumRows,
    getRowsPerPage,
    setRowsPerPage,
};
