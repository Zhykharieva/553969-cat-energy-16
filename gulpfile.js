"use strict";

var gulp = require("gulp");
var plumber = require("gulp-plumber");
var sourcemap = require("gulp-sourcemaps");
var sass = require("gulp-sass");
var postcss = require("gulp-postcss");
var autoprefixer = require("autoprefixer");
var server = require("browser-sync").create();
var gulp = require("gulp");
var rename = require("gulp-rename");
var gulp = require('gulp');
var webp = require('gulp-webp');
var imagemin = require("gulp-imagemin");
var svgstore = require("gulp-svgstore");
var svgmin = require('gulp-svgmin');
var posthtml = require("gulp-posthtml");
var include = require("posthtml-include");

gulp.task("css", function () {
  return gulp.src("source/sass/style.scss")
    .pipe(plumber())
    .pipe(sourcemap.init())
    .pipe(sass())
    .pipe(postcss([
      autoprefixer()
    ]))
    .pipe(sourcemap.write("."))
    .pipe(gulp.dest("source/css"))
    .pipe(server.stream());
});

gulp.task("server", function () {
  server.init({
    server: "source/",
    notify: false,
    open: true,
    cors: true,
    ui: false
  });

  gulp.watch("source/sass/**/*.{scss,sass}", gulp.series("css"));
  gulp.watch("source/*.html").on("change", server.reload);
});

gulp.task("start", gulp.series("css", "server"));

gulp.task("webp", function () {
return    gulp.src("source/img/**/*.{jpg, png}")
.pipe(webp({quality: 90}))
        .pipe(gulp.dest("source/img"));
});

gulp.task("images", function () {
return    gulp.src("source/img/**/*.{png, jpg, svg}")
.pipe(imagemin([imagemin.optipng({optimizationLevel:3}),
  imagemin.jpegtran({progressive: true}),
  imagemin.svgo()
]))
        .pipe(gulp.dest("source/img"));
});

gulp.task("sprite", function(){
  return gulp.src("source/img/icon-*.svg")
  .pipe(svgstore({ inlineSvg: true }))
.pipe(rename("sprite.svg"))

  .pipe(gulp.dest("source/img"));
})

gulp.task("html", function () {
 return gulp.src("source/*.html")
 .pipe(posthtml())
 .pipe(gulp.dest("source"));
});

gulp.task("html", function () {
return gulp.src("source/*.html")
.pipe(posthtml([
include()
]))
.pipe(gulp.dest("source"));
});
