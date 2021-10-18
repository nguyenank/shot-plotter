import { createHeaderRow } from "../../table/table.js";
import { setRowsPerPage } from "../../table/table-functions.js";
import {
    getDetails,
    setDetails,
    changePage,
    saveCurrentDetailSetup,
} from "../details-functions.js";
import { createDetailsPanel } from "../details-panel.js";
import { shotTypeLegend, teamLegend } from "../../shots/legend.js";
import { getDefaultDetails } from "../config-details.js";
import { setUpJSONDownloadUpload } from "./json.js";
import { createTextFieldPage } from "./text-field-page.js";
import { createRadioButtonsPage } from "./radio-buttons-page.js";
import { createDropdownPage } from "./dropdown-page.js";
import { createTimeWidgetPage } from "./time-widget-page.js";
import { createWidgetTypePage } from "./widget-type-page.js";
import { cfg } from "../config-details.js";

function createMainPage(id) {
    d3.select(id)
        .selectAll("*")
        .remove();

    let mb = d3
        .select(id)
        .append("div")
        .attr("id", "main-page-mb")
        .attr("class", "modal-body");
    mb.append("p").text(
        "Customize the app by modifying the details that are logged with locations. You can also tweak the app's appearance, as well as download and upload custom setups."
    );
    mb.append("div")
        .attr("class", "center")
        .append("button")
        .attr("class", "white-btn small-text")
        .text("More Info")
        .on("click", () => {
            $("#explain-text").collapse("toggle");
        });
    let et = mb
        .append("div")
        .attr("id", "explain-text")
        .attr("class", "collapse");

    // explanation text
    createExplainText();

    mb.append("hr");

    // reorder columns
    mb.append("div")
        .attr("class", "center")
        .attr("id", "reorder");
    createReorderColumns("#reorder");
    mb.append("div")
        .attr("class", "center")
        .append("button")
        .attr("class", "grey-btn new-column-btn")
        .text("Create New Detail")
        .on("click", function() {
            saveCurrentDetailSetup();
            createTextFieldPage("#text-field-page");
            createDropdownPage("#dropdown-page");
            createRadioButtonsPage("#radio-buttons-page");
            changePage("#main-page", "#widget-type-page");
        });
    let lowerOptions = mb.append("div").attr("class", "split");

    let leftSide = lowerOptions.append("div");

    let pageSizeField = leftSide
        .append("div")
        .attr("class", "page-size-form position-relative");
    pageSizeField
        .append("input")
        .attr("type", "number")
        .attr("min", 1)
        .attr("max", 999)
        .attr("value", 10)
        .attr("class", "form-control")
        .attr("id", "page-size-field");
    pageSizeField.append("span").text("Rows Per Table Page");
    pageSizeField
        .append("div")
        .attr("class", "invalid-tooltip")
        .text("Must be an integer between 1 and 999 (inclusive).");

    let widgetsPerRowWrapper = leftSide
        .append("div")
        .attr("class", "page-size-form");
    let widgetsPerRowDropdown = widgetsPerRowWrapper
        .append("select")
        .attr("id", "widgets-per-row-dropdown")
        .attr("class", "select2");

    for (let i of [1, 2, 3]) {
        widgetsPerRowDropdown
            .append("option")
            .text(i)
            .attr("selected", i === 2 ? true : undefined);
    }
    widgetsPerRowWrapper
        .append("span")
        .text("Widgets Per Panel Row")
        .attr("class", "widgets-dropdown-label");

    let twoPoint = leftSide
        .append("div")
        .attr("class", "form-check form-switch");
    twoPoint
        .append("input")
        .attr("class", "form-check-input")
        .attr("type", "checkbox")
        .attr("id", "two-point-enable")
        .on("click", function() {
            let checked = d3.select("#two-point-enable").property("checked");
            if (checked) {
                setDetails([
                    ...getDetails(),
                    { type: "x", title: "X2", id: "x2", noWidget: true },
                    { type: "y", title: "Y2", id: "y2", noWidget: true },
                ]);
            } else {
                setDetails(
                    _.remove(
                        getDetails(),
                        x => (x.id !== "x2") & (x.id !== "y2")
                    )
                );
            }
            createReorderColumns();
        });
    twoPoint
        .append("label")
        .attr("class", "form-check-label")
        .attr("for", "two-point-enable")
        .text("Enable 2-Location Events");

    lowerOptions
        .append("button")
        .attr("class", "grey-btn new-column-btn")
        .text("Reset To Defaults")
        .on("click", function() {
            setDetails(getDefaultDetails());
            d3.select("#two-point-enable").property("checked", false);
            d3.select("#page-size-field").property(
                "value",
                cfg.defaultRowsPerPage
            );
            $("#widgets-per-row-dropdown")
                .val(cfg.defaultWidgetsPerRow)
                .trigger("change");
            createReorderColumns("#reorder");
        });
    // footer
    let footer = d3
        .select(id)
        .append("div")
        .attr("class", "footer-row");
    footer.append("div").attr("id", "json-upload-download");
    setUpJSONDownloadUpload("#json-upload-download");
    footer
        .append("button")
        .attr("type", "button")
        .attr("class", "grey-btn save-changes-btn")
        .text("Save Changes")
        .on("click", e => saveChanges(e));
}

