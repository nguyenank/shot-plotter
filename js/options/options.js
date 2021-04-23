import { teamLegend } from "../shots/legend.js";
import { setUpOptionsModal } from "./options-modal.js";
import {
    createRadioButtons,
    createTextField,
    createDropdown,
} from "./form-control.js";

let optionsClass = "option-module";

function setUpOptions(id = "#options") {
    let options = [
        {
            type: "radio",
            class: "period-select",
            title: "Period",
            id: "period", // id and name are the same
            options: [
                { value: "1", checked: true },
                { value: "2" },
                { value: "3" },
                { value: "OT" },
            ],
        },
        { type: "team", title: "Team", class: "team-select", id: "team" },
        {
            type: "player",
            title: "Player",
            id: "player-input",
            defaultValue: "",
        },
        {
            type: "shot",
            title: "Type",
            id: "shot-type",
            options: [
                { value: "Shot", selected: true },
                { value: "Goal" },
                { value: "Block" },
                { value: "Miss" },
            ],
        },
    ];

    setUpOptionsModal("#options-modal");

    for (let [i, data] of options.entries()) {
        let rowId = "#row" + (Math.floor(i / 2) + 1);

        if (i % 2 == 0) {
            if (Math.floor(i / 2) > 0) {
                // need to add hr after row that isn't first row
                d3.select(id).append("hr");
            }
            // need to create new row
            d3.select(id)
                .append("div")
                .attr("class", "option-row")
                .attr("id", rowId.slice(1));
        } else {
            // need to add dividing line
            d3.select(rowId)
                .append("div")
                .attr("class", "vr");
        }

        switch (data.type) {
            case "team":
                teamRadioButtons(rowId);
                break;
            case "player":
                createTextField(rowId, data);
                createTooltip(
                    rowId,
                    data.title,
                    "Player will appear on shot in rink if player is 2 or less characters long."
                );
                break;
            case "shot":
                createDropdown(rowId, data);
                createTooltip(
                    rowId,
                    data.title,
                    "To add new shot types, type into the dropdown, then select the new option or press Enter."
                );
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
        }
    }

    d3.select(id).append("hr");
    customizeButton();
}

function createTooltip(id, title, text) {
    // https://bl.ocks.org/d3noob/a22c42db65eb00d4e369
    var tooltip = d3
        .select("body")
        .append("div")
        .attr("class", "tooltip")
        .style("opacity", 0)
        .text(text);
    d3.select(id)
        .selectAll("h3")
        .each(function() {
            var h = d3.select(this);
            if (h.text() === title) {
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

function teamRadioButtons(id) {
    d3.select(id)
        .append("div")
        .attr("class", optionsClass + " " + "team-select")
        .attr("type", "team")
        .attr("id", "team")
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

function getOptions(asObject = true) {
    getOptionsTest();
    // actually just shot-type options
    if (!asObject) {
        var options = [];
        d3.select("#shot-type")
            .selectAll("option")
            .each(function(d, i) {
                options[i] = d3.select(this).property("value");
            });
        return options;
    } else {
        var options = {};
        d3.select("#shot-type")
            .selectAll("option")
            .each(function(d, i) {
                options[d3.select(this).property("value")] = i;
            });
        return options;
    }
}

function getOptionsTest(id = "#options") {
    var options = [];
    d3.select(id)
        .selectAll(".option-row")
        .selectAll(".option-module")
        .each(function(d, i) {
            var option = {};
            var m = d3.select(this);
            option.type = m.attr("type");
            option.title = m.select("h3").text();
            option.class = m.attr("class").replace(optionsClass + " ", "");
            option.id = m.attr("id");
            options.push(option);
            if (option.type === "text-field") {
                option.defaultValue = m.select("input").attr("value");
            }
            if (option.type === "radio") {
                let o = [];
                m.selectAll("input").each(function() {
                    let oo = {};
                    oo.value = d3.select(this).attr("value");
                    if (d3.select(this).attr("checked")) {
                        oo.checked = true;
                    }
                    o.push(oo);
                });
                option.options = o;
            }
            if (option.type === "dropdown") {
                let o = [];
                m.selectAll("option").each(function() {
                    let oo = {};
                    oo.value = d3.select(this).property("value");
                    if (
                        oo.value ===
                        m.select("#" + option.id + "-select").property("value")
                    ) {
                        oo.selected = true;
                    }
                    o.push(oo);
                });
                option.options = o;
            }
        });
    console.log(options);
    return options;
}

export { setUpOptions, getOptions };
