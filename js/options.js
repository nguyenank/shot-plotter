import { teamLegend } from "./shots/legend.js";
import { setUpModal } from "./options-modal.js";
function setUpOptions() {
    setUpModal("#options-modal");
    d3.select("#options")
        .append("div")
        .attr("class", "column")
        .attr("id", "row1");

    var periodData = {
        class: "period-select",
        title: "Period",
        id: "period", // id and name are the same
        options: [
            { value: "1", checked: true },
            { value: "2" },
            { value: "3" },
            { value: "OT" },
        ],
    };

    createRadioButtons("#row1", periodData);

    d3.select(".column")
        .append("div")
        .attr("class", "vr");
    teamRadioButtons("#row1");

    d3.select("#options").append("hr");
    d3.select("#options")
        .append("div")
        .attr("class", "column")
        .attr("id", "row2");
    playerField("#row2");
    d3.select("#row2")
        .append("div")
        .attr("class", "vr");
    shotTypeDropdown("#row2");

    d3.select("#options").append("hr");
    d3.select("#options")
        .append("div")
        .attr("class", "center")
        .append("button")
        .attr("class", "btn btn-block white-bg")
        .attr("data-bs-toggle", "modal")
        .attr("data-bs-target", "#options-modal")
        .text("Customize Info Options");
}

function createRadioButtons(id, data) {
    d3.select(id)
        .append("div")
        .attr("class", data.class)
        .attr("id", data.id)
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
        .attr("class", "even-width");
    div.append("h3")
        .text(data.title)
        .attr("class", "center");
    div.append("div")
        .attr("class", "form-group")
        .append("input")
        .attr("type", "text")
        .attr("class", "form-control")
        .attr("id", data.id)
        .attr("value", data.defaultValue);
}

function createDropdown(id, data) {
    var div = d3
        .select(id)
        .append("div")
        .attr("class", "even-width");
    div.append("h3")
        .text(data.title)
        .attr("class", "center");

    var select = div
        .append("div")
        .append("select")
        .attr("id", data.id);
    for (let option of data.options) {
        select
            .append("option")
            .text(option.value)
            .attr("selected", option.selected);
    }
}

function teamRadioButtons(id) {
    d3.select(id)
        .append("div")
        .append("div")
        .attr("class", "team-select")
        .append("h3")
        .text("Team")
        .attr("class", "center");

    var wrapper = d3
        .select(".team-select")
        .append("div")
        .attr("class", "form-group");
    var blueDiv = wrapper.append("div").attr("class", "form-check");
    blueDiv
        .append("input")
        .attr("class", "form-check-input")
        .attr("type", "radio")
        .attr("name", "team-bool")
        .attr("value", "#blue-team-name")
        .attr("checked", true);
    blueDiv
        .append("input")
        .attr("type", "text")
        .attr("id", "blue-team-name")
        .attr("value", "Home")
        .on("change", () => teamLegend());

    var orangeDiv = wrapper.append("div").attr("class", "form-check");
    orangeDiv
        .append("input")
        .attr("class", "form-check-input")
        .attr("type", "radio")
        .attr("name", "team-bool")
        .attr("value", "#orange-team-name");
    orangeDiv
        .append("input")
        .attr("type", "text")
        .attr("id", "orange-team-name")
        .attr("value", "Away")
        .on("change", () => teamLegend());
}

function playerField(id) {
    var data = {
        title: "Player",
        id: "player-input",
        defaultValue: "",
    };
    createTextField(id, data);
    var tooltip = d3
        .select("body")
        .append("div")
        .attr("class", "tooltip")
        .style("opacity", 0)
        .text(
            "Player will appear on shot in rink if player is 2 or less characters long."
        );

    d3.select(id)
        .selectAll("h3")
        .each(function() {
            let h = d3.select(this);
            if (h.text() === data.title) {
                h.append("i")
                    .attr("class", "bi bi-info-circle")
                    .on("mouseover", function(e) {
                        tooltip
                            .transition()
                            .duration(200)
                            .style("opacity", 0.9)
                            .style("left", e.pageX + 10 + "px")
                            .style("top", e.pageY - 28 + "px");
                    })
                    .on("mouseout", function() {
                        tooltip
                            .transition()
                            .duration(200)
                            .style("opacity", 0.0);
                    });
            }
        });
}

function shotTypeDropdown(id) {
    // https://bl.ocks.org/d3noob/a22c42db65eb00d4e369
    var tooltip = d3
        .select("body")
        .append("div")
        .attr("class", "tooltip")
        .style("opacity", 0)
        .text(
            "To add new shot types, type into the dropdown, then select the new option or press Enter."
        );

    var typeData = {
        title: "Type",
        id: "shot-type",
        options: [
            { value: "Shot", selected: true },
            { value: "Goal" },
            { value: "Block" },
            { value: "Miss" },
        ],
    };
    createDropdown(id, typeData);
    d3.select(id)
        .selectAll("h3")
        .each(function() {
            var h = d3.select(this);
            if (h.text() === typeData.title) {
                h.append("i")
                    .attr("class", "bi bi-info-circle")
                    .on("mouseover", function(e) {
                        tooltip
                            .transition()
                            .duration(200)
                            .style("opacity", 0.9)
                            .style("left", e.pageX + 10 + "px")
                            .style("top", e.pageY - 28 + "px");
                    })
                    .on("mouseout", function() {
                        tooltip
                            .transition()
                            .duration(200)
                            .style("opacity", 0.0);
                    });
            }
        });
}

function getOptionsObject() {
    var options = {};
    d3.select("#shot-type")
        .selectAll("option")
        .each(function(d, i) {
            options[d3.select(this).property("value")] = i;
        });
    return options;
}

function getOptionsList() {
    var options = [];
    d3.select("#shot-type")
        .selectAll("option")
        .each(function(d, i) {
            options[i] = d3.select(this).property("value");
        });
    return options;
}

export { setUpOptions, getOptionsObject, getOptionsList };
