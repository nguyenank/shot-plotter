import {
    saveCurrentDetailSetup,
    getDetails,
    setDetails,
} from "../details-functions.js";
import { downloadArea, uploadArea } from "../../components/upload-download.js";
import { createReorderColumns } from "./main-page.js";

function setUpJSONDownloadUpload(id) {
    // Custom Filename
    downloadArea(id, "custom-setup", () => downloadJSON(id), ".json");
    uploadArea(
        id,
        "json-upload",
        e => uploadJSON(id, "#json-upload", e),
        "Only .json files are allowed."
    );
}

function downloadJSON(id) {
    let fileName = d3
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
    saveCurrentDetailSetup();
    const json = {
        details: getDetails(),
        rowsPerPage: d3.select("#page-size-field").property("value"),
        widgetsPerRow: d3.select("#widgets-per-row-dropdown").property("value"),
    };
    download(JSON.stringify(json, null, 2), fileName, "application/json");
}

function uploadJSON(id, uploadId, e) {
    if (/.json$/i.exec(d3.select(uploadId).property("value"))) {
        const f = e.target.files[0];
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
                let json = JSON.parse(text);
                let details;
                if (Array.isArray(json)) {
                    // old version
                    details = json;
                } else {
                    // new version
                    details = json.details;
                    d3.select("#page-size-field").property(
                        "value",
                        json.rowsPerPage ? json.rowsPerPage : 10
                    );
                    $("#widgets-per-row-dropdown").val(
                        json.widgetsPerRow ? json.widgetsPerRow : "2"
                    );
                    $("#widgets-per-row-dropdown").trigger("change");
                }

                setDetails(details);
                createReorderColumns("#reorder");
                if (_.find(details, { id: "x2" })) {
                    d3.select("#two-point-enable").property("checked", true);
                } else {
                    d3.select("#two-point-enable").property("checked", false);
                }
            });
        }
    } else {
        d3.select(id)
            .select("#json-upload")
            .classed("is-invalid", true);
    }
}

export { setUpJSONDownloadUpload };