function createReorderColumns(id = "#reorder") {
    // column reordering
    const columns = getDetails();

    let mb = d3.select(id);
    mb.select("#reorder-columns").remove();

    let v = mb
        .append("table")
        .attr("id", "reorder-columns")
        .selectAll("td")
        .data(columns)
        .enter()
        .append("td")
        .attr("class", "reorder-item")
        .attr("data-id", d => d.id)
        .attr("data-type", d => d.type);
    // text
    v.append("div")
        .text(d => d.title)
        .attr("class", "center");

    // icons
    v.append("div")
        .attr("class", "reorder-item-icons")
        .each(function(d) {
            if (d.type != "x" && d.type !== "y") {
                // no turning off or deleting coordinates
                d3.select(this)
                    .append("i")
                    .attr("class", d =>
                        d.hidden ? "bi bi-eye-slash-fill" : "bi bi-eye-fill"
                    )
                    .on("click", function() {
                        const newClass =
                            d3.select(this).attr("class") === "bi bi-eye-fill"
                                ? "bi bi-eye-slash-fill"
                                : "bi bi-eye-fill";
                        d3.select(this).attr("class", newClass);
                    });
                if (d.editable) {
                    d3.select(this)
                        .append("i")
                        .attr("class", "bi bi-pencil-square")
                        .on("click", function() {
                            saveCurrentDetailSetup();
                            let details = _.find(getDetails(), { id: d.id });
                            let pageId;
                            switch (d.type) {
                                case "text-field":
                                    pageId = "#text-field-page";
                                    createTextFieldPage(pageId, details);
                                    break;
                                case "dropdown":
                                    pageId = "#dropdown-page";
                                    createDropdownPage(pageId, details);
                                    break;
                                case "radio":
                                    pageId = "#radio-buttons-page";
                                    createRadioButtonsPage(pageId, details);
                                    break;
                                case "time":
                                    pageId = "#time-widget-page";
                                    createTimeWidgetPage(pageId, details);
                                default:
                                    break;
                            }
                            changePage("#main-page", pageId);
                        });
                }
                d3.select(this)
                    .append("i")
                    .attr("class", "bi bi-trash-fill")
                    .on("click", function() {
                        let details = getDetails();
                        _.remove(details, { id: d.id });
                        setDetails(details);
                        d3.select("#reorder-columns")
                            .select(`td[data-id="${d.id}"]`)
                            .remove();
                    });
            }
        });
    const el = document.getElementById("reorder-columns");
    const sortable = new Sortable(el, { ghostClass: "reorder-ghost" });
}

function saveChanges(e) {
    saveCurrentDetailSetup();
    twoPointFunctionality();

    const pageSize = d3.select("#page-size-field").property("value");

    if (
        !Number.isInteger(parseInt(pageSize)) ||
        pageSize < 1 ||
        pageSize > 999
    ) {
        d3.select("#page-size-field").classed("is-invalid", true);
        return;
    }
    d3.select("#page-size-field").classed("is-invalid", false);
    setRowsPerPage(pageSize);

    let titles = [];
    d3.select("#reorder-columns")
        .selectAll("td")
        .each(function() {
            if (
                d3
                    .select(this)
                    .select(".reorder-item-icons")
                    .select("i")
                    .size() === 0 ||
                d3
                    .select(this)
                    .select(".reorder-item-icons")
                    .select("i")
                    .attr("class") !== "bi bi-eye-slash-fill"
            ) {
                let title = d3
                    .select(this)
                    .select(".center")
                    .text();
                let dataId = d3.select(this).attr("data-id");
                let dataType = d3.select(this).attr("data-type");
                titles.push({ id: dataId, type: dataType, title: title });
            }
        });

    createHeaderRow(titles);
    const visibleDetails = titles.map(x => _.find(getDetails(), { id: x.id }));

    const widgetsPerRow = parseInt(
        d3.select("#widgets-per-row-dropdown").property("value")
    );

    createWidgetTypePage();
    createDetailsPanel(visibleDetails, "#details", widgetsPerRow);
    shotTypeLegend();
    teamLegend();
    $("#details-modal").modal("hide"); // default js doesn't work for some reason
}

