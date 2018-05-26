var gulp = require("gulp");
var pug = require("gulp-pug");
var sass = require("gulp-sass");
var browserSync = require("browser-sync").create();
var imagemin = require("gulp-imagemin");
var cache = require("gulp-cache");
var del = require("del");
var runSequence = require("run-sequence");

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
    .src("app/views/*.pug")
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
    .src("app/styles/**/*.scss")
    .pipe(sass())
    .pipe(gulp.dest("dist/styles"))
    .pipe(
      browserSync.reload({
        stream: true
      })
    );
});

// wathcher
gulp.task("watch", ["browserSync", "sass", "pug"], function() {
  gulp.watch("app/styles/**/*.scss", ["sass"], browserSync.reload);
  gulp.watch("app/**/*.pug", ["pug"], browserSync.reload);
});

// Optimize images
gulp.task("images", function() {
  return gulp
    .src("app/vendors/images/*.+(png|jpg|jpeg|gif|svg)")
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
