import { teamLegend } from "../shots/legend.js";
import { setUpDetailsModal } from "./modal/details-modal.js";
import {
    createRadioButtons,
    createTextField,
    createDropdown,
    createTimeWidget,
    createGuideWidget
} from "./widgets/widgets-base.js";
import {
    createTooltip,
    teamRadioButtons,
    select2Dropdown
} from "./widgets/widgets-special.js";
import {
    setDetails,
    getDetails,
    getCurrentShotTypes
} from "./details-functions.js";
import { getDefaultDetails } from "../../setup.js";
import { getNumRows } from "../shot-table/shot-table-functions.js";

function setUpDetailsPanel(id = "#details") {
    let details = getDefaultDetails();

    setDetails(details);
    createDetailsPanel(details, id);

    d3.select(id).on("mouseleave", (e) => {
        d3.select("#customize-btn").classed("is-invalid", false);
    });

    setUpDetailsModal("#details-modal");
}

function createDetailsPanel(details, id = "#details") {
    let widgetsPerRow;
    try {
        widgetsPerRow = parseInt(
            d3.select("#widgets-per-row-dropdown").property("value")
        );
    } catch (TypeError) {
        widgetsPerRow = 2;
    }
    // clear existing details
    d3.select(id).selectAll("*").remove();

    _.remove(details, (x) => x.noWidget);
    for (let [i, data] of details.entries()) {
        let rowId = "#row" + (Math.floor(i / widgetsPerRow) + 1);

        if (i % widgetsPerRow == 0) {
            if (Math.floor(i / widgetsPerRow) > 0) {
                // need to add hr after row that isn't first row
                d3.select(id).append("hr");
            }
            // need to create new row
            d3.select(id)
                .append("div")
                .attr("class", "detail-row")
                .attr("id", rowId.slice(1));
        } else {
            // need to add dividing line
            d3.select(rowId).append("div").attr("class", "vr");
        }

        switch (data.type) {
            case "team":
                teamRadioButtons(rowId, data);
                break;
            case "player":
                createTextField(rowId, data);
                createTooltip({
                    id: rowId,
                    title: data.title,
                    text: "Player will appear on dot if 2 or less characters long."
                });
                break;
            case "shot-type":
                createDropdown(rowId, data);
                createTooltip({
                    id: rowId,
                    title: data.title,
                    text: "To add new options, type into the dropdown, then select the new option or press Enter."
                });
                $(".select2").select2({
                    tags: true
                });
                break;
            case "radio":
                createRadioButtons(rowId, data);
                break;
            case "text-field":
                createTextField(rowId, data);
                break;
            case "dropdown":
                createDropdown(rowId, data);
                break;
            case "time":
                createTimeWidget(rowId, data);
                break;
            case "guide":
                createGuideWidget(rowId, data);
        }
    }
    select2Dropdown();
    d3.select(id).append("hr");
    if (!_.every(details, (d) => d.type === "guide")) {
        customizeButton(id);
    }
}

function customizeButton(id) {
    let d = d3
        .select(id)
        .append("div")
        .attr("class", "center position-relative");
    d.append("button")
        .attr("class", "form-control white-btn")
        .attr("id", "customize-btn")
        .text("Customize Setup")
        .attr("disabled", getNumRows() > 0 ? true : undefined)
        .on("click", (e) => {
            if (getNumRows() === 0) {
                // update details storage with shot options b/c this
                // was the most convenient place
                const options = getCurrentShotTypes();
                let details = getDetails();
                const typeIndex = _.findIndex(details, { id: "shot-type" });
                if (typeIndex !== -1) {
                    details[typeIndex]["options"] = options;
                    setDetails(details);
                }

                // make sure main page is showing
                let m = d3.select("#details-modal").select(".modal-content");
                m.selectAll(".modal-page").attr("hidden", true);
                m.select(".modal-header").attr("hidden", null);
                m.select("#main-page").attr("hidden", null);

                new bootstrap.Modal(document.getElementById("details-modal"), {
                    backdrop: "static",
                    keyboard: false
                }).show();
            } else {
                d3.select("#customize-btn").classed("is-invalid", true);
            }
        });
    d.append("div")
        .attr("class", "invalid-tooltip")
        .text("Details can only be customized when no shots are recorded.");
}

export { setUpDetailsPanel, createDetailsPanel };
