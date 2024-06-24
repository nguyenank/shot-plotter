import { setUpPlayingArea } from "./js/playing-area.js";
import { setUpDetailsPanel } from "./js/details/details-panel.js";
import { setUpToggles } from "./js/toggles.js";
import { setUpShots } from "./js/shots/shot.js";
import { setUpTable } from "./js/table/table.js";
import { setUpCSVDownloadUpload } from "./js/csv.js";
import { setUpLegend, shotTypeLegend } from "./js/shots/legend.js";
import { select2Dropdown } from "./js/details/widgets/widgets-special.js";
import { cfgOtherSetup } from "./js/details/config-details.js";

export let sport;
export let dataStorage;
export let cfgSportCustomSetup;
export let cfgSportA;
export let cfgSportGoalCoords;
export let cfgSportScoringArea;
export let getDefaultSetup;
export let cfgDefaultEnable;
export let perimeterId;

function customSetup(sportData) {
    const urlParams = new URLSearchParams(window.location.search);
    const w = urlParams.get("width") || 76;
    const h = urlParams.get("height") || 75;
    sportData.appearance.width = w;
    sportData.appearance.height = h;
    sportData.goalCoords = [
        [0, h / 2],
        [w, h / 2],
    ];

    const ice_hockey = {
        width: "200",
        circleR: "2",
        polyR: "2.75",
        fontSize: "0.15", //rem
        strokeWidth: "0.5", //px
        heatMapScale: 1.25,
    };

    const scaleFactor = parseFloat(ice_hockey.width) / Math.max(w, h);
    for (const key in ice_hockey) {
        if (key === "heatMapScale") {
            sportData.appearance[key] =
                parseFloat(ice_hockey[key]) * scaleFactor;
        } else {
            const val = parseFloat(ice_hockey[key]) / scaleFactor;
            const suffix =
                key === "fontSize" ? "rem" : key === "strokeWidth" ? "px" : "";
            sportData.appearance[key] = `${val.toFixed(3)}${suffix}`;
        }
    }
    return sportData;
}

export function setup(s) {
    sport = s;
    dataStorage = localDataStorage(sport);
    d3.json("/supported-sports.json").then((data) => {
        let sportData = _.find(data.sports, { id: sport });
        cfgSportCustomSetup = false;
        if (sportData.needsCustomSetup) {
            sportData = customSetup(sportData);
            cfgSportCustomSetup = true;
        }
        cfgSportA = sportData.appearance;
        console.log(cfgSportA);
        cfgSportGoalCoords = sportData.goalCoords;
        cfgSportScoringArea = sportData.scoringArea;
        perimeterId = sportData.perimeter;
        getDefaultSetup = function () {
            const details = _.cloneDeep(sportData.defaultDetails);
            return {
                details: details,
                ...cfgOtherSetup,
                twoPointEnable:
                    _.some(details, { type: "x", id: "x2" }) &&
                    _.some(details, { type: "y", id: "y2" }),
            };
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
