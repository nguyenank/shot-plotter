function getDetails() {
    return JSON.parse(sessionStorage.getItem("details"));
}

function setDetails(detailsList) {
    sessionStorage.setItem("details", JSON.stringify(detailsList));
}

function existsDetail(id) {
    return !d3.select(id).empty();
}

function getCurrentShotTypes() {
    var options = [];
    if (existsDetail("#shot-type")) {
        d3.select("#shot-type-select")
            .selectAll("option")
            .each(function() {
                let obj = {
                    value: d3.select(this).property("value"),
                };
                if (
                    d3.select("#shot-type-select").property("value") ===
                    obj.value
                ) {
                    obj["selected"] = true;
                }

                options.push(obj);
            });
    }
    return options;
}

function changePage(currentPageId, newPageId) {
    d3.select(currentPageId).attr("hidden", true);
    d3.select(newPageId).attr("hidden", null);
}

function createId(title) {
    // lowercase and replace all whitespace
    let id = title.toLowerCase().replace(/\s/g, "-");
    while (_.findIndex(getDetails(), { id: id }) !== -1) {
        id += "0";
    }
    return id;
}

function saveCurrentDetailSetup() {
    // based on select2, reorder and tag with hidden
    var details = getDetails("details");
    var newDetails = [];
    d3.select("#reorder-columns")
        .selectAll("td")
        .each(function() {
            let detail = _.find(details, {
                title: d3
                    .select(this)
                    .select(".center")
                    .text(),
            });
            if (
                d3
                    .select(this)
                    .select("i")
                    .size() !== 0 &&
                d3
                    .select(this)
                    .select("i")
                    .attr("class") === "bi bi-eye-slash-fill"
            ) {
                detail["hidden"] = true;
            } else {
                detail["hidden"] = null;
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
    setDetails(newDetails);
}

export {
    getDetails,
    setDetails,
    existsDetail,
    getCurrentShotTypes,
    changePage,
    createId,
    saveCurrentDetailSetup,
};
