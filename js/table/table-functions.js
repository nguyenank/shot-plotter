import { updateTableFooter } from "./table.js";
import { dataStorage } from "../../setup.js";

function addRow(rowData) {
    dataStorage.push("rows", rowData);
}

function setRows(rows) {
    dataStorage.set("rows", rows);
}

function getRows() {
    return dataStorage.get("rows");
}

function addFilteredRow(row) {
    dataStorage.push("filteredRows", row);
}

function setFilteredRows(rows) {
    dataStorage.set("filteredRows", rows);
}

function getFilteredRows() {
    return dataStorage.get("filteredRows");
}

function getStartRow() {
    return dataStorage.get("startRow");
}

function setStartRow(i) {
    dataStorage.set("startRow", i);
}

function getEndRow() {
    return dataStorage.get("endRow");
}

function setEndRow(i) {
    dataStorage.set("endRow", i);
}

function getNumRows() {
    return dataStorage.get("numRows");
}

function setNumRows(i) {
    dataStorage.set("numRows", i);
}

function getNumFilteredRows() {
    return dataStorage.get("numFilteredRows");
}

function setNumFilteredRows(i) {
    dataStorage.set("numFilteredRows", i);
}

function getRowsPerPage() {
    return dataStorage.get("customSetup").rowsPerPage;
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
    setRows([]);
    setFilteredRows([]);
    setStartRow(0);
    setEndRow(0);
    setNumRows(0);
    setNumFilteredRows(0);
    updateTableFooter();

    d3.select("#customize-btn").classed("uninteractable", false);

    d3.select("#shot-table-body").selectAll("tr").remove();

    let dots = d3.select("#playing-area").select("#dots");

    dots.select("#normal").selectAll("*").remove();
    dots.select("#selected").selectAll("*").remove();

    d3.select("#heat-map").selectAll("*").remove();
}

export {
    addRow,
    setRows,
    getRows,
    addFilteredRow,
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
    getNumFilteredRows,
    setNumFilteredRows,
};
