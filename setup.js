import { setUpPlayingArea } from "./js/playing-area.js";
import { setUpDetailsPanel } from "./js/details/details-panel.js";
import { setDetails, getDetails } from "./js/details/details-functions.js";
import { setUpShots } from "./js/shots/shot.js";
import { setUpTable } from "./js/table/table.js";
import { setUpCSVDownloadUpload } from "./js/csv.js";
import { setUpLegend, shotTypeLegend } from "./js/shots/legend.js";
import { select2Dropdown } from "./js/details/widgets/widgets-special.js";
import { cfg } from "./js/config.js";

export let sport;

function setup(s) {
    sport = s;
    d3.xml(`/resources/${sport}.svg`).then(data => {
        setUpPlayingArea(data);
        setUpDetailsPanel();
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
            const y = "znvygb:naxathlranaxathlra@tznvy.pbz";
            d3.select(this)
                .attr("href", decode(y))
                .on("click", () => {});
        });

        $(document).ready(function() {
            select2Dropdown();
            $("#shot-type-select").on("change", function(e) {
                // update legend
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

function setUpIndex() {
    d3.json("/supported-sports.json").then(data => {
        const sports = data.sports;
        // set up card and link
        d3.select("#index")
            .selectAll("div")
            .data(sports)
            .join("div")
            .attr("class", "card")
            .attr("href", d => `./${d.id}`)
            .attr("id", d => d.id)
            .on("click", (e, d) => {
                window.location = `./${d.id}`;
            })
            .append("div")
            .attr("class", "card-header");

        // card body text
        let cb = d3
            .selectAll(".card")
            .append("div")
            .attr("class", "card-body");
        cb.append("h6")
            .attr("class", "card-title")
            .text(d => d.name);
        let text = cb.append("div").attr("class", "card-text");

        for (const attr of ["dimensions", "units", "specifications"]) {
            let a = text.append("div");
            a.append("span")
                .attr("class", "bold")
                .text(`${attr.replace(/^\w/, c => c.toUpperCase())}: `); // capitalize first letter
            a.append("span").text(d => d[attr]);
        }

        // footer
        d3.selectAll(".card")
            .append("div")
            .attr("class", "card-footer text-center white-bg")
            .append("button")
            .attr("type", "button")
            .attr("class", "grey-btn card-btn")
            .text(d => `Go To ${d.name}`);
        // set up svg's
        return Promise.all(
            sports.map(sport => d3.xml(`/resources/${sport.id}.svg`))
        ).then(sportsSVGs => {
            sportsSVGs.forEach((sportSVG, i) => {
                const s = sports[i].id;
                const node = d3
                    .select(`#${s}`)
                    .select(".card-header")
                    .node()
                    .append(sportSVG.documentElement);
                d3.select(`#${s}`)
                    .select("svg")
                    .attr(
                        "viewBox",
                        `-1 -1 ${cfg[s].width + 2} ${cfg[s].height + 2}`
                    );
            });
            d3.selectAll("svg").attr("width", "100%");
        });
    });
}

export { setup, setUpIndex };
