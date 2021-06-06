import { createHeaderRow } from "../../table.js";
import { getDetails, setDetails, changePage } from "../details-functions.js";
import { createDetailsPanel } from "../details-panel.js";
import { shotTypeLegend, teamLegend } from "../../shots/legend.js";
import { downloadArea, uploadArea } from "../../components/upload-download.js";

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
    mb.append("div").text(
        "You can choose what columns appear in the table and in the details panel, and in what order."
    );

    var text = mb
        .append("div")
        .text("To toggle if a column is visible, click on the eye (");
    text.append("i").attr("class", "bi bi-eye-fill");
    text.append("span").text("/");
    text.append("i").attr("class", "bi bi-eye-slash-fill");
    text.append("span").text("). An eye (");
    text.append("i").attr("class", "bi bi-eye-fill");
    text.append("span").text(") indicates the column is visible,");
    text.append("span").text(" while an eye with a slash through it (");
    text.append("i").attr("class", "bi bi-eye-slash-fill");
    text.append("span").text(
        ") indicates the column is not visible. Only visible columns will be included in the details panel and in the .csv when downloaded. The coordinate columns (X and Y) must always be visible."
    );

    text.append("div").text(
        "To reorder columns, click and drag them into the desired order."
    );

    // reorder columns
    createReorderColumns("#main-page-mb");

    d3.select(id)
        .append("div")
        .attr("class", "center")
        .append("button")
        .attr("class", "grey-btn new-column-btn")
        .text("Create New Column")
        .on("click", () => changePage("#main-page", "#widget-type-page"));

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
    mb.select("#reorder").remove();

    var v = mb
        .append("div")
        .attr("class", "center")
        .attr("id", "reorder")
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

function setUpJSONDownloadUpload(id) {
    // Custom Filename
    downloadArea(id, "custom-details", () => downloadJSON(id), ".json");
    uploadArea(
        id,
        "json-upload",
        e => uploadJSON(id, "#json-upload", e),
        "Only .json files are allowed."
    );
}

function downloadJSON(id) {
    var fileName = d3
        .select(id)
        .select(".download-name")
        .property("value");
    if (!fileName) {
        fileName =
            d3
                .select(id)
                .select(".download-name")
                .attr("placeholder") + ".json";
    }
    var details = getDetails("details");

    // based on select2, reorder and tag with hidden
    var newDetails = [];
    d3.select("#reorder-columns")
        .selectAll("td")
        .each(function() {
            let detail = _.find(details, {
                title: d3
                    .select(this)
                    .select("span")
                    .text(),
            });
            if (
                d3
                    .select(this)
                    .select("i")
                    .attr("class") === "bi bi-eye-slash-fill"
            ) {
                detail["hidden"] = true;
            }
            // custom saves for each
            if (!detail.hidden && detail.id) {
                var d = d3.select("#details").select("#" + detail.id);
                if (!d.empty()) {
                    switch (detail.type) {
                        case "team":
                            // save teams
                            detail.blueTeamName = d
                                .select("#blue-team-name")
                                .property("value");
                            detail.orangeTeamName = d
                                .select("#orange-team-name")
                                .property("value");
                            detail.checked = d3
                                .select("input[name='team-bool']:checked")
                                .property("id");
                            break;

                        case "player":
                        case "text-field":
                            // save current entry
                            detail["defaultValue"] = d
                                .select("input")
                                .property("value");
                            break;

                        case "shot-type":
                        case "dropdown":
                            // save currently selected option
                            let selectedValue = d
                                .select("select")
                                .property("value");
                            detail.options = detail.options.map(function(o) {
                                let option = { value: o.value };
                                if (o.value === selectedValue) {
                                    option.selected = true;
                                }
                                return option;
                            });
                            break;

                        case "radio":
                            // save current selection
                            let checkedValue = d
                                .select(`input[name='${detail.id}']:checked`)
                                .property("value");
                            detail.options = detail.options.map(function(o) {
                                let option = { value: o.value };
                                if (o.value === checkedValue) {
                                    option.checked = true;
                                }
                                return option;
                            });
                            break;
                    }
                }
            }
            newDetails.push(detail);
        });

    download(JSON.stringify(newDetails), fileName, "application/json");
}

function uploadJSON(id, uploadId, e) {
    if (/.json$/i.exec(d3.select(uploadId).property("value"))) {
        var f = e.target.files[0];
        if (f) {
            // change text and wipe value to allow for same file upload
            // while preserving name
            d3.select(id)
                .select(".upload-name-text")
                .text(f.name);
            d3.select(id)
                .select(".upload")
                .property("value", "");
            // TODO: some actual input sanitization
            f.text().then(function(text) {
                setDetails(JSON.parse(text));
                createReorderColumns("#main-page-mb");
            });
        }
    } else {
        d3.select(id)
            .select("#json-upload")
            .attr("class", "form-control is-invalid");
    }
}

export { createMainPage };
