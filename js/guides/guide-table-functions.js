import { updateGuideTableFooter } from "./guide-table.js";

export function setGuides(guides) {
    sessionStorage.setItem("guides", JSON.stringify(guides));
}

export function getGuides() {
    return JSON.parse(sessionStorage.getItem("guides"));
}

export function getStartGuide() {
    return parseInt(sessionStorage.getItem("startGuide"));
}

export function setStartGuide(i) {
    sessionStorage.setItem("startGuide", i);
}

export function getEndGuide() {
    return parseInt(sessionStorage.getItem("endGuide"));
}

export function setEndGuide(i) {
    sessionStorage.setItem("endGuide", i);
}

export function getNumGuides() {
    return parseInt(sessionStorage.getItem("numGuides"));
}

export function setNumGuides(i) {
    sessionStorage.setItem("numGuides", i);
}

export function clearGuideTable() {
    setGuides([]);
    setStartGuide(0);
    setEndGuide(0);
    setNumGuides(0);
    updateGuideTableFooter();

    d3.select("#guide-table-body").selectAll("tr").remove();

    d3.select("#playing-area").select("#guides").selectAll("*").remove();
}
