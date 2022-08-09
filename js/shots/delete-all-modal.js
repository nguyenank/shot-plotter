import { clearTable } from "../shot-table/shot-table-functions.js";

function setUpDeleteAllModal(id) {
    let m = d3
        .select(id)
        .attr("class", "modal fade")
        .attr("aria-hidden", true)
        .attr("aria-labelledby", "customize-options")
        .append("div")
        .attr("class", "modal-dialog")
        .append("div")
        .attr("class", "modal-content");

    let h = m.append("div").attr("class", "modal-header");
    h.append("h5").attr("class", "modal-title").text("Delete All Events");
    h.append("button")
        .attr("type", "button")
        .attr("class", "btn-close")
        .attr("data-bs-dismiss", "modal")
        .attr("aria-label", "Close");

    let mb = m
        .append("div")
        .attr("class", "modal-body")
        .text("Are you sure? This will delete all recorded events.");

    m.append("div")
        .attr("class", "modal-footer")
        .append("button")
        .attr("type", "button")
        .attr("class", "grey-btn")
        .text("Delete All")
        .on("click", () => {
            clearTable();
            $(id).modal("hide"); // default js doesn't work for some reason
        });
}

export { setUpDeleteAllModal };
