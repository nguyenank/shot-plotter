import {
    changePage,
    getDetails,
    setDetails,
    createId,
} from "../details-functions.js";
import { createTimeWidget } from "../widgets/widgets-base.js";
import { createReorderColumns } from "./main-page.js";

function createTimeWidgetPage(id, data) {
    d3.select(id)
        .selectAll("*")
        .remove();

    let mb = d3
        .select(id)
        .append("div")
        .attr("id", "time-widget-page-mb")
        .attr("class", "modal-body");

    // explanation text
    mb.append("h6").text("Create Time Widget");

    // example
    mb.append("div")
        .attr("id", "time-page-example")
        .attr("class", "center example");
    createTimeWidget(
        "#time-page-example",
        data
            ? { ...data, id: "sample-time" }
            : {
                  id: "sample-time",
                  title: "Detail Name",
                  defaultTime: "60:00",
                  countdown: true,
              }
    );

    mb.append("div").text(
        "Enter the detail name, whether the time widget should count up or count down, and what the starting time should be."
    );
    mb.append("hr");
    // text field
    let form = mb
        .append("form")
        .attr("class", "need-validation")
        .attr("novalidate", "true");
    let nameDiv = form
        .append("div")
        .attr("class", "form-group position-relative");
    nameDiv
        .append("label")
        .attr("for", "time-widget-title")
        .attr("class", "form-label")
        .text("Detail Name");
    nameDiv
        .append("input")
        .attr("type", "text")
        .attr("class", "form-control")
        .attr("id", "time-widget-title")
        .property("value", data ? data.title : "");
    nameDiv
        .append("div")
        .attr("class", "invalid-tooltip")
        .text(
            "Detail names must be 1-16 characters long, and can only contain alphanumeric characters, dashes, underscores, and spaces."
        );

    let countdownDiv = form
        .append("div")
        .attr("class", "form-group position-relative");
    countdownDiv
        .append("label")
        .attr("for", "text-field-title")
        .attr("class", "form-label")
        .text("Countdown or Count Up");
    for (let option of [
        {
            text: "Countdown (i.e. timer)",
            id: "countdown",
            checked: data ? data.countdown : true,
        },
        {
            text: "Count Up (i.e. stopwatch)",
            id: "count-up",
            checked: data ? (!data.countdown ? true : null) : null,
        },
    ]) {
        let optionDiv = countdownDiv.append("div").attr("class", "form-check");
        optionDiv
            .append("input")
            .attr("class", "form-check-input")
            .attr("type", "radio")
            .attr("name", "countdown-countup")
            .attr("id", option.id)
            .attr("value", option.id)
            .attr("checked", option.checked);
        optionDiv
            .append("label")
            .attr("class", "form-check-label")
            .attr("for", option.id)
            .text(option.text);
    }

    let defaultTimeDiv = form
        .append("div")
        .attr("class", "form-group position-relative");
    defaultTimeDiv
        .append("label")
        .attr("for", "time-widget-default-time")
        .attr("class", "form-label")
        .text("Starting Time");
    defaultTimeDiv
        .append("input")
        .attr("type", "text")
        .attr("class", "form-control")
        .attr("id", "time-widget-default-time")
        .property("value", data ? data.defaultTime : "");
    defaultTimeDiv
        .append("div")
        .attr("class", "invalid-tooltip")
        .text("Times must be in the form 'MM:SS' or 'M:SS'.");

    // footer
    let footer = d3
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
        .text("Create Time Widget")
        .on(
            "click",
            data ? () => createNewTimeWidget(data) : () => createNewTimeWidget()
        );
}

function createNewTimeWidget(data) {
    let invalid = false;

    const title = d3.select("#time-widget-title").property("value");
    if (
        title.length < 1 ||
        title.length > 16 ||
        !/^[_a-zA-Z0-9- ]*$/.test(title)
    ) {
        d3.select("#time-widget-title").classed("is-invalid", true);
        invalid = true;
    } else {
        d3.select("#time-widget-title").classed("is-invalid", false);
    }
    const countdown =
        d3
            .select(`input[name="countdown-countup"]:checked`)
            .property("value") === "countdown"
            ? true
            : null;

    const defaultTime = d3
        .select("#time-widget-default-time")
        .property("value");
    if (!/^\d{1,2}:\d\d$/.test(defaultTime)) {
        d3.select("#time-widget-default-time").classed("is-invalid", true);
        invalid = true;
    } else {
        d3.select("#time-widget-default-time").classed("is-invalid", false);
    }
    if (invalid) {
        return;
    }

    let details = getDetails();
    const newDetail = {
        type: "time",
        title: title,
        id: createId(title),
        defaultTime: defaultTime,
        countdown: countdown,
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

    changePage("#time-widget-page", "#main-page");
}

export { createTimeWidgetPage };
