function setUpOptions() {
    teamPeriod();
    d3.select("#options").append("hr");
    playerTextField("#options");
    d3.select("#options").append("hr");
    shotTypeDropdown();
}

function teamPeriod() {
    d3.select("#options")
        .append("div")
        .attr("class", "column");
    periodRadioButtons(".column");

    d3.select(".column")
        .append("div")
        .attr("class", "vr");
    homeAwayRadioButtons(".column");
}

function homeAwayRadioButtons(id) {
    d3.select(id)
        .append("div")
        .attr("class", "team-select")
        .append("h3")
        .text("Team")
        .attr("class", "center");

    var homeDiv = d3
        .select(".team-select")
        .append("div")
        .attr("class", "form-check vertical");
    homeDiv
        .append("input")
        .attr("class", "form-check-input")
        .attr("type", "radio")
        .attr("name", "home-away")
        .attr("id", "home")
        .attr("value", "#home-team")
        .attr("checked", true);
    homeDiv
        .append("label")
        .attr("class", "form-check-label")
        .attr("for", "home")
        .text("Home");

    var awayDiv = d3
        .select(".team-select")
        .append("div")
        .attr("class", "form-check");
    awayDiv
        .append("input")
        .attr("class", "form-check-input")
        .attr("type", "radio")
        .attr("name", "home-away")
        .attr("id", "away")
        .attr("value", "#away-team");
    awayDiv
        .append("label")
        .attr("class", "form-check-label")
        .attr("for", "away")
        .text("Away");
}

function periodRadioButtons(id) {
    d3.select(id)
        .append("div")
        .attr("class", "period-select")
        .append("h3")
        .text("Period")
        .attr("class", "center");

    var oneDiv = d3
        .select(".period-select")
        .append("div")
        .attr("class", "form-check vertical");
    oneDiv
        .append("input")
        .attr("class", "form-check-input")
        .attr("type", "radio")
        .attr("name", "period")
        .attr("id", "one")
        .attr("value", "1")
        .attr("checked", true);
    oneDiv
        .append("label")
        .attr("class", "form-check-label")
        .attr("for", "one")
        .text("1");

    var twoDiv = d3
        .select(".period-select")
        .append("div")
        .attr("class", "form-check vertical");
    twoDiv
        .append("input")
        .attr("class", "form-check-input")
        .attr("type", "radio")
        .attr("name", "period")
        .attr("id", "two")
        .attr("value", "2");
    twoDiv
        .append("label")
        .attr("class", "form-check-label")
        .attr("for", "two")
        .text("2");

    var threeDiv = d3
        .select(".period-select")
        .append("div")
        .attr("class", "form-check vertical");
    threeDiv
        .append("input")
        .attr("class", "form-check-input")
        .attr("type", "radio")
        .attr("name", "period")
        .attr("id", "three")
        .attr("value", "3");
    threeDiv
        .append("label")
        .attr("class", "form-check-label")
        .attr("for", "three")
        .text("3");

    var otDiv = d3
        .select(".period-select")
        .append("div")
        .attr("class", "form-check vertical");
    otDiv
        .append("input")
        .attr("class", "form-check-input")
        .attr("type", "radio")
        .attr("name", "period")
        .attr("id", "ot")
        .attr("value", "OT");
    otDiv
        .append("label")
        .attr("class", "form-check-label")
        .attr("for", "ot")
        .text("OT");
}

function playerTextField(id) {
    d3.select(id)
        .append("h3")
        .text("Player")
        .attr("class", "center");
    var playerDiv = d3
        .select(id)
        .append("div")
        .attr("class", "form-group");
    playerDiv
        .append("input")
        .attr("type", "text")
        .attr("class", "form-control")
        .attr("id", "player-input")
        .attr("value", "");
}

function shotTypeDropdown() {
    // https://bl.ocks.org/d3noob/a22c42db65eb00d4e369
    var tooltip = d3
        .select("body")
        .append("div")
        .attr("class", "tooltip")
        .style("opacity", 0)
        .text(
            "To add new shot types, type into the dropdown, then select the new option or press Enter."
        );

    d3.select("#options")
        .append("h3")
        .text("Shot Type")
        .attr("class", "center")
        .append("i")
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

    var select = d3
        .select("#options")
        .append("div")
        .attr("class", "select-wrapper")
        .append("select")
        .attr("id", "shot-type");
    select
        .append("option")
        .text("Shot")
        .attr("selected", true);
    select.append("option").text("Goal");
    select.append("option").text("Block");
    select.append("option").text("Miss");
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
