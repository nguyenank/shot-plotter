import { cfg } from "../config-details.js";

function createRadioButtons(selectId, { id, title, options }) {
    d3.select(selectId)
        .append("div")
        .attr("class", cfg.detailClass)
        .attr("id", id)
        .append("h3")
        .text(title)
        .attr("class", "center");

    for (let option of options) {
        var div = d3
            .select("#" + id)
            .append("div")
            .attr("class", "form-check vertical");

        div.append("input")
            .attr("class", "form-check-input")
            .attr("type", "radio")
            .attr("name", id)
            .attr("id", option.value) // sanitize, make sure no duplicate values
            .attr("value", option.value)
            .attr("checked", option.checked);
        div.append("label")
            .attr("class", "form-check-label")
            .attr("for", option.value)
            .text(option.value);
    }
}

function createTextField(selectId, { id, title, defaultValue }) {
    let div = d3
        .select(selectId)
        .append("div")
        .attr("class", cfg.detailClass + " " + "even-width")
        .attr("id", id);
    div.append("h3")
        .text(title)
        .attr("class", "center");
    div.append("div")
        .attr("class", "form-group")
        .append("input")
        .attr("type", "text")
        .attr("class", "form-control")
        .attr("value", defaultValue);
}

function createDropdown(selectId, { id, title, options }) {
    var div = d3
        .select(selectId)
        .append("div")
        .attr("class", cfg.detailClass + " " + "even-width")
        .attr("id", id);
    div.append("h3")
        .text(title)
        .attr("class", "center");

    var select = div
        .append("div")
        .append("select")
        .attr("id", id + "-select")
        .attr("class", "select2");
    for (let option of options) {
        select
            .append("option")
            .text(option.value)
            .attr("selected", option.selected);
    }
}

function createTimeWidget(selectId, { id, title, defaultTime, countdown }) {
    let div = d3
        .select(selectId)
        .append("div")
        .attr("class", cfg.detailClass + " even-width")
        .attr("id", id);
    div.append("h3")
        .text(title)
        .attr("class", "center");
    const timer = new Tock({
        countdown: countdown,
        interval: 10,
        callback: () => {
            let t = timer.lap();
            let min = d3
                .select("#" + id)
                .select("input")
                .property(
                    "value",
                    `${parseInt(t / 60000)
                        .toString()
                        .padStart(1, "0")}:${parseInt((t % 60000) / 1000)
                        .toString()
                        .padStart(2, "0")}`
                );
        },
    });
    let text = div.append("div").attr("class", "time-widget position-relative");
    text.append("input")
        .attr("type", "text")
        .attr("class", "form-control time-box")
        .attr("value", defaultTime);
    text.append("div")
        .attr("class", "invalid-tooltip")
        .text("Times must be in the form 'MM:SS' or 'M:SS'.");
    text.append("div")
        .attr("class", "white-btn time-btn")
        .on("click", function() {
            if (
                d3
                    .select(this)
                    .select("i")
                    .attr("class") === "bi bi-stop-fill"
            ) {
                timer.stop();
                d3.select(this)
                    .select("i")
                    .remove();
                d3.select(this)
                    .append("i")
                    .attr("class", "bi bi-play-fill");
                d3.select("#" + id)
                    .select("input")
                    .attr("disabled", null);
            } else {
                let time = d3
                    .select("#" + id)
                    .select("input")
                    .property("value");
                if (/^\d{1,2}:\d\d$/.test(time)) {
                    d3.select("#" + id)
                        .select("input")
                        .attr("disabled", true)
                        .attr("class", "form-control time-box");
                    d3.select(this)
                        .select("i")
                        .remove();
                    d3.select(this)
                        .append("i")
                        .attr("class", "bi bi-stop-fill");
                    timer.start(time);
                } else {
                    d3.select("#" + id)
                        .select("input")
                        .attr("class", "form-control time-box is-invalid");
                }
            }
        })
        .append("i")
        .attr("class", "bi bi-play-fill");
}

export {
    createRadioButtons,
    createTextField,
    createDropdown,
    createTimeWidget,
};
