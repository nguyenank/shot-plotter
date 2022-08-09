import {
    setStartGuide,
    getStartGuide,
    setEndGuide,
    getEndGuide,
    setNumGuides,
    getNumGuides,
    getGuides
} from "./guide-table-functions.js";
import { getRowsPerPage } from "../shot-table/shot-table-functions.js";
import { createDeleteAllModal } from "../components/delete-all-modal.js";
import { createGuideRow } from "./guide-row.js";

export function setUpGuideTable() {
    sessionStorage.setItem("guides", JSON.stringify([]));
    setStartGuide(0);
    setEndGuide(0);
    setNumGuides(0);

    setupHeaderRow();

    d3.select("#guide-table").append("tbody").attr("id", "guide-table-body");

    d3.select("#guide-table").append("tfoot").append("tr");

    let footerRow = d3
        .select("#guide-table")
        .select("tfoot")
        .select("tr")
        .attr("class", "small-text");

    footerRow
        .append("td")
        .attr("id", "guide-table-description")
        .attr("colspan", 2);

    footerRow
        .append("td")
        .attr("colspan", 2)
        .attr("id", "guide-table-navigation");

    updateGuideTableFooter();
}

function setupHeaderRow() {
    const headerRow = d3
        .select("#guide-table")
        .style("display", "none")
        .append("thead")
        .append("tr");

    // empty first for check box
    ["", "Guide Type", "Guide Details"].forEach((c) => {
        headerRow.append("th").attr("scope", "col").text(c);
    });

    // for trash can
    let r = headerRow
        .append("th")
        .attr("scope", "col")
        .attr("class", "centered-cell")
        .append("i")
        .attr("class", "bi-trash-fill")
        .on("click", () => {
            createDeleteAllModal("#delete-all-modal", "guide");
            new bootstrap.Modal(
                document.getElementById("delete-all-modal")
            ).show();
        });
}

export function updateGuideTableFooter() {
    updateTableDescription();
    updateTableNavigation();
}

function updateTableNavigation(id = "#guide-table-navigation") {
    let nav = d3.select(id);
    nav.selectAll("*").remove();
    if (getStartGuide() > 1) {
        // exists a page before; add prev button
        let b = nav.append("button").attr("class", "grey-btn");
        b.append("i").attr("class", "bi bi-chevron-double-left");
        b.append("span").text("Prev");

        b.on("click", function () {
            setStartGuide(
                getStartGuide() - getRowsPerPage() < 1
                    ? 1
                    : getStartGuide() - getRowsPerPage()
            );
            setEndGuide(getEndGuide() - getRowsPerPage());
            createGuidePage(getStartGuide(), getEndGuide());
            updateGuideTableFooter();
        });
    }
    nav.append("span").text(
        `  Page ${parseInt((getEndGuide() - 1) / getRowsPerPage()) + 1}  `
    );
    if (getNumGuides() !== getEndGuide()) {
        // exists another page after; add next button
        let b = nav.append("button").attr("class", "grey-btn");
        b.append("span").text("Next");
        b.append("i").attr("class", "bi bi-chevron-double-right");

        b.on("click", function () {
            let end =
                getEndGuide() + getRowsPerPage() < getNumGuides()
                    ? getEndGuide() + getRowsPerPage()
                    : getNumGuides();
            setStartGuide(getEndGuide() + 1);
            setEndGuide(end);
            createGuidePage(getStartGuide(), end);
            updateGuideTableFooter();
        });
    }
}

function updateTableDescription(id = "#guide-table-description") {
    const numGuides = getNumGuides();
    let text = `Displaying ${
        numGuides === 0 ? 0 : getStartGuide()
    } - ${getEndGuide()} of ${numGuides} guides.`;

    d3.select(id).text(text);
}

export function createGuidePage(startGuide, endGuide, newGuide = null) {
    d3.select("#guide-table-body").selectAll("tr").remove();
    const guides = getGuides().slice(startGuide - 1, endGuide);
    for (const guide of guides) {
        // TODO
        createGuideRow(guide, newGuide === guide.id);
    }
}
