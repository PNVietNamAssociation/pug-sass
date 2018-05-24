var gulp = require("gulp");
var pug = require("gulp-pug");
var sass = require("gulp-sass");
var browserSync = require("browser-sync").create();
var uglify = require("gulp-uglify");
var gulpIf = require("gulp-if");
var imagemin = require("gulp-imagemin");
var cache = require("gulp-cache");
var del = require("del");
var runSequence = require("run-sequence");
var concat = require("gulp-concat");
var jshint = require("gulp-jshint");

// start browserSync server
gulp.task("browserSync", function() {
  browserSync.init({
    server: {
      baseDir: "dist"
    }
  });
});

// combine pug
gulp.task("pug", function() {
  return gulp
    .src("app/components/*.pug")
    .pipe(pug())
    .pipe(gulp.dest("dist"))
    .pipe(
      browserSync.reload({
        stream: true
      })
    );
});

// compile sass
gulp.task("sass", function() {
  return gulp
    .src("app/scss/**/*.scss")
    .pipe(sass())
    .pipe(gulp.dest("dist"))
    .pipe(
      browserSync.reload({
        stream: true
      })
    );
});

//combine js
gulp.task("js", function() {
  return gulp
    .src("app/js/*.js")
    .pipe(concat("main.min.js"))
    .pipe(gulp.dest("dist"))
    .pipe(
      browserSync.reload({
        stream: true
      })
    );
});

// combine json file
gulp.task("json", function() {
  return gulp
    .src("app/js/*.json")
    .pipe(gulp.dest("dist"))
    .pipe(
      browserSync.reload({
        stream: true
      })
    );
});

// wathcher
gulp.task("watch", ["browserSync", "sass", "js", "pug", "json"], function() {
  gulp.watch("app/scss/**/*.scss", ["sass"], browserSync.reload);
  gulp.watch("app/**/*.pug", ["pug"], browserSync.reload);
  gulp.watch("app/js/*.js", ["js"], browserSync.reload);
  gulp.watch("app/js/*.json", ["json"], browserSync.reload);
});

// jshint
gulp.task("lint", function() {
  return gulp
    .src("app/js/*.js")
    .pipe(jshint())
    .pipe(jshint.reporter("default"));
});

// Optimize images
gulp.task("images", function() {
  return gulp
    .src("app/vendor/images/**/*.+(png|jpg|jpeg|gif|svg)")
    .pipe(
      cache(
        imagemin({
          interlaced: true
        })
      )
    )
    .pipe(gulp.dest("dist/images"));
});

// Optimize fonts
gulp.task("fonts", function() {
  return gulp.src("app/vendor/fonts/**/*").pipe(gulp.dest("dist/fonts"));
});

// clean
gulp.task("clean", function() {
  return del.sync("dist").then(function(cb) {
    return cache.clearAll(cb);
  });
});
// Use gulp clean:dist to clean all
gulp.task("clean:dist", function() {
  return del.sync(["dist/**/*", "!dist/images", "!dist/images/**/*"]);
});

// Build sequense
gulp.task("default", function(callback) {
  runSequence(["sass", "browserSync", "watch"], callback);
});

gulp.task("build", function(callback) {
  runSequence("clean:dist", ["sass", "images", "fonts"], callback);
});
