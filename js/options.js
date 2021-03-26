function setUpOptions() {
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

    d3.select("#options")
        .append("h3")
        .text("Player")
        .attr("class", "center");
    var playerDiv = d3
        .select("#options")
        .append("div")
        .attr("class", "form-group");
    playerDiv
        .append("label")
        .attr("for", "player-input")
        .text("Player");
    playerDiv
        .append("input")
        .attr("type", "text")
        .attr("class", "form-control")
        .attr("id", "player-input")
        .attr("value", "");
}

export { setUpOptions };
