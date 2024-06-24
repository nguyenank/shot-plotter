export function customCardSetup(s) {
    if (_.startsWith(s.id, "soccer-ifab")) {
        customSoccerCardSetup(s.id, s.appearance.width, s.appearance.height);
    }
}

function customSoccerCardSetup(id, width, height) {
    const card = d3.select(`#${id}`).attr("href", undefined);
    const dim = card.select(".card-text").select(".dimensions");
    const inYards = _.endsWith(id, "-yd");
    dim.selectAll("*").remove();
    dim.append("div").attr("class", "bold").text("Dimensions: ");
    const widthField = dim.append("div");
    widthField.append("label").attr("for", `${id}-width`).text("Width:");
    const minWidth = inYards ? 100 : 90;
    const maxWidth = inYards ? 130 : 120;
    widthField
        .append("input")
        .attr("id", `${id}-width`)
        .attr("type", "number")
        .attr("name", `${id}-width`)
        .attr("min", minWidth)
        .attr("max", maxWidth)
        .attr("value", width);
    widthField.append("span").text(`(min: ${minWidth}, max: ${maxWidth})`);

    const heightField = dim.append("div");
    heightField.append("label").attr("for", `${id}-height`).text("Height:");
    const minHeight = inYards ? 50 : 45;
    const maxHeight = inYards ? 100 : 90;
    heightField
        .append("input")
        .attr("id", `${id}-height`)
        .attr("type", "number")
        .attr("name", `${id}-height`)
        .attr("min", minHeight)
        .attr("max", maxHeight)
        .attr("value", height);
    heightField.append("span").text(`(min: ${minHeight}, max: ${maxHeight})`);

    card.select("button").on("click", function () {
        const width = d3.select(`#${id}-width`).property("value");
        const height = d3.select(`#${id}-height`).property("value");
        console.log(width, height);
        let params = new URLSearchParams({
            width: width,
            height: height,
        });
        window.location.href = `./${id}?${params.toString()}`;
    });
}
