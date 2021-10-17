import { createMainPage } from "./main-page.js";
import { createWidgetTypePage } from "./widget-type-page.js";
import { createTextFieldPage } from "./text-field-page.js";
import { createRadioButtonsPage } from "./radio-buttons-page.js";
import { createDropdownPage } from "./dropdown-page.js";
import { createTimeWidgetPage } from "./time-widget-page.js";

function setUpDetailsModal(id) {
    // modal
    let m = d3
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
    let h = m.append("div").attr("class", "modal-header");
    h.append("h5")
        .attr("class", "modal-title")
        .text("Customize Setup");
    h.append("button")
        .attr("type", "button")
        .attr("class", "btn-close")
        .attr("data-bs-dismiss", "modal")
        .attr("aria-label", "Close");

    // pages

    const pages = [
        { id: "main-page", create: createMainPage },
        { id: "widget-type-page", create: createWidgetTypePage },
        {
            id: "radio-buttons-page",
            create: () => createRadioButtonsPage("#radio-buttons-page"),
        },
        {
            id: "text-field-page",
            create: () => createTextFieldPage("#text-field-page"),
        },
        {
            id: "dropdown-page",
            create: () => createDropdownPage("#dropdown-page"),
        },
        {
            id: "time-widget-page",
            create: () => createTimeWidgetPage("#time-widget-page"),
        },
    ];

    for (const page of pages) {
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
