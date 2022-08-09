import { clearTable } from "../shot-table/shot-table-functions.js";
import { clearGuideTable } from "../guides/guide-table-functions.js";

function setUpDeleteAllModal(id = "#delete-all-modal") {
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
    h.append("h5").attr("class", "modal-title");
    h.append("button")
        .attr("type", "button")
        .attr("class", "btn-close")
        .attr("data-bs-dismiss", "modal")
        .attr("aria-label", "Close");

    m.append("div").attr("class", "modal-body");

    m.append("div")
        .attr("class", "modal-footer")
        .append("button")
        .attr("type", "button")
        .attr("class", "grey-btn")
        .text("Delete All");
}

function createDeleteAllModal(id = "#delete-all-modal", table) {
    const modal = d3.select(id);
    modal
        .select(".modal-title")
        .text(table === "shot" ? "Delete All Events" : "Delete All Guides");
    modal
        .select(".modal-body")
        .text(
            table === "shot"
                ? "Are you sure? This will delete all recorded events."
                : "Are you sure? This will delete all guides."
        );
    modal
        .select(".modal-footer")
        .select("button")
        .on("click", () => {
            if (table === "shot") {
                clearTable();
            } else {
                clearGuideTable();
            }
            $(id).modal("hide"); // default js doesn't work for some reason
        });
}

export { setUpDeleteAllModal, createDeleteAllModal };
