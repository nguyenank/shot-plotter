function downloadArea(id, defaultFileName, onClick, extension) {
    let wrapper = d3
        .select(id)
        .append("div")
        .attr("class", "input-group");

    // Download Button
    wrapper
        .append("button")
        .attr("class", "input-group-text grey-hover-bg")
        .attr("type", "button")
        .attr("id", "download")
        .text("Download")
        .on("click", e => onClick(e));

    wrapper
        .append("input")
        .attr("type", "text")
        .attr("class", "form-control download-name")
        .attr("placeholder", defaultFileName)
        .attr("aria-label", "download file name")
        .attr("aria-described-by", "download file name");

    // .csv tack-on
    wrapper
        .append("span")
        .attr("class", "input-group-text white-bg")
        .text(extension);
}

function uploadArea(id, uploadId, onChange, warning) {
    let wrapper = d3
        .select(id)
        .append("div")
        .attr("class", "input-group");

    let upload = wrapper
        .append("label")
        .attr("for", uploadId)
        .attr("class", "upload-area")
        .on("mouseover", function() {
            d3.select(this)
                .select("#upload-label")
                .attr("class", "input-group-text hover");
        })
        .on("mouseout", function() {
            d3.select(this)
                .select("#upload-label")
                .attr("class", "input-group-text");
        });

    upload
        .append("div")
        .attr("class", "input-group-text grey-btn")
        .attr("id", "upload-label")
        .text("Upload");
    upload
        .append("div")
        .attr("class", "upload-name-box")
        .append("div")
        .attr("class", "upload-name-text")
        .text("No file chosen.");

    wrapper
        .append("input")
        .attr("type", "file")
        .attr("class", "form-control upload")
        .attr("id", uploadId)
        .attr("hidden", true)
        .on("change", onChange);
    wrapper
        .append("div")
        .attr("class", "invalid-tooltip")
        .text(warning);
}

export { downloadArea, uploadArea };
