import { updateTableDescription } from "./table.js";
function addRow(rowData) {
    sessionStorage.setItem("rows", JSON.stringify([...getRows(), rowData]));
}

function setRows(rows) {
    sessionStorage.setItem("rows", JSON.stringify(rows));
}

function getRows() {
    return JSON.parse(sessionStorage.getItem("rows"));
}

function getStartRow() {
    return sessionStorage.getItem("startRow");
}

function getEndRow() {
    return sessionStorage.getItem("endRow");
}

function setStartRow(i) {
    sessionStorage.setItem("startRow", i);
}

function setEndRow(i) {
    sessionStorage.setItem("endRow", i);
}

function getHeaderRow() {
    var l = [];
    d3.select("#shot-table")
        .select("thead")
        .selectAll("th")
        .each(function() {
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
    updateTableDescription();

    d3.select("#shot-table-body")
        .selectAll("tr")
        .remove();

    var dots = d3.select("#hockey-rink-svg").select("#dots");

    dots.select("#normal")
        .selectAll("*")
        .remove();
    dots.select("#selected")
        .selectAll("*")
        .remove();
}

export {
    setRows,
    getRows,
    getHeaderRow,
    clearTable,
    getStartRow,
    getEndRow,
    setStartRow,
    setEndRow,
};
