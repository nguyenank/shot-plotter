import { setUpRink } from "./js/rink.js";
import { setUpOptions } from "./js/options/options.js";
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

        function decode(a) {
            return a.replace(/[a-zA-Z]/g, function(c) {
                return String.fromCharCode(
                    (c <= "Z" ? 90 : 122) >= (c = c.charCodeAt(0) + 13)
                        ? c
                        : c - 26
                );
            });
        }

        // https://www.ionos.com/digitalguide/e-mail/e-mail-security/protecting-your-email-address-how-to-do-it/

        // ROT13 encryption for email
        function decode(a) {
            return a.replace(/[a-zA-Z]/g, function(c) {
                return String.fromCharCode(
                    (c <= "Z" ? 90 : 122) >= (c = c.charCodeAt(0) + 13)
                        ? c
                        : c - 26
                );
            });
        }

        d3.select("#email").on("click", function() {
            var y = "znvygb:naxathlranaxathlra@tznvy.pbz";
            d3.select(this)
                .attr("href", decode(y))
                .on("click", () => {});
        });

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
