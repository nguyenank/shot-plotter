function index() {
    d3.xml("resources/hockey-rink.svg").then(data => {
        d3.select("#hockey-rink")
            .node()
            .append(data.documentElement);

        var resize = Math.floor(window.innerWidth / 200);
        d3.select("#hockey-rink-svg")
            .attr("width", resize * 200 + 20)
            .attr("height", resize * 85 + 20);

        var transform = d3.select("#hockey-rink").select("#transformations");
        transform.attr(
            "transform",
            "translate(10,10) scale(" + resize + "," + resize + ")"
        );
        transform.append("g").attr("id", "home-team");
        transform.append("g").attr("id", "away-team");
        d3.select("#hockey-rink")
            .select("#outside-perimeter")
            .on("click", e => {
                var adjustedX = d3.pointer(e)[0] - 100;
                var adjustedY = d3.pointer(e)[1] - 42.5;
                d3.select("#home-team")
                    .append("circle")
                    .attr("cx", d3.pointer(e)[0])
                    .attr("cy", d3.pointer(e)[1])
                    .attr("r", 1.5)
                    .style("fill", "rgba(169, 167, 254, .8)");
                d3.select("#dots-list")
                    .append("li")
                    .text(adjustedX.toFixed(2) + " " + adjustedY.toFixed(2));
            });
    });
}

export { index };
