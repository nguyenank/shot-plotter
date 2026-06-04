import { cfgDetails } from "../config-details.js";
import { shotTypeLegend, teamLegend } from "../../shots/legend.js";
import {
    updateDropdownFilter,
    createFilterRow,
    select2Filter,
} from "../../table/filter.js";
import { saveCurrentSetup, getDetails } from "../details-functions.js";

function createTooltip({ id, title, text }) {
    // https://bl.ocks.org/d3noob/a22c42db65eb00d4e369
    let tooltip = d3
        .select("body")
        .append("div")
        .attr("class", "tooltip")
        .style("opacity", 0)
        .text(text);
    d3.select(id)
        .selectAll("h3")
        .each(function () {
            let h = d3.select(this);
            if (h.text() === title) {
                h.append("i")
                    .attr("class", "bi bi-info-circle")
                    .on("mouseover", function (e) {
                        tooltip
                            .transition()
                            .duration(200)
                            .style("opacity", 0.9)
                            .style("left", e.pageX + 10 + "px")
                            .style("top", e.pageY - 28 + "px");
                    })
                    .on("mouseout", function () {
                        tooltip
                            .transition()
                            .duration(200)
                            .style("opacity", 0.0);
                    });
            }
        });
}

function teamRadioButtons(id, data) {
    const container = d3.select(id)
        .append("div")
        .attr("class", cfgDetails.detailClass + " " + data.class)
        .attr("id", data.id);

    container.append("h3").text(data.title).attr("class", "center");

    const changeFunction = () => {
        teamLegend();
        saveCurrentSetup();
        createFilterRow(getDetails());
        select2Filter();
    };

    const btnGroup = container.append("div")
        .attr("class", "detail-radio-group")
        .attr("role", "group");

    btnGroup.append("input")
        .attr("class", "btn-check")
        .attr("type", "radio")
        .attr("name", "team-bool")
        .attr("id", "blue-team-select")
        .attr("value", "blueTeam")
        .attr("autocomplete", "off");
    btnGroup.append("label")
        .attr("class", "btn detail-radio-btn detail-team-home")
        .attr("for", "blue-team-select")
        .text(data.blueTeamName);

    btnGroup.append("input")
        .attr("class", "btn-check")
        .attr("type", "radio")
        .attr("name", "team-bool")
        .attr("id", "orange-team-select")
        .attr("value", "orangeTeam")
        .attr("autocomplete", "off");
    btnGroup.append("label")
        .attr("class", "btn detail-radio-btn detail-team-away")
        .attr("for", "orange-team-select")
        .text(data.orangeTeamName);

    container.select("#" + data.checked).attr("checked", true);

    // Editable team name inputs
    const nameWrap = container.append("div").attr("class", "team-name-inputs");
    nameWrap.append("input")
        .attr("type", "text")
        .attr("class", "team-name-input")
        .attr("id", "blue-team-name")
        .attr("value", data.blueTeamName)
        .attr("placeholder", "Home name")
        .on("change", changeFunction);
    nameWrap.append("input")
        .attr("type", "text")
        .attr("class", "team-name-input")
        .attr("id", "orange-team-name")
        .attr("value", data.orangeTeamName)
        .attr("placeholder", "Away name")
        .on("change", changeFunction);
}

function select2Dropdown() {
    $(".select2").select2({});

    select2Filter();

    $("#sample-dropdown-select").select2({
        dropdownParent: $("#sample-dropdown"),
        width: "100%",
        dropdownCssClass: "small-text",
    });

    $("#shot-type-select")
        .select2({
            tags: true,
        })
        .on("change", function (e) {
            // update legend
            shotTypeLegend();

            saveCurrentSetup();
            createFilterRow(getDetails());
            select2Filter();

            // https://stackoverflow.com/a/54047075
            // do not delete new options
            $(this).find("option").removeAttr("data-select2-tag");
        });
    $("#example-select").select2({
        dropdownParent: $(".cards"),
        width: "100%",
        dropdownCssClass: "small-text",
    });

    $("#widgets-per-row-dropdown").select2({
        dropdownParent: $("#main-page-mb"),
        width: "3em",
        dropdownCssClass: "small-text",
    });
}

export { createTooltip, teamRadioButtons, select2Dropdown };
