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
import { getDefaultDetails } from "../../../setup.js";
import { setUpJSONDownloadUpload } from "./json.js";
import { createTextFieldPage } from "./text-field-page.js";
import { createRadioButtonsPage } from "./radio-buttons-page.js";
import { createDropdownPage } from "./dropdown-page.js";
import { createTimeWidgetPage } from "./time-widget-page.js";
import { createWidgetTypePage } from "./widget-type-page.js";
import { cfgDetails } from "../config-details.js";
import { sport, cfgDefaultEnable } from "../../../setup.js";
import { twoPointFunctionality, heatMapFunctionality } from "../../toggles.js";

function createMainPage(id) {
    d3.select(id).selectAll("*").remove();

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
        .attr("id", "info-collapse-btn")
        .text("More Info")
        .on("click", () => {
            $("#explain-text").collapse("toggle");
        });
    let et = mb
        .append("div")
        .attr("id", "explain-text")
        .attr("class", "collapse");

    $("#explain-text").on("hide.bs.collapse", function () {
        d3.select("#info-collapse-btn").text("More Info");
    });
    $("#explain-text").on("show.bs.collapse", function () {
        d3.select("#info-collapse-btn").text("Less Info");
    });

    // explanation text
    createExplainText();

    mb.append("hr");

    // reorder columns
    mb.append("h5").text("Details");
    mb.append("div").attr("class", "center").attr("id", "reorder");
    createReorderColumns("#reorder");
    mb.append("div")
        .attr("class", "center")
        .append("button")
        .attr("class", "grey-btn new-column-btn")
        .text("Create New Detail")
        .on("click", function () {
            saveCurrentDetailSetup();
            createTextFieldPage("#text-field-page");
            createDropdownPage("#dropdown-page");
            createRadioButtonsPage("#radio-buttons-page");
            createTimeWidgetPage("#time-widget-page");
            changePage("#main-page", "#widget-type-page");
        });

    let specialDetails = mb.append("div").attr("id", "special-details-options");
    createSpecialDetailsOptions("#special-details-options");

    mb.append("hr");
    let appearanceOptions = mb.append("div").attr("id", "appearance-options");
    createAppearanceOptions("#appearance-options");

    // footer
    let footer = d3.select(id).append("div").attr("class", "footer-row");
    footer.append("div").attr("id", "json-upload-download");
    setUpJSONDownloadUpload("#json-upload-download");
    footer
        .append("button")
        .attr("type", "button")
        .attr("class", "grey-btn save-changes-btn")
        .text("Save Changes")
        .on("click", (e) => saveChanges(e));

    if (_.indexOf(cfgDefaultEnable, "two-location") !== -1) {
        d3.select("#two-point-enable").property("checked", true);
        d3.select("#heat-map-enable")
            .property("checked", false)
            .property("disabled", true);
        twoPointFunctionality();
    }
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
        .attr("data-id", (d) => d.id)
        .attr("data-type", (d) => d.type);
    // text
    v.append("div")
        .text((d) => d.title)
        .attr("class", "center");

    // icons
    v.append("div")
        .attr("class", "reorder-item-icons")
        .each(function (d) {
            if (!(d.noWidget && d.type !== "shot-number")) {
                // no turning off or deleting any no widget columns (but shot number)
                d3.select(this)
                    .append("i")
                    .attr("class", (d) =>
                        d.hidden ? "bi bi-eye-slash-fill" : "bi bi-eye-fill"
                    )
                    .on("click", function () {
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
                        .on("click", function () {
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
                    .on("click", function () {
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
    heatMapFunctionality();
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
        .each(function () {
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
                let title = d3.select(this).select(".center").text();
                let dataId = d3.select(this).attr("data-id");
                let dataType = d3.select(this).attr("data-type");
                titles.push({ id: dataId, type: dataType, title: title });
            }
        });

    createHeaderRow(titles);
    const visibleDetails = titles.map((x) =>
        _.find(getDetails(), { id: x.id })
    );

    const widgetsPerRow = parseInt(
        d3.select("#widgets-per-row-dropdown").property("value")
    );

    createWidgetTypePage();
    createDetailsPanel(visibleDetails, "#details", widgetsPerRow);
    shotTypeLegend();
    teamLegend();
    $("#details-modal").modal("hide"); // default js doesn't work for some reason
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
    twoPointText.append("span").text("Shift").attr("class", "shift");
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

function createAppearanceOptions(id = "#appearance-options") {
    const appearanceOptions = d3.select(id);
    appearanceOptions.append("h5").text("Appearance Options");

    let pageSizeField = appearanceOptions
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

    let widgetsPerRowWrapper = appearanceOptions
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

    let heatMapToggle = appearanceOptions
        .append("div")
        .attr("class", "form-check form-switch");
    heatMapToggle
        .append("input")
        .attr("class", "form-check-input")
        .attr("type", "checkbox")
        .attr("id", "heat-map-enable")
        .attr("checked", true)
        .on("click", function () {
            if (d3.select(this).property("checked")) {
                // is becoming checked on this click
                d3.select("#two-point-enable")
                    .property("checked", false)
                    .property("disabled", true);
            } else {
                d3.select("#two-point-enable").property("disabled", false);
            }
        });
    heatMapToggle
        .append("label")
        .attr("class", "form-check-label")
        .attr("for", "heat-map-enable")
        .text("Heat Map View")
        .append("span")
        .attr("class", "smaller-text")
        .text(
            " - " +
                `Switch between event dot and heat map view for playing area. Cannot add events in heat map view. Incompatible with 2-Location Events.`
        );
}

function createSpecialDetailsOptions(id = "#special-details-options") {
    let specialDetails = d3.select(id);
    specialDetails.append("h6").text("Special Details");

    let scoringArea;
    switch (sport) {
        case "basketball-nba":
        case "basketball-ncaa":
        case "basketball-wnba":
            scoringArea = "hoop";
            break;
        case "floorball":
        case "ice-hockey-iihf":
        case "ice-hockey":
            scoringArea = "net";
            break;
        case "football-ncaa":
        case "football-nfl":
            scoringArea = "end zone (center)";
            break;
        default:
            scoringArea = "scoring area";
    }

    const sdList = [
        {
            id: "two-point-enable",
            newDetails: [
                { type: "x", title: "X2", id: "x2", noWidget: true },
                { type: "y", title: "Y2", id: "y2", noWidget: true },
            ],
            label: "2-Location Events",
            onChecked: () => {
                d3.select("#heat-map-enable").property("checked", false);
                d3.select("#heat-map-enable").property("disabled", true);
            },
            onUnchecked: () => {
                d3.select("#heat-map-enable").property("disabled", false);
            },
            description:
                "Create events with 2 locations. Incompatible with Heat Map View.",
        },
        {
            id: "distance-calc",
            newDetails: [
                {
                    type: "distance-calc",
                    title: "Distance",
                    id: "distance-calc",
                    noWidget: true,
                },
            ],
            label: "Distance",
            description: `Distance to closest ${scoringArea} for 1-location events; distance between locations for 2-location events`,
        },
    ];

    if (_.startsWith(sport, "basketball")) {
        sdList.push({
            id: "value-calc",
            newDetails: [
                {
                    type: "value-calc",
                    title: "Shot Value",
                    id: "value-calc",
                    noWidget: true,
                },
            ],
            description: `Whether a shot would be worth 2 or 3 points.`,
            label: "Shot Value",
        });
    }

    function createDetailToggle({
        id,
        newDetails,
        label,
        description,
        onChecked,
        onUnchecked,
    }) {
        let detail = specialDetails
            .append("div")
            .attr("class", "form-check form-switch");
        detail
            .append("input")
            .attr("class", "form-check-input")
            .attr("type", "checkbox")
            .attr("id", id)
            .on("click", function () {
                let checked = d3.select("#" + id).property("checked");
                if (checked) {
                    setDetails([...getDetails(), ...newDetails]);
                    if (onChecked) {
                        onChecked();
                    }
                } else {
                    setDetails(
                        _.remove(getDetails(), (d) =>
                            // keep d if for all new details, d.id is not the same as nd.id
                            newDetails.every((nd) => nd.id !== d.id)
                        )
                    );
                    if (onUnchecked) {
                        onUnchecked();
                    }
                }
                createReorderColumns();
            });
        detail
            .append("label")
            .attr("class", "form-check-label")
            .attr("for", id)
            .text(label)
            .append("span")
            .attr("class", "smaller-text")
            .text(" - " + description);
    }

    _.map(sdList, createDetailToggle);
}

export { createMainPage, createReorderColumns };
