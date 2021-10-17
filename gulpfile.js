// Initialize modules
const { src, dest, watch, series } = require("gulp");
const sass = require("gulp-sass")(require("sass"));
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const cssnano = require("cssnano");
const babel = require("gulp-babel");
const terser = require("gulp-terser");
const browsersync = require("browser-sync").create();
var concat = require("gulp-concat");

// Use dart-sass for @use
//sass.compiler = require("dart-sass");

// Sass Task
function scssTask() {
  return src("app/scss/style.scss", { sourcemaps: true })
    .pipe(sass())
    .pipe(postcss([autoprefixer("last 2 versions"), cssnano()]))
    .pipe(dest("dist/css", { sourcemaps: "." }));
}

// Javascript Task
function jsTask() {
  return src(["app/js/**/*.js", "app/js/*.js"], { sourcemaps: true })
    .pipe(concat("all.js"))
    .pipe(babel({ presets: ["@babel/preset-env"] }))
    .pipe(terser())
    .pipe(dest("dist/js", { sourcemaps: "." }));
}

// Browsersync
function browserSyncServe(cb) {
  browsersync.init({
    server: {
      baseDir: ".",
    },
    notify: {
      styles: {
        top: "auto",
        bottom: "0",
      },
    },
  });
  cb();
}
function browserSyncReLoad(cb) {
  browsersync.reload();
  cb();
}

//Watch Task
function watchTask() {
  watch("*.html", browserSyncReLoad);
  watch(
    ["app/scss/**/*.scss", "app/**/*.js"],
    series(scssTask, jsTask, browserSyncReLoad)
  );
}

// Default Gulp Task
exports.default = series(scssTask, jsTask, browserSyncServe, watchTask);
