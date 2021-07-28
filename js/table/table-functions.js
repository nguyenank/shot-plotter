function addRow(rowData) {
    sessionStorage.setItem("rows", JSON.stringify([...getRows(), rowData]));
}

function getRows() {
    return JSON.parse(sessionStorage.getItem("rows"));
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

export { addRow, getRows, getHeaderRow, clearTable };
