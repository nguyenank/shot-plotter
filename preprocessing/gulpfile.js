const { parallel, src, dest } = require("gulp");
const preprocess = require("gulp-preprocess");
const rename = require("gulp-rename");

function html(sport) {
    return src("./base.html")
        .pipe(preprocess({ context: { SPORT: sport } })) // set environment variables in-line
        .pipe(rename(`${sport}.html`))
        .pipe(dest("../html"));
}

const sports = ["hockey", "floorball"];

exports.default = parallel(sports.map(sport => () => html(sport)));
