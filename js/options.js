function setUpOptions() {
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

export { setUpOptions };
