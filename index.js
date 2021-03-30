import { setUpRink } from "./js/rink.js";
import { setUpOptions } from "./js/options.js";
import { setUpShots } from "./js/shots/shot.js";
import { setUpTable } from "./js/table.js";
import { setUpDownloadUpload } from "./js/upload-download.js";
import { setUpLegend, shotTypeLegend } from "./js/shots/legend.js";

function index() {
    d3.xml("resources/hockey-rink.svg").then(data => {
        setUpRink(data);
        setUpOptions();
        setUpTable();
        setUpShots();
        setUpDownloadUpload();
        setUpLegend();
        $(document).ready(function() {
            $("#shot-type")
                .select2({
                    tags: true,
                })
                .on("change", function(e) {
                    shotTypeLegend();

                    // https://stackoverflow.com/a/54047075
                    // do not delete new options
                    $(this)
                        .find("option")
                        .removeAttr("data-select2-tag");
                });
        });
    });
}

export { index };
