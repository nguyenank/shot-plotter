import { setUpDeleteAllModal } from "./shots/delete-all-modal.js";
import { getDefaultDetails } from "./details/config-details.js";

function setUpTable() {
    d3.select("#shot-table")
        .append("thead")
        .append("tr");

    createHeaderRow(getDefaultDetails());

    d3.select("#shot-table")
        .append("tbody")
        .attr("id", "shot-table-body");

    setUpDeleteAllModal("#delete-all-modal");
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

function clearTable() {
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

export { setUpTable, clearTable, createHeaderRow, getHeaderRow };
