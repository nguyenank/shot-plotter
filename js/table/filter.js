import {
    getRows,
    setStartRow,
    getStartRow,
    setEndRow,
    getEndRow,
    setRows,
    setNumFilteredRows,
    getNumRows,
    getRowsPerPage,
    getFilteredRows,
    setFilteredRows,
} from "./table-functions.js";
import { dotsVisibility } from "../shots/dot.js";
import { heatMap } from "../toggles.js";
import { getDetails } from "../details/details-functions.js";
import { createPage, updateTableFooter } from "./table.js";

export function createFilterRow(details) {
    let filterRow = d3.select("#shot-table").select("thead").select("#filters");
    // clear row
    filterRow.selectAll("*").remove();

    const visDetails = _.filter(
        details,
        (d) => d.hidden === undefined || d.hidden === null
    );

    for (const col of visDetails) {
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

export function select2Filter() {
    $(".filter-dropdown")
        .select2({
            width: "100%",
            dropdownCssClass: "smaller-text",
            selectionCssClass: "smaller-text",
            placeholder: "click for options",
        })
        .on("change", function (e) {
            const col_id = $(this).parent().attr("data-col-id");
            const options = _.map(
                _.filter($(this).select2("data"), "selected"),
                (o) => o.text
            );
            updateDropdownFilter(col_id, options);
        });
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
    const col_id = cell.attr("data-col-id");

    const timeFormat = (s) => {
        if (!/^\d{1,2}:\d{2}$/.test(s)) return null;
        const [minutes, seconds] = s.split(":");
        if (parseInt(seconds) > 59) return null;
        return { minutes: parseInt(minutes), seconds: parseInt(seconds) };
    };

    const updateFilter = () => {
        addFilter({
            col_id: col_id,
            type: "min-max-time",
            min: timeFormat(
                d3
                    .select(`td[data-col-id="${col_id}"]`)
                    .select("#min")
                    .property("value")
            ),
            max: timeFormat(
                d3
                    .select(`td[data-col-id="${col_id}"]`)
                    .select("#max")
                    .property("value")
            ),
        });
    };

    cell.classed("filter", true);
    cell.classed("min-max-time", true);
    cell.append("input")
        .attr("type", "text")
        .attr("placeholder", "MM:ss")
        .attr("id", "min")
        .on("change", updateFilter);
    cell.append("span").text("< _ <");
    cell.append("input")
        .attr("type", "text")
        .attr("placeholder", "MM:ss")
        .attr("id", "max")
        .on("change", updateFilter);
}

function textFilter(cell) {
    const col_id = cell.attr("data-col-id");
    const updateFilter = () => {
        addFilter({
            col_id: col_id,
            type: "text-filter",
            search_string: d3
                .select(`td[data-col-id="${col_id}"]`)
                .select("input")
                .property("value"),
        });
    };

    cell.classed("filter", true);
    cell.classed("text-filter", true);
    cell.append("input")
        .attr("type", "text")
        .attr("placeholder", "...filter...")
        .on("change", updateFilter);
}

function dropdownFilter(cell, options) {
    const col_id = cell.attr("data-col-id");
    const s = cell
        .append("select")
        .attr("class", "filter-dropdown")
        .attr("multiple", true);
    for (const option of options) {
        s.append("option").text(option).attr("selected", undefined);
    }
}

export const updateDropdownFilter = (col_id, options) => {
    addFilter({
        col_id: col_id,
        type: "dropdown-filter",
        options: options,
    });
};

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
    setFilteredRows(filterRows(getRows()));

    const numRows = getFilteredRows().length;
    setNumFilteredRows(numRows);
    setStartRow(1);
    setEndRow(numRows < getRowsPerPage() ? numRows : getRowsPerPage());
    updateTableFooter();
    createPage(1, getEndRow());
    dotsVisibility();
    heatMap();
}

export function clearFilters() {
    sessionStorage.setItem("filters", JSON.stringify([]));
    createFilterRow(getDetails());
    select2Filter();

    setFilteredRows(getRows());
    const numRows = getNumRows();
    setNumFilteredRows(numRows);
    setStartRow(1);
    setEndRow(numRows < getRowsPerPage() ? numRows : getRowsPerPage());
    updateTableFooter();
    createPage(1, getEndRow());
    dotsVisibility();
    heatMap();
}

function getFilters() {
    return JSON.parse(sessionStorage.getItem("filters"));
}

export function filterRows(rows) {
    const currentFilters = getFilters();

    let filteredRows = rows;
    for (const filter of currentFilters) {
        switch (filter.type) {
            case "min-max":
                if (filter.min !== null) {
                    filteredRows = _.filter(
                        filteredRows,
                        (r) => r.rowData[filter.col_id] >= filter.min
                    );
                }
                if (filter.max !== null) {
                    filteredRows = _.filter(
                        filteredRows,
                        (r) => r.rowData[filter.col_id] <= filter.max
                    );
                }
                break;
            case "text-filter":
                // check for quotes to do exact matching
                const search_string = filter.search_string;
                const first = search_string[0];
                const last = search_string[search_string.length - 1];
                const s = search_string.toLowerCase();
                if (first === last && (first === "'" || first === '"')) {
                    const s_cropped = s.substring(1, s.length - 1);
                    filteredRows = _.filter(
                        filteredRows,
                        (r) =>
                            s_cropped === r.rowData[filter.col_id].toLowerCase()
                    );
                } else {
                    filteredRows = _.filter(filteredRows, (r) =>
                        new RegExp(s).test(
                            r.rowData[filter.col_id].toLowerCase()
                        )
                    );
                }
                break;
            case "dropdown-filter":
                if (filter.options.length > 0) {
                    filteredRows = _.filter(filteredRows, (r) =>
                        filter.options.includes(r.rowData[filter.col_id])
                    );
                }
                break;
            case "min-max-time":
                const getTime = (s) => {
                    const [min, sec] = s.split(":");
                    return { minutes: min, seconds: sec };
                };
                if (filter.min) {
                    filteredRows = _.filter(filteredRows, (r) => {
                        const rTime = getTime(r.rowData[filter.col_id]);
                        if (rTime.minutes > filter.min.minutes) {
                            return true;
                        } else if (
                            rTime.minutes === filter.min.minutes &&
                            rTime.seconds > filter.min.seconds
                        ) {
                            return true;
                        } else {
                            return false;
                        }
                    });
                }
                if (filter.max) {
                    filteredRows = _.filter(filteredRows, (r) => {
                        const rTime = getTime(r.rowData[filter.col_id]);
                        if (rTime.minutes < filter.max.minutes) {
                            return true;
                        } else if (
                            rTime.minutes === filter.max.minutes &&
                            rTime.seconds < filter.max.seconds
                        ) {
                            return true;
                        } else {
                            return false;
                        }
                    });
                }
                break;
            default:
                break;
        }
    }
    return filteredRows;
}
