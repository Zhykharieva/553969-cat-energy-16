var gulp = require("gulp");
var rename = require("gulp-rename");
var gulp = require('gulp');
var webp = require('gulp-webp');


gulp.task("sprite", function(){
  return gulp.src("source/img/icon-*.svg")
  .pipe(svgstore({ inlineSvg: true }))
.pipe(rename("sprite.svg"))
  .pipe(gulp.dest("source/img"));
})

gulp.task("webp", function () {
return    gulp.src("source/img/**/*.{png, jpg}")
.pipe(webp({quality: 90}))
        .pipe(gulp.dest("source/img"));
});

gulp.task("images", function () {
return    gulp.src("source/img/**/*.{png, jpg, svg}")
.pipe(imagemin([imagemin.optipng({optimizationLevel:3})
]))
        .pipe(gulp.dest("source/img"));
});
