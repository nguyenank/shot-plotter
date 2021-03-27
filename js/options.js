function setUpOptions() {
    homeAwayRadioButtons();
    d3.select("#options").append("hr");
    playerTextField();
    d3.select("#options").append("hr");
    shotTypeDropdown();
}

function homeAwayRadioButtons() {
    d3.select("#options")
        .append("h3")
        .text("Team")
        .attr("class", "center");

    var homeDiv = d3
        .select("#options")
        .append("div")
        .attr("class", "form-check");
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
        .select("#options")
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

function playerTextField() {
    d3.select("#options")
        .append("h3")
        .text("Player")
        .attr("class", "center");
    var playerDiv = d3
        .select("#options")
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
}

export { setUpOptions };
