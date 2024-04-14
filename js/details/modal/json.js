import {
    saveCurrentSetup,
    setDetails,
    setCustomSetupUploadFlag,
    getCustomSetup,
    setCustomSetup,
} from "../details-functions.js";
import { downloadArea, uploadArea } from "../../components/upload-download.js";
import { createReorderColumns } from "./main-page.js";

function setUpJSONDownloadUpload(id) {
    // Custom Filename
    downloadArea(id, "custom-setup", () => downloadJSON(id), ".json");
    uploadArea(
        id,
        "json-upload",
        (e) => uploadJSON(id, "#json-upload", e),
        "Only .json files are allowed."
    );
    setCustomSetupUploadFlag(false);
}

function downloadJSON(id) {
    let fileName = d3.select(id).select(".download-name").property("value");
    if (!fileName) {
        fileName =
            d3.select(id).select(".download-name").attr("placeholder") +
            ".json";
    }
    saveCurrentSetup();
    download(
        JSON.stringify(getCustomSetup(), null, 2),
        fileName,
        "application/json"
    );
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
                let json = JSON.parse(text);
                let details;
                if (Array.isArray(json)) {
                    // old version
                    details = json;
                    setDetails(details);
                } else {
                    // new version
                    details = json.details;
                    d3.select("#page-size-field").property(
                        "value",
                        json.rowsPerPage ? json.rowsPerPage : 10
                    );
                    d3.select("#heat-map-enable").property(
                        "checked",
                        json.heatMapEnable
                            ? json.heatMapEnable
                            : json.heatMapView
                            ? json.heatMapView
                            : false
                        // TODO: do the disable stuff for two-point & heat map here too
                    );
                    $("#widgets-per-row-dropdown").val(
                        json.widgetsPerRow ? json.widgetsPerRow : "2"
                    );
                    $("#widgets-per-row-dropdown").trigger("change");
                    setCustomSetup(json);
                }
                createReorderColumns("#reorder");
                const detailToggles = [
                    { id: "x2", type: "x", selector: "#two-point-enable" },
                    { id: "distance-calc", selector: "#distance-calc" },
                    { id: "value-calc", selector: "#value-calc" },
                    { id: "xadj", type: "x", selector: "#adj-coords" },
                ];
                for (const detailToggle of detailToggles) {
                    if (_.some(details, { id: detailToggle.id })) {
                        d3.select(detailToggle.selector).property(
                            "checked",
                            true
                        );
                    } else {
                        d3.select(detailToggle.selector).property(
                            "checked",
                            false
                        );
                    }
                }
                setCustomSetupUploadFlag(true);
            });
        }
    } else {
        d3.select(id).select("#json-upload").classed("is-invalid", true);
    }
}

export { setUpJSONDownloadUpload };
