import { createMainPage } from "./main-page.js";
import { createWidgetTypePage } from "./widget-type-page.js";
function setUpDetailsModal(id) {
    // modal
    var m = d3
        .select(id)
        .attr("class", "modal fade")
        .attr("data-bs-backdrop", "static")
        .attr("aria-hidden", true)
        .attr("aria-labelledby", "customize-details")
        .append("div")
        .attr("class", "modal-dialog modal-lg")
        .append("div")
        .attr("class", "modal-content");
    // header
    var h = m.append("div").attr("class", "modal-header");
    h.append("h5")
        .attr("class", "modal-title")
        .text("Customize Details");
    h.append("button")
        .attr("type", "button")
        .attr("class", "btn-close")
        .attr("data-bs-dismiss", "modal")
        .attr("aria-label", "Close");

    // pages

    var pages = [
        { id: "main-page", create: createMainPage },
        { id: "widget-type-page", create: createWidgetTypePage },
        { id: "radio-buttons-page", create: () => {} },
        { id: "text-field-page", create: () => {} },
        { id: "dropdown-page", create: () => {} },
    ];

    for (let page of pages) {
        m.append("div")
            .attr("id", page.id)
            .attr("class", "modal-page")
            .attr("hidden", true);
        page.create("#" + page.id);

        // don't need to unhide main page because
        // it does that when clicking customize
    }
}

export { setUpDetailsModal };