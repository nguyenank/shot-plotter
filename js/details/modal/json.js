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
