import { createHeaderRow } from "../../table.js";
import {
    getDetails,
    setDetails,
    changePage,
    getDetailFromId,
} from "../details-functions.js";
import { createDetailsPanel } from "../details-panel.js";
import { shotTypeLegend, teamLegend } from "../../shots/legend.js";
import { downloadArea, uploadArea } from "../../components/upload-download.js";
import { getDefaultDetails } from "../config-details.js";
import { createTextFieldPage } from "./text-field-page.js";
import { setUpJSONDownloadUpload } from "./json.js";

function createMainPage(id) {
    d3.select(id)
        .selectAll("*")
        .remove();

    var mb = d3
        .select(id)
        .append("div")
        .attr("id", "main-page-mb")
        .attr("class", "modal-body");

    // explanation text
    mb.append("p").text(
        "You can customize what columns appear in the table and in the details panel, and in what order."
    );

    mb.append("p").text(
        "To reorder columns, click and drag them into the desired order."
    );

    var visText = mb
        .append("p")
        .text("To toggle if a column is visible, click on the eye (");
    visText.append("i").attr("class", "bi bi-eye-fill");
    visText.append("span").text("/");
    visText.append("i").attr("class", "bi bi-eye-slash-fill");
    visText.append("span").text("). An eye (");
    visText.append("i").attr("class", "bi bi-eye-fill");
    visText.append("span").text(") indicates the column is visible,");
    visText.append("span").text(" while an eye with a slash through it (");
    visText.append("i").attr("class", "bi bi-eye-slash-fill");
    visText
        .append("span")
        .text(
            ") indicates the column is not visible. Only visible columns will be included in the details panel and in the .csv for shots."
        );
    var deleteText = mb.append("p").text("The trash can (");
    deleteText.append("i").attr("class", "bi bi-trash-fill");
    deleteText
        .append("span")
        .text(
            ") allows you to delete a column. Deleted columns disappear from the reordering and the details panel, and will not be present when downloading the .csv for shots."
        );

    mb.append("p").text(
        "The X and Y coordinate columns cannot be hidden or deleted."
    );

    // reorder columns
    mb.append("div")
        .attr("class", "center")
        .attr("id", "reorder");
    createReorderColumns("#reorder");
    mb.append("div")
        .attr("class", "center")
        .append("button")
        .attr("class", "grey-btn new-column-btn")
        .text("Create New Column")
        .on("click", () => changePage("#main-page", "#widget-type-page"));
    mb.append("div")
        .attr("class", "right")
        .append("button")
        .attr("class", "grey-btn new-column-btn")
        .text("Reset To Defaults")
        .on("click", function() {
            setDetails(getDefaultDetails());
            createReorderColumns("#reorder");
        });
    // footer
    var footer = d3
        .select(id)
        .append("div")
        .attr("class", "footer-row");
    footer.append("div").attr("id", "json-upload-download");
    setUpJSONDownloadUpload("#json-upload-download");
    footer
        .append("button")
        .attr("type", "button")
        .attr("class", "grey-btn save-changes-btn")
        .text("Save Changes")
        .on("click", e => saveChanges(e));
}

function createReorderColumns(id) {
    // column reordering
    var columns = getDetails();

    var mb = d3.select(id);
    mb.select("#reorder-columns").remove();

    var v = mb
        .append("table")
        .attr("id", "reorder-columns")
        .selectAll("td")
        .data(columns)
        .enter()
        .append("td")
        .attr("class", "reorder-item")
        .attr("data-id", d => d.id)
        .attr("data-type", d => d.type);
    // text
    v.append("div")
        .text(d => d.title)
        .attr("class", "center");

    // icons
    v.append("div")
        .attr("class", "reorder-item-icons")
        .each(function(d) {
            if (d.type != "x" && d.type !== "y") {
                // no turning off or deleting coordinates
                d3.select(this)
                    .append("i")
                    .attr("class", d =>
                        d.hidden ? "bi bi-eye-slash-fill" : "bi bi-eye-fill"
                    )
                    .on("click", function() {
                        var c = d3.select(this).attr("class");
                        if (c === "bi bi-eye-fill") {
                            d3.select(this).attr(
                                "class",
                                "bi bi-eye-slash-fill"
                            );
                        } else {
                            d3.select(this).attr("class", "bi bi-eye-fill");
                        }
                    });
                if (d.editable) {
                    d3.select(this)
                        .append("i")
                        .attr("class", "bi bi-pencil-square")
                        .on("click", function() {
                            createTextFieldPage(
                                _.find(getDetails(), { id: id })
                            );

                            let pageId;
                            switch (d.type) {
                                case "text-field":
                                    pageId = "#text-field-page";
                                    break;
                                case "dropdown":
                                    pageId = "#dropdown-page";
                                    break;
                                case "radio":
                                    pageId = "#radio-buttons-page";
                                    break;
                                default:
                                    break;
                            }
                            changePage("#main-page", pageId);
                        });
                }
                d3.select(this)
                    .append("i")
                    .attr("class", "bi bi-trash-fill")
                    .on("click", function() {
                        var details = getDetails();
                        _.remove(details, { id: d.id });
                        setDetails(details);
                        d3.select("#reorder-columns")
                            .select(`td[data-id="${d.id}"]`)
                            .remove();
                    });
            }
        });

    var el = document.getElementById("reorder-columns");
    var sortable = new Sortable(el, { ghostClass: "reorder-ghost" });
}

function saveChanges(e) {
    var titles = [];
    d3.select("#reorder-columns")
        .selectAll("td")
        .each(function() {
            if (
                d3
                    .select(this)
                    .select(".reorder-item-icons")
                    .select("i")
                    .size() === 0 ||
                d3
                    .select(this)
                    .select(".reorder-item-icons")
                    .select("i")
                    .attr("class") !== "bi bi-eye-slash-fill"
            ) {
                let title = d3
                    .select(this)
                    .select(".center")
                    .text();
                let dataId = d3.select(this).attr("data-id");
                let dataType = d3.select(this).attr("data-type");
                titles.push({ id: dataId, type: dataType, title: title });
            }
        });
    createHeaderRow(titles);
    var visibleDetails = titles.map(x =>
        _.find(getDetails(), { title: x.title })
    );
    createDetailsPanel(visibleDetails);
    shotTypeLegend();
    teamLegend();
    $("#details-modal").modal("hide"); // default js doesn't work for some reason
}

export { createMainPage };
