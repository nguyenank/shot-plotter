import { teamLegend } from "../shots/legend.js";
import { setUpOptionsModal } from "./options-modal.js";
import {
    createRadioButtons,
    createTextField,
    createDropdown,
} from "./form-control.js";
function setUpOptions() {
    setUpOptionsModal("#options-modal");
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

    customizeButton();
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

function customizeButton() {
    var d = d3
        .select("#options")
        .append("div")
        .attr("class", "center position-relative");
    d.append("button")
        .attr("class", "form-control customize-btn white-btn")
        .attr("id", "customize-btn")
        .text("Customize Info Options")
        .on("mouseout", e => {
            d3.select("#customize-btn").attr(
                "class",
                "form-control customize-btn white-btn"
            );
        })
        .on("click", e => {
            if (
                d3
                    .select("#shot-table-body")
                    .selectAll("tr")
                    .size() === 0
            ) {
                new bootstrap.Modal(
                    document.getElementById("options-modal")
                ).show();
            } else {
                d3.select("#customize-btn").attr(
                    "class",
                    "form-control is-invalid customize-btn white-btn"
                );
            }
        });
    d.append("div")
        .attr("class", "invalid-tooltip")
        .text(
            "Info options can only be customized when no shots are recorded."
        );
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
