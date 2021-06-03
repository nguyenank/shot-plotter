import { cfg } from "../config-details.js";

function createRadioButtons(selectId, { id, title, options }) {
    d3.select(selectId)
        .append("div")
        .attr("class", cfg.detailClass)
        .attr("id", id)
        .append("h3")
        .text(title)
        .attr("class", "center");

    for (let option of options) {
        var div = d3
            .select("#" + id)
            .append("div")
            .attr("class", "form-check vertical");

        div.append("input")
            .attr("class", "form-check-input")
            .attr("type", "radio")
            .attr("name", id)
            .attr("id", option.value) // sanitize, make sure no duplicate values
            .attr("value", option.value)
            .attr("checked", option.checked);
        div.append("label")
            .attr("class", "form-check-label")
            .attr("for", option.value)
            .text(option.value);
    }
}

function createTextField(selectId, { id, title, defaultValue }) {
    let div = d3
        .select(selectId)
        .append("div")
        .attr("class", cfg.detailClass + " " + "even-width")
        .attr("id", id);
    div.append("h3")
        .text(title)
        .attr("class", "center");
    div.append("div")
        .attr("class", "form-group")
        .append("input")
        .attr("type", "text")
        .attr("class", "form-control")
        .attr("value", defaultValue);
}

function createDropdown(selectId, { id, title, options }) {
    var div = d3
        .select(selectId)
        .append("div")
        .attr("class", cfg.detailClass + " " + "even-width")
        .attr("id", id);
    div.append("h3")
        .text(title)
        .attr("class", "center");

    var select = div
        .append("div")
        .append("select")
        .attr("id", id + "-select")
        .attr("class", "select2");
    for (let option of options) {
        select
            .append("option")
            .text(option.value)
            .attr("selected", option.selected);
    }
}

export { createRadioButtons, createTextField, createDropdown };
