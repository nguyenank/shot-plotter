function index() {
    d3.xml("resources/hockey-rink.svg", data => {
        d3.select("#hockey-rink")
            .node()
            .append(data.documentElement);
    });
}

export { index };
