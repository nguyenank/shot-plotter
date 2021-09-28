import {
    changePage,
    getDetails,
    setDetails,
    createId,
} from "../details-functions.js";
import { createRadioButtons } from "../widgets/widgets-base.js";
import { createReorderColumns } from "./main-page.js";

function createRadioButtonsPage(id, data) {
    d3.select(id)
        .selectAll("*")
        .remove();

    var mb = d3
        .select(id)
        .append("div")
        .attr("id", "radio-buttons-page-mb")
        .attr("class", "modal-body");

    // explanation text
    mb.append("h6").text("Create Radio Buttons Column");

    // example
    mb.append("div")
        .attr("id", "radio-buttons-page-example")
        .attr("class", "center example");
    let defaultOptions = [
        { value: "Option 1" },
        { value: "Option 2", checked: true },
    ];
    createRadioButtons(
        "#radio-buttons-page-example",
        data
            ? { ...data, id: "sample-radio-buttons" }
            : {
                  id: "sample-radio-buttons",
                  title: "Column Name",
                  options: defaultOptions,
              }
    );

    mb.append("div").text(
        "Choose the column name and create options for the text field. There must be 2-5 options. Also select which options should be selected by default."
    );
    mb.append("hr");
    // title
    var form = mb
        .append("form")
        .attr("class", "need-validation")
        .attr("novalidate", "true");
    var nameDiv = form
        .append("div")
        .attr("class", "form-group position-relative");
    nameDiv
        .append("label")
        .attr("for", "radio-buttons-title")
        .attr("class", "form-label")
        .text("Column Name");
    nameDiv
        .append("input")
        .attr("type", "text")
        .attr("class", "form-control")
        .attr("id", "radio-buttons-title")
        .property("value", data ? data.title : "");
    nameDiv
        .append("div")
        .attr("class", "invalid-tooltip")
        .text(
            "Column names must be 1-16 characters long, and can only contain alphanumeric characters, dashes, underscores, and spaces."
        );
    // options
    var optionsDiv = form
        .append("div")
        .attr("class", "form-group position-relative")
        .attr("id", "options-div");
    optionsDiv
        .append("label")
        .attr("for", "radio-buttons-options")
        .attr("class", "form-label")
        .text("Options");
    optionsDiv.append("div").attr("id", "radio-buttons-options");

    let options = data ? data.options : defaultOptions;
    options.forEach(createOption);
    createAddOptionButton();
    optionsDiv
        .append("div")
        .attr("class", "invalid-tooltip")
        .text("Options must be 1-32 characters long and unique.");
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
        .on(
            "click",
            data
                ? () => changePage(id, "#main-page")
                : () => changePage(id, "#widget-type-page")
        );

    footer
        .append("button")
        .attr("type", "button")
        .attr("class", "grey-btn")
        .text("Create Radio Buttons")
        .on(
            "click",
            data
                ? () => createNewRadioButtons(data)
                : () => createNewRadioButtons()
        );
}

function createOption(option, number) {
    number += 1;
    var div = d3
        .select("#radio-buttons-options")
        .append("div")
        .attr("class", "form-check new-option")
        .attr("id", `radio-option-${number}`);

    div.append("input")
        .attr("class", "form-check-input")
        .attr("type", "radio")
        .attr("name", "radio-buttons-options")
        .attr("id", `new-radio-${number}`)
        .attr("value", `radio-option-${number}`)
        .attr("checked", option.checked);
    div.append("input")
        .attr("type", "text")
        .attr("class", "form-control")
        .attr("value", option.value);
    if (number > 2) {
        div.append("i")
            .attr("class", "bi bi-trash-fill")
            .on("click", () => {
                d3.select(`#radio-option-${number}`).remove();
                if (getNumOptions() === 4) {
                    createAddOptionButton();
                }
            });
    }
}

function createAddOptionButton(id = "#radio-buttons-page") {
    d3.select(id)
        .select("#options-div")
        .append("button")
        .text("Add Option")
        .attr("class", "grey-btn add-option-btn")
        .on("click", function(e) {
            e.preventDefault();
            let number = getNumOptions();
            createOption({ value: `Option ${number + 1}` }, number);
            if (number >= 5) {
                d3.select(this).remove();
            }
        });
}
function getNumOptions(id = "#radio-buttons-page") {
    return d3
        .select(id)
        .selectAll(".new-option")
        .size();
}

function createNewRadioButtons(data) {
    // input sanitization
    var invalid = false;

    var title = d3.select("#radio-buttons-title").property("value");
    if (
        title.length < 1 ||
        title.length > 16 ||
        !/^[_a-zA-Z0-9- ]*$/.test(title)
    ) {
        d3.select("#radio-buttons-title").classed("is-invalid", true);
        invalid = true;
    } else {
        d3.select("#radio-buttons-title").classed("is-invalid", false);
    }
    var options = [];
    var selected = d3
        .select(`input[name="radio-buttons-options"]:checked`)
        .property("value");
    d3.select("#radio-buttons-options")
        .selectAll(".new-option")
        .each(function() {
            let option = {};
            option.value = d3
                .select(this)
                .select("input[type='text']")
                .property("value");
            if (selected === d3.select(this).attr("id")) {
                option.checked = true;
            }
            options.push(option);
        });

    let optionValues = options.map(x => x.value);
    if (
        optionValues.some(value => value.length < 1 || value.length > 32) ||
        !_.isEqual(optionValues, _.uniq(optionValues))
    ) {
        d3.select("#radio-buttons-options").classed("is-invalid", true);
        invalid = true;
    } else {
        d3.select("#radio-buttons-options").classed("is-invalid", false);
    }
    if (invalid) {
        return;
    }

    // actual creation
    var details = getDetails();
    var newDetail = {
        type: "radio",
        title: title,
        id: createId(title),
        options: options,
        editable: true,
    };
    if (data) {
        let i = _.findIndex(details, data);
        details.splice(i, 1, newDetail);
    } else {
        details.push(newDetail);
    }
    setDetails(details);
    createReorderColumns("#reorder");

    changePage("#radio-buttons-page", "#main-page");
}

export { createRadioButtonsPage };
