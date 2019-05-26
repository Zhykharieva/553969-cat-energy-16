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
var csso = require("gulp-csso");
var del = require("del");
var htmlmin = require("gulp-htmlmin");
var jsmin = require("gulp-uglify");

gulp.task('copy', () => gulp.src([
  'source/fonts/**/*.{woff,woff2}',
  'source/img/*', '!source/img/sprite',
], {
  base: 'source',
})
  .pipe(gulp.dest('build')));

gulp.task('clean', () => del('build'));

gulp.task('css', () => gulp.src('source/sass/style.scss')
  .pipe(plumber())
  .pipe(sass())
  .pipe(postcss([
    autoprefixer(),
  ]))
  .pipe(csso())
  .pipe(gulp.dest('build/css'))
  .pipe(server.stream()));

gulp.task('refresh', (done) => {
  server.reload();
  done();
});

gulp.task('server', () => {
  server.init({
    server: 'build/',
    notify: false,
    open: true,
    cors: true,
    ui: false,
  });

  gulp.watch('source/sass/**/*.{scss,sass}', gulp.series('css'));
  gulp.watch('source/img/sprite/*.svg', gulp.series('sprite', 'html', 'refresh'));
  gulp.watch('source/*.html', gulp.series('html', 'refresh'));
  gulp.watch('source/js/*.js', gulp.series('js', 'refresh'));
});

gulp.task('images', () => gulp.src('source/img/*.{png,jpg,svg}')
  .pipe(imagemin([
    imagemin.optipng({ optimizationLevel: 3 }),
    imagemin.jpegtran({ progressive: true }),
    imagemin.svgo(),
  ]))
  .pipe(gulp.dest('build/img')));

gulp.task('webp', () => gulp.src('source/img/*.{png,jpg}')
  .pipe(webp({ quality: 90 }))
  .pipe(gulp.dest('source')));

gulp.task('sprite', () => gulp.src('source/img/sprite/*.svg')
  .pipe(svgstore({ inlineSvg: true }))
  .pipe(rename('sprite.svg'))
  .pipe(gulp.dest('build/img')));

gulp.task('html', () => gulp.src('source/*.html')
  .pipe(posthtml([
    include(),
  ]))
  .pipe(htmlmin({
    collapseWhitespace: true,
    collapseInlineTagWhitespace: true,
    removeComments: true,
    removeEmptyAttributes: true,
  }))
  .pipe(gulp.dest('build')));

gulp.task('js', () => gulp.src('source/js/**/*.js')
  .pipe(jsmin())
  .pipe(gulp.dest('build/js')));

gulp.task('start', gulp.series('clean', 'copy', 'css', 'sprite', 'html', 'js', 'server'));

gulp.task('build', gulp.series('clean', 'copy', 'css', 'sprite', 'html', 'js', 'images', 'server'));
