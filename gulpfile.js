const gulp = require("gulp");
const sass = require("gulp-sass");

function defaultTask(cb) {
  return gulp
    .src("./sass/**/*.scss")
    .pipe(
      sass({
        includePaths: "node_modules/govuk-frontend"
      })
    )
    .pipe(gulp.dest("public/stylesheets"));
}

exports.default = defaultTask;

