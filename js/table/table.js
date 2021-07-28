import { setUpDeleteAllModal } from "../shots/delete-all-modal.js";
import { getDefaultDetails } from "../details/config-details.js";
import { getRows } from "./table-functions.js";

function setUpTable() {
    sessionStorage.setItem("rows", JSON.stringify([]));

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

    createFooterRow();

    setUpDeleteAllModal("#delete-all-modal");
}

function createFooterRow() {
    var footerRow = d3
        .select("#shot-table")
        .select("tfoot")
        .select("tr")
        .attr("class", "small-text");

    var t = footerRow.append("td").attr("colspan", 9); // TODO: make dynamic

    console.log(getRows());

    let totalRowCount = getRows().length;

    t.text(`Displaying ${1} - ${10} of ${totalRowCount} rows.`);
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

export { setUpTable, createHeaderRow };
