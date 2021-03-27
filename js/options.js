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
    d3.select("#options")
        .append("h3")
        .text("Shot Type")
        .attr("class", "center");

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

    d3.select("#options")
        .append("div")
        .text(
            "(To add new shot type, type into the dropdown and select the new option or press Enter.)"
        );
}

export { setUpOptions };
