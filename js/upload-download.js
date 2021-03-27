function downloadCSV() {
    var csv = "Team,Player,X,Y\n";
    d3.select("#shot-table-body")
        .selectAll("tr")
        .each(function() {
            d3.select(this)
                .selectAll("td")
                .each(function(d, i) {
                    csv += d3.select(this).text() + ",";
                });
            // remove trailing commas from trash can
            csv = csv.slice(0, -2) + "\n";
        });
    download(csv, new Date(Date.now()).toDateString(), "text/csv");
}

export { downloadCSV };
