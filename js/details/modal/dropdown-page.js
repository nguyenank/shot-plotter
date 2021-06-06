import {
    changePage,
    getDetails,
    setDetails,
    createId,
} from "../details-functions.js";
import { createTextField, createDropdown } from "../widgets/widgets-base.js";
import { createMainPage } from "./main-page.js";

function createDropdownPage(id = "#dropdown-page") {
    d3.select(id)
        .selectAll("*")
        .remove();

    var mb = d3
        .select(id)
        .append("div")
        .attr("id", "dropdown-page-mb")
        .attr("class", "modal-body");

    // explanation text
    mb.append("h6").text("Create Dropdown Column");

    // example
    mb.append("div")
        .attr("id", "dropdown-page-example")
        .attr("class", "center example");
    createDropdown("#dropdown-page-example", {
        id: "sample-dropdown",
        title: "Column Name",
        options: [{ value: "Option 1", selected: true }, { value: "Option 2" }],
    });

    mb.append("div").text(
        "Choose the column name. Then, input a list of options for the dropdown, each option on a new line. The first option will be the default selection."
    );
    mb.append("hr");
    // text field
    var form = mb
        .append("form")
        .attr("class", "need-validation")
        .attr("novalidate", "true");
    var nameDiv = form
        .append("div")
        .attr("class", "form-group position-relative");
    nameDiv
        .append("label")
        .attr("for", "dropdown-title")
        .attr("class", "form-label")
        .text("Column Name");
    nameDiv
        .append("input")
        .attr("type", "text")
        .attr("class", "form-control")
        .attr("id", "dropdown-title");
    nameDiv
        .append("div")
        .attr("class", "invalid-tooltip")
        .text("Column names must be 1-16 characters long.");

    var optionsDiv = form
        .append("div")
        .attr("class", "form-group position-relative");
    optionsDiv
        .append("label")
        .attr("for", "dropdown-field-default-text")
        .attr("class", "form-label")
        .text("Options");
    optionsDiv
        .append("textarea")
        .attr("class", "form-control textarea")
        .attr("id", "dropdown-options")
        .attr("rows", "10")
        .text("Option 1\nOption 2\n");
    optionsDiv
        .append("div")
        .attr("class", "invalid-tooltip")
        .text("Each option must be 1-50 characters long.");

    // footer
    var footer = d3
        .select(id)
        .append("div")
        .attr("class", "footer-row");
    footer
        .append("button")
        .attr("type", "button")
        .attr("class", "grey-btn")
        .text("Back")
        .on("click", () => changePage(id, "#widget-type-page"));

    footer
        .append("button")
        .attr("type", "button")
        .attr("class", "grey-btn")
        .text("Create Dropdown")
        .on("click", createNewDropdown);
}

function createNewDropdown() {
    var invalid = false;

    var title = d3.select("#dropdown-title").property("value");
    if (title.length < 1 || title.length > 16) {
        d3.select("#dropdown-title").attr("class", "form-control is-invalid");
        invalid = true;
    } else {
        d3.select("#dropdown-title").attr("class", "form-control");
    }

    var text = d3.select("#dropdown-options").property("value");
    var optionValues = text.split("\n");
    if (optionValues.some(value => value < 1 || value > 50)) {
        d3.select("#dropdown-options").attr("class", "form-control is-invalid");
        invalid = true;
    } else {
        d3.select("#dropdown-options").attr("class", "form-control");
    }
    if (invalid) {
        return;
    }

    var options = optionValues.map(value => ({
        value: value,
    }));
    options[0] = { ...options[0], selected: true };
    var id = createId(title);
    var details = [
        ...getDetails(),
        {
            type: "dropdown",
            title: title,
            id: id,
            options: options,
            editable: true,
        },
    ];
    setDetails(details);
    createMainPage("#main-page");

    changePage("#dropdown-page", "#main-page");
}

export { createDropdownPage };
