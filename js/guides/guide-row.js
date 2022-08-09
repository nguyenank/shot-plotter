import { updateGuideTableFooter, createGuidePage } from "./guide-table.js";
import {
    getGuides,
    setStartGuide,
    getStartGuide,
    setEndGuide,
    getEndGuide,
    setGuides,
    getNumGuides,
    setNumGuides
} from "./guide-table-functions.js";
import { getRowsPerPage } from "../shot-table/shot-table-functions.js";
import { cfgAppearance } from "../config-appearance.js";
import { cfgSportA } from "../../setup.js";

export function createNewGuideRow(guide) {
    const numGuides = getNumGuides() + 1;
    setNumGuides(numGuides);

    setGuides([...getGuides(), guide]);

    if (numGuides == 1) {
        // first guide
        setStartGuide(1);
    }

    if (numGuides - getStartGuide() < getRowsPerPage()) {
        // continue adding to current page
        setEndGuide(numGuides);
        createGuideRow(guide, true);
    } else {
        // switch to last page
        let startGuide =
            getRowsPerPage() === 1
                ? numGuides
                : numGuides - getRowsPerPage() + 1;
        setStartGuide(startGuide);
        setEndGuide(numGuides);

        d3.select("#shot-table-body").selectAll("tr").remove();

        createGuidePage(startGuide, numGuides, guide.id);
    }

    updateGuideTableFooter();
}

export function createGuideRow(guide, newRow = null) {
    // create row
    let row = d3.select("#guide-table-body").append("tr");

    // create select checkbox
    row.append("th")
        .attr("scope", "row")
        .attr("class", "centered-cell")
        .append("input")
        .attr("type", "checkbox")
        .attr("value", guide.id)
        .attr("id", guide.id)
        .on("change", function () {
            const checked = d3.select(this).property("checked");
            setGuides(
                getGuides().map(function (row) {
                    if (row.id === guide.id) {
                        row.selected = checked;
                    }
                    return row;
                })
            );
            selectHandler(guide.id, checked);
        });

    // guide type
    row.append("td").text(guide.type);
    // other guide details
    row.append("td").text(
        JSON.stringify(_.omit(guide, ["selected", "id", "type"]))
    );
    // trash can
    row.append("th")
        .attr("scope", "row")
        .attr("class", "centered-cell")
        .append("i")
        .attr("class", "bi bi-trash")
        .on("click", () => deleteHandler(guide.id));
    row.attr("id", guide.id);
    row.attr("selected", false);

    if (guide.selected) {
        row.select("input").property("checked", true).dispatch("change");
    } else if (newRow) {
        // animate changing color when new row is added
        const t = d3.transition().duration(cfgAppearance.newRowDuration);
        row.style("background-color", cfgAppearance.greyTeam);
        row.transition(t).style("background-color", null);
    }
}

function deleteHandler(id) {
    event.stopPropagation();
    const rows = _.differenceBy(getGuides(), [{ id: id }], "id");
    setGuides(rows);

    const numGuides = getNumGuides() - 1;
    setNumGuides(numGuides);

    if (getEndGuide() > numGuides) {
        // deleted guide is from last page

        setEndGuide(numGuides);

        if (getEndGuide() === 0) {
            // set start index to 0
            setStartGuide(0);
        } else if (getStartGuide() !== 1) {
            setStartGuide(getStartGuide() - 1);
        }
    } else if (getStartGuide() === 1) {
        // deleted Guide is from first page
        if (getEndGuide() === 1) {
            // only 1 Guide left on first page, switch to next page
            setStartGuide(1);
            setEndGuide(getGuidesPerPage());
        } else {
            setEndGuide(getEndGuide() - 1);
        }
    } else {
        // deleted Guide is from middle page

        setStartGuide(getStartGuide() - 1);
        setEndGuide(getEndGuide() - 1);
    }

    updateGuideTableFooter();

    const t = d3.transition().duration(cfgAppearance.deleteDuration);
    d3.select("#guide-table-body")
        .select("[id='" + id + "']")
        .transition(t)
        .remove();
    d3.select("#guides")
        .select("[id='" + id + "']")
        .transition(t)
        .remove();

    createGuidePage(getStartGuide(), getEndGuide());
}

function selectHandler(id, checked) {
    let row = d3.select("#guide-table-body").select("[id='" + id + "']");
    const t = d3.transition().duration(cfgAppearance.selectDuration);

    if (checked) {
        row.transition(t).style("background-color", cfgAppearance.greyTeam);
        d3.select("#guides")
            .select("[id='" + id + "']")
            .style("opacity", 0.5);
    } else {
        row.transition(t).style("background-color", null);
        d3.select("#guides")
            .select("[id='" + id + "']")
            .style("opacity", 0.2);
    }
}
