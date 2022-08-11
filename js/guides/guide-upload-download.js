import { createNewGuideRow } from "./guide-row.js";
import { getGuides, setGuides } from "./guide-table-functions.js";
import { createGuideObject } from "./guides.js";
import { downloadArea, uploadArea } from "../components/upload-download.js";

function setUpGuideDownloadUpload(id = "#guide-upload-download") {
    // Custom Filename
    downloadArea(id, "custom-guides", () => downloadJSON(id), ".json");
    d3.select(id).style("display", "none");
    uploadArea(
        id,
        "guide-json-upload",
        (e) => uploadJSON(id, "#guide-json-upload", e),
        "Only .json files are allowed."
    );
}

function downloadJSON(id) {
    let fileName = d3.select(id).select(".download-name").property("value");
    if (!fileName) {
        fileName =
            d3.select(id).select(".download-name").attr("placeholder") +
            ".json";
    }
    const json = getGuides();
    download(JSON.stringify(json, null, 2), fileName, "application/json");
}

function uploadJSON(id, uploadId, e) {
    if (/.json$/i.exec(d3.select(uploadId).property("value"))) {
        const f = e.target.files[0];
        if (f) {
            // change text and wipe value to allow for same file upload
            // while preserving name
            d3.select(id).select(".upload-name-text").text(f.name);
            d3.select(id).select(".upload").property("value", "");
            // TODO: some actual input sanitization
            f.text().then(function (text) {
                let guides = JSON.parse(text);
                setGuides(guides);
                for (const guide of guides) {
                    createGuideObject(guide);
                    createNewGuideRow(guide);
                }
            });
        }
    } else {
        d3.select(id).select("#json-upload").classed("is-invalid", true);
    }
}

export { setUpGuideDownloadUpload };
