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
    m.append("div")
        .attr("class", "modal-footer")
        .append("button")
        .attr("type", "button")
        .attr("class", "btn btn-primary")
        .text("Save Changes");
}

export { setUpModal };
