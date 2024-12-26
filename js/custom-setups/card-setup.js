import { minMaxes } from "./min-max.js";

export function customCardSetup(s) {
    customWidthHeightCardSetup(s.id, s.appearance.width, s.appearance.height);
    if (s.id === "ice-hockey-iihf") {
        customCornerRadiusSetup(s.id, s.appearance.cornerRadius);
    }
}

function customWidthHeightCardSetup(id, width, height) {
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
        .attr("value", width)
        .attr("disabled", minMax.minWidth === minMax.maxWidth ? true : null);
    if (minMax.minWidth !== minMax.maxWidth) {
        widthField
            .append("span")
            .text(`(min: ${minMax.minWidth}, max: ${minMax.maxWidth})`);
    }

    const heightField = dim.append("div");
    heightField.append("label").attr("for", `${id}-height`).text("Height:");
    heightField
        .append("input")
        .attr("id", `${id}-height`)
        .attr("type", "number")
        .attr("name", `${id}-height`)
        .attr("min", minMax.minHeight)
        .attr("max", minMax.maxHeight)
        .attr("value", height)
        .attr("disabled", minMax.minHeight === minMax.maxHeight ? true : null);
    if (minMax.minHeight !== minMax.maxHeight) {
        heightField
            .append("span")
            .text(`(min: ${minMax.minHeight}, max: ${minMax.maxHeight})`);
    }

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

function customCornerRadiusSetup(id, cornerRadius) {
    const minMax = minMaxes[id];
    const card = d3.select(`#${id}`).attr("href", undefined);
    const dim = card.select(".card-text").select(".dimensions");
    const cornerRadiusField = dim.append("div");
    cornerRadiusField
        .append("label")
        .attr("for", `${id}-corner-radius`)
        .text("Corner Radius:");
    cornerRadiusField
        .append("input")
        .attr("id", `${id}-corner-radius`)
        .attr("type", "number")
        .attr("name", `${id}-corner-radius`)
        .attr("min", minMax.minCornerRadius)
        .attr("max", minMax.maxCornerRadius)
        .attr("step", 0.1)
        .attr("value", cornerRadius);
    cornerRadiusField
        .append("span")
        .text(
            `(min: ${minMax.minCornerRadius}, max: ${minMax.maxCornerRadius})`
        );

    card.select("button").on("click", function () {
        const width = d3.select(`#${id}-width`).property("value");
        const height = d3.select(`#${id}-height`).property("value");
        const cornerRadius = d3
            .select(`#${id}-corner-radius`)
            .property("value");
        let params = new URLSearchParams({
            width: width,
            height: height,
            cornerRadius: cornerRadius,
        });
        window.location.href = `./${id}?${params.toString()}`;
    });
}
