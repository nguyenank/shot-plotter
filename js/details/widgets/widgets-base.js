import { cfg } from "../config-details.js";

function createRadioButtons(id, data) {
    d3.select(id)
        .append("div")
        .attr("class", cfg.detailClass + " " + data.class)
        .attr("id", data.id)
        .attr("type", data.type)
        .append("h3")
        .text(data.title)
        .attr("class", "center");

    for (let option of data.options) {
        var div = d3
            .select("#" + data.id)
            .append("div")
            .attr("class", "form-check vertical");

        div.append("input")
            .attr("class", "form-check-input")
            .attr("type", "radio")
            .attr("name", data.id)
            .attr("id", option.value) // sanitize, make sure no duplicate values
            .attr("value", option.value)
            .attr("checked", option.checked);
        div.append("label")
            .attr("class", "form-check-label")
            .attr("for", option.value)
            .text(option.value);
    }
}

function createTextField(id, data) {
    let div = d3
        .select(id)
        .append("div")
        .attr("class", cfg.detailClass + " " + "even-width")
        .attr("id", data.id)
        .attr("type", "text-field");
    div.append("h3")
        .text(data.title)
        .attr("class", "center");
    div.append("div")
        .attr("class", "form-group")
        .append("input")
        .attr("type", "text")
        .attr("class", "form-control")
        .attr("value", data.defaultValue);
}

function createDropdown(id, data) {
    var div = d3
        .select(id)
        .append("div")
        .attr("class", cfg.detailClass + " " + "even-width")
        .attr("id", data.id)
        .attr("type", "dropdown");
    div.append("h3")
        .text(data.title)
        .attr("class", "center");

    var select = div
        .append("div")
        .append("select")
        .attr("id", data.id + "-select")
        .attr("class", "select2");
    for (let option of data.options) {
        select
            .append("option")
            .text(option.value)
            .attr("selected", option.selected);
    }
}

export { createRadioButtons, createTextField, createDropdown };
