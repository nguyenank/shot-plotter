function setUpRink(data) {
    d3.select("#hockey-rink")
        .node()
        .append(data.documentElement);

    var maxWidth =
        window.innerWidth >= 768 ? window.innerWidth * 0.7 : window.innerWidth;

    // floor resizing factor to the nearest 0.5
    var resize = (
        (Math.floor(maxWidth / 200) + Math.round(maxWidth / 200)) /
        2
    ).toFixed(1);
    d3.select("#hockey-rink-svg")
        .attr("width", resize * 200 + 20)
        .attr("height", resize * 85 + 20);

    var transform = d3.select("#hockey-rink").select("#transformations");
    transform.attr(
        "transform",
        "translate(10,10) scale(" + resize + "," + resize + ")"
    );
}

export { setUpRink };
