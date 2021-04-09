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

    m.append("div")
        .attr("class", "modal-body")
        .text("wheee custom options hell yeah!");
    setUpModalBody(".modal-body");
    m.append("div")
        .attr("class", "modal-footer")
        .append("button")
        .attr("type", "button")
        .attr("class", "btn btn-primary")
        .text("Save Changes");
}

function setUpModalBody(id) {
    // copied from table.js
    var columns = ["Shot", "Period", "Team", "Player", "Type", "X", "Y"];

    var v = d3
        .select(id)
        .append("ul")
        .attr("id", "reorder-columns")
        .selectAll("li")
        .data(columns)
        .enter()
        .append("li");
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

export { setUpModal };
