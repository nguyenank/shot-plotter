import { createHeaderRow } from "../table.js";

function setUpModal(id) {
    var m = d3
        .select(id)
        .attr("class", "modal fade")
        .attr("data-bs-backdrop", "static")
        .attr("aria-hidden", true)
        .attr("aria-labelledby", "customize-options")
        .append("div")
        .attr("class", "modal-dialog")
        .append("div")
        .attr("class", "modal-content");

    var h = m.append("div").attr("class", "modal-header");
    h.append("h5")
        .attr("class", "modal-title")
        .text("Customize Options");
    h.append("button")
        .attr("type", "button")
        .attr("class", "btn-close")
        .attr("data-bs-dismiss", "modal")
        .attr("aria-label", "Close");

    var mb = m.append("div").attr("class", "modal-body");
    mb.append("div").text(
        "You can choose what columns appear in the table, and in what order."
    );

    var text = mb
        .append("div")
        .text("To toggle if a column is visible, click on the eye (");
    text.append("i").attr("class", "bi bi-eye");
    text.append("span").text("/");
    text.append("i").attr("class", "bi bi-eye-slash");
    text.append("span").text("). An eye (");
    text.append("i").attr("class", "bi bi-eye");
    text.append("span").text(") indicates the column is visible,");
    text.append("span").text(" while an eye with a slash through it (");
    text.append("i").attr("class", "bi bi-eye-slash");
    text.append("span").text(
        ") indicates the column is not visible. Only visible columns will be included in the .csv when downloaded."
    );

    text = mb
        .append("div")
        .text("To reorder columns, click and hold the drag handler (");
    text.append("i").attr("class", "bi bi-arrows-move");
    text.append("span").text(") to drag the column into the desired spot.");
    setUpModalBody(".modal-body");
    m.append("div")
        .attr("class", "modal-footer")
        .append("button")
        .attr("type", "button")
        .attr("class", "customize-btn")
        .text("Save Changes")
        .on("click", e => saveChanges(e));
}

function setUpModalBody(id) {
    // copied from table.js
    var columns = ["shot", "period", "team", "player", "type", "x", "y"];

    var v = d3
        .select(id)
        .append("ul")
        .attr("id", "reorder-columns")
        .selectAll("li")
        .data(columns)
        .enter()
        .append("li")
        .attr("class", "reorder-items");
    v.append("i")
        .attr("class", "bi bi-eye")
        .on("click", function() {
            var c = d3.select(this).attr("class");
            if (c === "bi bi-eye") {
                d3.select(this).attr("class", "bi bi-eye-slash");
            } else {
                d3.select(this).attr("class", "bi bi-eye");
            }
        });
    v.append("i").attr("class", "bi bi-arrows-move");
    v.append("span").text(d => d);

    var el = document.getElementById("reorder-columns");
    var sortable = new Sortable(el, { handle: ".bi-arrows-move" });
}

function saveChanges(e) {
    var l = [];
    d3.select("#reorder-columns")
        .selectAll("li")
        .each(function() {
            if (
                d3
                    .select(this)
                    .select("i")
                    .attr("class") === "bi bi-eye"
            ) {
                l.push(d3.select(this).text());
            }
        });
    createHeaderRow(l);
    $("#options-modal").modal("hide"); // default js doesn't work for some reason
}

export { setUpModal };
