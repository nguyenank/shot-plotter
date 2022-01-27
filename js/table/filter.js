export function createFilterRow(details) {
    let filterRow = d3.select("#shot-table").select("thead").select("#filters");
    // clear row
    filterRow.selectAll("*").remove();

    // add blanks for check box
    const columns = [{ type: "" }, ...details];
    for (const col of details) {
        let c = filterRow
            .append("td")
            .attr("scope", "col")
            .attr("data-col-id", col.id);

        switch (col.type) {
            case "radio":
            case "shot-type":
            case "dropdown":
                dropdownFilter(
                    c,
                    _.map(col.options, (o) => o.value)
                );
                break;
            case "team":
                dropdownFilter(c, [col.blueTeamName, col.orangeTeamName]);
                break;
            case "value-calc":
                dropdownFilter(c, [2, 3]);
                break;
            case "in-out":
                dropdownFilter(c, ["In", "Out"]);
                break;
            case "player":
            case "text-field":
                textFilter(c);
                break;
            case "time":
                minMaxTimeFilter(c);
                break;
            case "shot-number":
            case "x":
            case "y":
            case "distance-calc":
                minMaxFilter(c);
                break;
            default:
                break;
        }
    }
}

function minMaxFilter(cell) {
    const col_id = cell.attr("data-col-id");

    const updateFilter = () => {
        addFilter({
            col_id: col_id,
            type: "min-max",
            min: parseFloat(
                d3
                    .select(`td[data-col-id="${col_id}"]`)
                    .select("#min")
                    .property("value")
            ),
            max: parseFloat(
                d3
                    .select(`td[data-col-id="${col_id}"]`)
                    .select("#max")
                    .property("value")
            ),
        });
    };
    cell.classed("filter", true);
    cell.append("input")
        .attr("type", "number")
        .attr("min", 1)
        .attr("id", "min")
        .attr("placeholder", "min")
        .on("change", updateFilter);
    cell.append("span").text("to");
    cell.append("input")
        .attr("type", "number")
        .attr("id", "max")
        .attr("placeholder", "max")
        .on("change", updateFilter);
}

function minMaxTimeFilter(cell) {
    cell.classed("filter", true);
    cell.classed("min-max-time", true);
    cell.append("input").attr("type", "text").attr("placeholder", "MM:ss");
    cell.append("span").text("< _ <");
    cell.append("input").attr("type", "text").attr("placeholder", "MM:ss");
}

function textFilter(cell) {
    cell.classed("filter", true);
    cell.classed("text-filter", true);
    cell.append("input")
        .attr("type", "text")
        .attr("placeholder", "...filter...");
}

function dropdownFilter(cell, options) {
    const s = cell.append("select").attr("class", "filter-dropdown");
    for (const option of options) {
        s.append("option").text(option);
    }
}

function addFilter(filter) {
    const filters = getFilters();
    let newFilters;
    if (_.find(filters, (f) => f.col_id === filter.col_id)) {
        // is in filters already
        newFilters = _.map(getFilters(), (f) =>
            f.col_id === filter.col_id ? filter : f
        );
    } else {
        newFilters = [...getFilters(), filter];
    }
    sessionStorage.setItem("filters", JSON.stringify(newFilters));
}

function getFilters() {
    return JSON.parse(sessionStorage.getItem("filters"));
}
