function index() {
    d3.xml("resources/hockey-rink.svg").then(data => {
        d3.select("#hockey-rink")
            .node()
            .append(data.documentElement);

        d3.select("#hockey-rink")
            .select("#outside-perimeter")
            .on("click", e => {
                console.log(d3.pointer(e));
            });
    });
}

export { index };
