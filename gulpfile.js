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

gulp.task("javascript", done => {
  gulp
    .src("./node_modules/jquery/dist/**/*")
    .pipe(gulp.dest("./public/javascripts/jquery"));
  gulp
    .src("./node_modules/jquery-validation/dist/**/*")
    .pipe(gulp.dest("./public/javascripts/jquery-validation"));
  done();
});

exports.default = defaultTask;
