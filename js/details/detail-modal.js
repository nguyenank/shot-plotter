import { createHeaderRow } from "../table.js";
import { getDetails, setDetails, createDetailsPanel } from "./details.js";
import { shotTypeLegend, teamLegend } from "../shots/legend.js";
import { downloadArea, uploadArea } from "../components/upload-download.js";

function setUpDetailModal(id) {
    var m = d3
        .select(id)
        .attr("class", "modal fade")
        .attr("data-bs-backdrop", "static")
        .attr("aria-hidden", true)
        .attr("aria-labelledby", "customize-details")
        .append("div")
        .attr("class", "modal-dialog modal-lg")
        .append("div")
        .attr("class", "modal-content");

    var h = m.append("div").attr("class", "modal-header");
    h.append("h5")
        .attr("class", "modal-title")
        .text("Customize Details");
    h.append("button")
        .attr("type", "button")
        .attr("class", "btn-close")
        .attr("data-bs-dismiss", "modal")
        .attr("aria-label", "Close");

    var mb = m.append("div").attr("class", "modal-body");
    mb.append("div").text(
        "You can choose what columns appear in the table, and in what order."
    );

    var text = mb
        .append("div")
        .text("To toggle if a column is visible, click on the eye (");
    text.append("i").attr("class", "bi bi-eye");
    text.append("span").text("/");
    text.append("i").attr("class", "bi bi-eye-slash");
    text.append("span").text("). An eye (");
    text.append("i").attr("class", "bi bi-eye");
    text.append("span").text(") indicates the column is visible,");
    text.append("span").text(" while an eye with a slash through it (");
    text.append("i").attr("class", "bi bi-eye-slash");
    text.append("span").text(
        ") indicates the column is not visible. Only visible columns will be included in the .csv when downloaded."
    );

    text.append("div").text(
        "To reorder columns, click and drag them into the desired order."
    );

    setUpModalBody();

    var footer = m.append("div").attr("class", "footer-row");
    footer.append("div").attr("id", "json-upload-download");
    setUpJSONDownloadUpload("#json-upload-download");
    footer
        .append("button")
        .attr("type", "button")
        .attr("class", "save-changes-btn")
        .text("Save Changes")
        .on("click", e => saveChanges(e));
}

function setUpModalBody(id = ".modal-body") {
    var columns = getDetails();

    d3.select(id)
        .select("#reorder")
        .remove();

    var v = d3
        .select(id)
        .append("div")
        .attr("class", "center")
        .attr("id", "reorder")
        .append("table")
        .attr("id", "reorder-columns")
        .selectAll("td")
        .data(columns)
        .enter()
        .append("td")
        .attr("class", "reorder-item");
    v.append("i")
        .attr("class", d => (d.hidden ? "bi bi-eye-slash" : "bi bi-eye"))
        .on("click", function() {
            var c = d3.select(this).attr("class");
            if (c === "bi bi-eye") {
                d3.select(this).attr("class", "bi bi-eye-slash");
            } else {
                d3.select(this).attr("class", "bi bi-eye");
            }
        });
    v.append("span")
        .text(d => d.title)
        .attr("class", "reorder-item-text");

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
                    .select("i")
                    .attr("class") === "bi bi-eye"
            ) {
                titles.push(
                    d3
                        .select(this)
                        .select("span")
                        .text()
                );
            }
        });
    createHeaderRow(titles);
    var visibleDetails = titles.map(x => _.find(getDetails(), { title: x }));
    createDetailsPanel(visibleDetails);
    shotTypeLegend();
    teamLegend();
    $("#detail-modal").modal("hide"); // default js doesn't work for some reason
}

function setUpJSONDownloadUpload(id) {
    // Custom Filename
    downloadArea(id, "custom-details", () => downloadJSON(id), ".json");
    uploadArea(
        id,
        "json-upload",
        e => uploadJSON(id, "#json-upload", e),
        "Only .csv files are allowed. Every column in the table (apart from shot number) must appear in the .csv file."
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
                    .attr("class") === "bi bi-eye-slash"
            ) {
                detail["hidden"] = true;
            }
            // custom saves for each
            switch (detail.type) {
                case "team":
                    // save teams
                    break;
                case "player":
                case "text-field":
                    // save current entry
                    break;
                case "shot":
                case "dropdown":
                    // save currently selected option
                    break;
                case "radio":
                    // save currently selection
                    break;
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
                setUpModalBody();
            });
        }
    } else {
        d3.select(id)
            .select("#upload")
            .attr("class", "form-control is-invalid");
    }
}

export { setUpDetailModal };
