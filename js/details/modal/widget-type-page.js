import { changePage } from "../details-functions.js";
import { createTimeWidget } from "../widgets/widgets-base.js";
function createWidgetTypePage(id = "#widget-type-page") {
    d3.select(id)
        .selectAll("*")
        .remove();
    var mb = d3
        .select(id)
        .append("div")
        .attr("id", "widget-type-page-mb")
        .attr("class", "modal-body");

    // explanation text
    mb.append("h6").text("Create New Column");
    mb.append("div").text(
        "Pick what type of new detail you would like in the details panel."
    );

    // widgets
    var cards = mb.append("div").attr("class", "cards");
    var widgets = [
        {
            name: "Radio Buttons",
            id: "#radio-buttons-page",
            desc:
                "Radio buttons are good for a small number of options, allowing a maximum of 5. The 'Period' column uses radio buttons.",
            example: function(id) {
                let options = [
                    { value: "Option 1" },
                    { value: "Option 2", checked: true },
                    { value: "Option 3" },
                ];
                var main = d3
                    .select(id)
                    .append("div")
                    .attr("class", "center");
                for (let option of options) {
                    var div = d3
                        .select(id)
                        .append("div")
                        .attr("class", "form-check vertical");

                    div.append("input")
                        .attr("class", "form-check-input")
                        .attr("type", "radio")
                        .attr("name", "example")
                        .attr("id", option.value)
                        .attr("value", option.value)
                        .attr("checked", option.checked);
                    div.append("label")
                        .attr("class", "form-check-label")
                        .attr("for", option.value)
                        .text(option.value);
                }
            },
        },
        {
            name: "Text Field",
            id: "#text-field-page",
            desc:
                "A text field is good when you don't know exactly what will be entered in advance. The 'Player' column uses a text field.",
            example: function(id) {
                d3.select(id)
                    .append("div")
                    .attr("class", "form-group")
                    .append("input")
                    .attr("type", "text")
                    .attr("class", "form-control")
                    .attr("placeholder", "Enter text here...");
            },
        },
        {
            name: "Dropdown",
            id: "#dropdown-page",
            desc:
                "A dropdown is good when you have more, but still a finite number of options. The 'Type' column uses a dropdown, though you will be unable to add options like in the 'Type' column.",
            example: id => {
                var select = d3
                    .select(id)
                    .append("div")
                    .attr("style", "width:100%")
                    .append("select")
                    .attr("id", "example-select");
                let options = [
                    { value: "Option 1" },
                    { value: "Option 2", selected: true },
                    { value: "Option 3" },
                    { value: "Option 4" },
                    { value: "Option 5" },
                    { value: "Option 6" },
                ];
                for (let option of options) {
                    select
                        .append("option")
                        .text(option.value)
                        .attr("selected", option.selected);
                }
            },
        },
        {
            name: "Time Widget",
            id: "#time-widget-page",
            desc:
                "A time widget is good for when you want to keep track of, well, time. You can set it to count up or down, and manually adjust the time whenever the widget is stopped.",
            example: function(id) {
                const timer = new Tock({
                    countdown: true,
                    interval: 10,
                    callback: () => {
                        let t = timer.lap();
                        d3.select("#widget-type-example-time")
                            .select("input")
                            .property(
                                "value",
                                `${parseInt(t / 60000)
                                    .toString()
                                    .padStart(1, "0")}:${parseInt(
                                    (t % 60000) / 1000
                                )
                                    .toString()
                                    .padStart(2, "0")}`
                            );
                    },
                });

                let div = d3
                    .select(id)
                    .append("div")
                    .attr("class", "form-group")
                    .attr("id", "widget-type-example-time");

                let text = div
                    .append("div")
                    .attr("class", "time-widget position-relative");
                text.append("input")
                    .attr("type", "text")
                    .attr("class", "form-control time-box")
                    .attr("value", "60:00");
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
                            d3.select("#widget-type-example-time")
                                .select("input")
                                .attr("disabled", null);
                        } else {
                            let time = d3
                                .select("#widget-type-example-time")
                                .select("input")
                                .property("value");
                            if (/^\d{1,2}:\d\d$/.test(time)) {
                                d3.select("#widget-type-example-time")
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
                                d3.select("#widget-type-example-time")
                                    .select("input")
                                    .attr(
                                        "class",
                                        "form-control time-box is-invalid"
                                    );
                            }
                        }
                    })
                    .append("i")
                    .attr("class", "bi bi-play-fill");
            },
        },
    ];

    for (let widget of widgets) {
        var card = cards.append("div").attr("class", "card");
        var ch = card
            .append("div")
            .attr("class", "card-header")
            .each(function() {
                widget.example(this);
            });

        var cb = card.append("div").attr("class", "card-body");
        cb.append("h6")
            .attr("class", "card-title")
            .text(widget.name);
        cb.append("p")
            .attr("class", "card-text")
            .text(widget.desc);
        card.append("div")
            .attr("class", "card-footer text-center white-bg")
            .append("button")
            .attr("type", "button")
            .attr("class", "grey-btn card-btn")
            .text("Create " + widget.name)
            .on("click", () => changePage(id, widget.id));
    }
    // footer
    var footer = d3
        .select(id)
        .append("div")
        .attr("class", "footer-row");
    footer
        .append("button")
        .attr("type", "button")
        .attr("class", "grey-btn")
        .text("Back")
        .on("click", () => changePage(id, "#main-page"));
}

export { createWidgetTypePage };
