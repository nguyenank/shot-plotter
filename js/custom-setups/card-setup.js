export function customCardSetup(s) {
    if (_.startsWith(s.id, "soccer")) {
        customSoccerCardSetup(s.id, s.appearance.width, s.appearance.height);
    }
}

function customSoccerCardSetup(id, width, height) {
    const minMaxes = {
        "soccer-ifab-yd": {
            minWidth: 100,
            maxWidth: 130,
            minHeight: 50,
            maxHeight: 100,
        },
        "soccer-ifab-m": {
            minWidth: 90,
            maxWidth: 120,
            minHeight: 45,
            maxHeight: 90,
        },
        "soccer-ncaa": {
            minWidth: 115,
            maxWidth: 120,
            minHeight: 70,
            maxHeight: 75,
        },
    };
    const card = d3.select(`#${id}`).attr("href", undefined);
    const dim = card.select(".card-text").select(".dimensions");
    const minMax = minMaxes[id];
    dim.selectAll("*").remove();
    dim.append("div").attr("class", "bold").text("Dimensions: ");
    const widthField = dim.append("div");
    widthField.append("label").attr("for", `${id}-width`).text("Width:");
    widthField
        .append("input")
        .attr("id", `${id}-width`)
        .attr("type", "number")
        .attr("name", `${id}-width`)
        .attr("min", minMax.minWidth)
        .attr("max", minMax.maxWidth)
        .attr("value", width);
    widthField
        .append("span")
        .text(`(min: ${minMax.minWidth}, max: ${minMax.maxWidth})`);

    const heightField = dim.append("div");
    heightField.append("label").attr("for", `${id}-height`).text("Height:");
    heightField
        .append("input")
        .attr("id", `${id}-height`)
        .attr("type", "number")
        .attr("name", `${id}-height`)
        .attr("min", minMax.minHeight)
        .attr("max", minMax.maxHeight)
        .attr("value", height);
    heightField
        .append("span")
        .text(`(min: ${minMax.minHeight}, max: ${minMax.maxHeight})`);

    card.select("button").on("click", function () {
        const width = d3.select(`#${id}-width`).property("value");
        const height = d3.select(`#${id}-height`).property("value");
        let params = new URLSearchParams({
            width: width,
            height: height,
        });
        window.location.href = `./${id}?${params.toString()}`;
    });
}