function twoPointFunctionality() {
    function setOn() {
        sessionStorage.setItem("shiftHeld", true);
        d3.select("#two-point-toggle").property("checked", true);
    }
    function setOff() {
        d3.select("#two-point-toggle").property("checked", false);
        sessionStorage.setItem("shiftHeld", false);
        sessionStorage.setItem("firstPoint", null);
        d3.select("#ghost")
            .selectAll("*")
            .remove();
    }
    if (d3.select("#two-point-enable").property("checked")) {
        d3.select("body")
            .on("keydown", function(e) {
                if (e.key === "Shift") {
                    setOn();
                }
            })
            .on("keyup", function(e) {
                if (e.key === "Shift") {
                    setOff();
                }
            });
        d3.select(".two-point-toggle")
            .selectAll("*")
            .remove();
        d3.select(".two-point-toggle")
            .append("label")
            .attr("class", "form-check-label")
            .attr("for", "two-point-toggle")
            .text("1-Location");
        let toggle = d3
            .select(".two-point-toggle")
            .append("div")
            .attr("class", "form-check form-switch");
        toggle
            .append("input")
            .attr("class", "form-check-input")
            .attr("type", "checkbox")
            .attr("id", "two-point-toggle")
            .on("click", () =>
                d3.select("#two-point-toggle").property("checked")
                    ? setOn()
                    : setOff()
            );
        toggle
            .append("label")
            .attr("class", "form-check-label")
            .attr("for", "two-point-toggle")
            .text("2-Location");
    } else {
        setOff();
        d3.select("body")
            .on("keydown", null)
            .on("keyup", null);
        d3.select(".two-point-toggle")
            .selectAll("*")
            .remove();
    }
}

function createExplainText(id = "#explain-text") {
    let et = d3.select(id);
    et.append("hr");

    et.append("p").text(
        "To reorder details, click and drag them into the desired order in the row of details below."
    );

    let visText = et
        .append("p")
        .text("To toggle if a detail is visible, click on the eye (");
    visText.append("i").attr("class", "bi bi-eye-fill");
    visText.append("span").text("/");
    visText.append("i").attr("class", "bi bi-eye-slash-fill");
    visText.append("span").text("). An eye (");
    visText.append("i").attr("class", "bi bi-eye-fill");
    visText.append("span").text(") indicates the detail is visible,");
    visText.append("span").text(" while an eye with a slash through it (");
    visText.append("i").attr("class", "bi bi-eye-slash-fill");
    visText
        .append("span")
        .text(
            ") indicates the detail is not visible. Only visible details will be included in the side panel and table."
        );
    let deleteText = et.append("p").text("The trash can (");
    deleteText.append("i").attr("class", "bi bi-trash-fill");
    deleteText
        .append("span")
        .text(
            ") allows you to delete details. Deleted details disappear from the side panel, table, and the row of details."
        );

    et.append("p").text(
        "The X and Y coordinate columns cannot be hidden or deleted."
    );
    et.append("p").text(
        "You can change the number of rows that appear on each page of the table; the number must be between 1-999, inclusive."
    );

    let twoPointText = et
        .append("p")
        .text(
            "You can also enable switching between 1-location and 2-location events. When enabled, you can hold down the "
        );
    twoPointText
        .append("span")
        .text("Shift")
        .attr("class", "shift");
    twoPointText
        .append("span")
        .text(
            " button and click two points to create a 2-location event, or you can switch between 1- and 2-location events using the toggle above the rink. Enabling 2-location events will add two more coordinate columns: X2 and Y2. X and Y are the coordinates for the first location, and X2 and Y2 are the coordinates for the second location. If a 1-location event is created while 2-location events are enabled, X2 and Y2 will be empty."
        );

    et.append("p").text(
        "You can save your current setup (which includes: detail order, any created details, whether 2-location events are enabled, appearance preferences (i.e. number of widgets per side panel & number of rows per table), and any values currently entered/selected in the details panel) as a .json. That .json file can later be uploaded to recreate that setup."
    );

    let github = et
        .append("p")
        .text(
            "For more detailed information about customization, and the app in general, visit the "
        );
    github
        .append("a")
        .attr("href", "https://github.com/nguyenank/shot-plotter")
        .text("GitHub");
    github.append("span").text(" page.");
}

export { createMainPage, createReorderColumns };
