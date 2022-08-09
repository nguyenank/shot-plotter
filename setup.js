import { setUpPlayingArea } from "./js/playing-area.js";
import { setUpDetailsPanel } from "./js/details/details-panel.js";
import { setDetails, getDetails } from "./js/details/details-functions.js";
import { setUpToggles } from "./js/toggles.js";
import { setUpShots } from "./js/shots/shot.js";
import { setUpTable } from "./js/shot-table/shot-table.js";
import { setUpCSVDownloadUpload } from "./js/csv.js";
import { setUpLegend, shotTypeLegend } from "./js/shots/legend.js";
import { select2Dropdown } from "./js/details/widgets/widgets-special.js";

export let sport;
export let cfgSportA;
export let cfgSportGoalCoords;
export let getDefaultDetails;
export let cfgDefaultEnable;
export let perimeterId;

export function setup(s) {
    sport = s;
    d3.json("/supported-sports.json").then((data) => {
        const sportData = _.find(data.sports, { id: sport });
        cfgSportA = sportData.appearance;
        cfgSportGoalCoords = sportData.goalCoords;
        perimeterId = sportData.perimeter;
        getDefaultDetails = function () {
            return _.cloneDeep(sportData.defaultDetails);
        };
        cfgDefaultEnable = sportData.defaultEnable;

        setUpPlayingArea();
        setUpDetailsPanel();
        setUpToggles();
        setUpTable();
        setUpShots();
        setUpCSVDownloadUpload();
        setUpLegend();

        d3.select("h1")
            .attr("href", "./")
            .on("click", () => {
                window.location = "./";
            });

        function decode(a) {
            return a.replace(/[a-zA-Z]/g, function (c) {
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
            return a.replace(/[a-zA-Z]/g, function (c) {
                return String.fromCharCode(
                    (c <= "Z" ? 90 : 122) >= (c = c.charCodeAt(0) + 13)
                        ? c
                        : c - 26
                );
            });
        }

        d3.select("#email").on("click", function () {
            const y = "znvygb:naxathlranaxathlra@tznvy.pbz";
            d3.select(this)
                .attr("href", decode(y))
                .on("click", () => {});
        });

        $(document).ready(function () {
            select2Dropdown();
            $("#shot-type-select").on("change", function (e) {
                // update legend
                shotTypeLegend();

                // https://stackoverflow.com/a/54047075
                // do not delete new options
                $(this).find("option").removeAttr("data-select2-tag");
            });
        });
    });
}
