import { teamLegend } from "../shots/legend.js";
import { setUpDetailModal } from "./detail-modal.js";
import {
    createRadioButtons,
    createTextField,
    createDropdown,
} from "./form-control.js";

let detailClass = "detail-module";

function setUpDetails(id = "#details") {
    let details = [
        { type: "shot", title: "shot", noWidget: true },
        {
            type: "radio",
            class: "period-select",
            title: "period",
            id: "period", // id and name are the same
            options: [
                { value: "1", checked: true },
                { value: "2" },
                { value: "3" },
                { value: "OT" },
            ],
        },
        { type: "team", title: "team", class: "team-select", id: "team" },
        {
            type: "player",
            title: "player",
            id: "player-input",
            defaultValue: "",
        },
        {
            type: "shot",
            title: "type",
            id: "shot-type",
            options: [
                { value: "Shot", selected: true },
                { value: "Goal" },
                { value: "Block" },
                { value: "Miss" },
            ],
        },
        { type: "x", title: "x", noWidget: true },
        { type: "y", title: "y", noWidget: true },
    ];

    setDetails(details);
    createDetailsPanel(details, id);

    setUpDetailModal("#detail-modal");
}

function createDetailsPanel(details, id = "#details") {
    d3.select(id)
        .selectAll("*")
        .remove();

    _.remove(details, x => x.noWidget);
    for (let [i, data] of details.entries()) {
        let rowId = "#row" + (Math.floor(i / 2) + 1);

        if (i % 2 == 0) {
            if (Math.floor(i / 2) > 0) {
                // need to add hr after row that isn't first row
                d3.select(id).append("hr");
            }
            // need to create new row
            d3.select(id)
                .append("div")
                .attr("class", "detail-row")
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
                $(".select2").select2({
                    tags: true,
                });
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
    customizeButton(id);
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
        .attr("class", detailClass + " " + "team-select")
        .attr("type", "team")
        .attr("id", "team")
        .append("h3")
        .text("team")
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

function customizeButton(id) {
    var d = d3
        .select(id)
        .append("div")
        .attr("class", "center position-relative");
    d.append("button")
        .attr("class", "form-control customize-btn white-btn")
        .attr("id", "customize-btn")
        .text("Customize Shot Details")
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
                // update details storage with shot options b/c this
                // was the most convenient place
                let options = getCurrentShotTypes();
                let details = getDetails();
                details[_.findIndex(details, { id: "shot-type" })][
                    "options"
                ] = options;
                setDetails(details);

                new bootstrap.Modal(
                    document.getElementById("detail-modal")
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
            "Shot details can only be customized when no shots are recorded."
        );
}

function getDetails() {
    return JSON.parse(sessionStorage.getItem("details"));
}

function setDetails(detailsList) {
    sessionStorage.setItem("details", JSON.stringify(detailsList));
}

function existsDetail(id) {
    return !d3.select(id).empty();
}

function getCurrentShotTypes() {
    var options = [];
    if (existsDetail("#shot-type")) {
        d3.select("#shot-type-select")
            .selectAll("option")
            .each(function() {
                let obj = {
                    value: d3.select(this).property("value"),
                };
                if (
                    d3.select("#shot-type-select").property("value") ===
                    obj.value
                ) {
                    obj["selected"] = true;
                }

                options.push(obj);
            });
    }
    return options;
}

export {
    setUpDetails,
    getDetails,
    setDetails,
    createDetailsPanel,
    existsDetail,
    getCurrentShotTypes,
};
