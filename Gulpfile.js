var gulp = require('gulp');
var exec = require('child_process').exec;
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var minify = require('gulp-minify');
var imagemin = require('gulp-imagemin');
var browserSync = require('browser-sync').create();
var supervisor = require('gulp-supervisor');

var jsFiles = [
  './assets/js/**/*.js'
]

gulp.task('sass', function () {
  gulp.src('./assets/scss/**/*.scss')
    .pipe(sass.sync().on('error', sass.logError))
    .pipe(gulp.dest('./dist/stylesheets'))
    .pipe(browserSync.stream());
});

gulp.task('js', function() {
  gulp.src(jsFiles)
    .pipe(concat('scripts.js'))
    .pipe(minify())
    .pipe(gulp.dest('./dist/javascripts'))
})

gulp.task('images', function() {
  gulp.src('assets/img/**/*')
    .pipe(imagemin({
      svgoPlugins: [{
        progressive: true,
        removeViewBox: false
      }]
    }))
    .pipe(gulp.dest('dist/images'))
});

gulp.task('fonts', function() {
  gulp.src('./assets/fonts/**/*')
    .pipe(gulp.dest('./dist/fonts'))
});

gulp.task('static', function() {
  gulp.src('./assets/static/**/*')
    .pipe(gulp.dest('./dist'))
});

gulp.task('browsersync', function() {
  browserSync.init({
    proxy: "localhost:3000",
    port: 3333,
    ui: { port: 3334 },
    open: false
  });

  gulp.watch("assets/scss/**/*.scss", ['sass']);

  gulp.watch("assets/fonts/**/*", ['fonts'])
    .on('change', browserSync.reload);

  gulp.watch("assets/images/**/*", ['images'])
    .on('change', browserSync.reload);

  gulp.watch("assets/js/**/*.js", ['js'])
    .on('change', browserSync.reload);

  gulp.watch("assets/static/**/*", ['static'])
    .on('change', browserSync.reload);

  gulp.watch([
    "bin/www",
    "routes/**/*.js",
    "views/**/*.hbs",
    "locale/**/*.yaml",
    "app.js"
  ]).on('change', browserSync.reload)
});

gulp.task('express', function (cb) {
  supervisor('bin/www', {
    ignore: ['locale', 'assets', 'node_modules'],
    pollInterval: 2000,
  });
});

gulp.task('express-chill', function (cb) {
  supervisor('bin/www', {
    ignore: ['locale', 'assets'],
    pollInterval: 20000,
  });
});

gulp.task('mongo', function(cb) {
  exec('mongod', function (err, stdout, stderr) {
    console.log(stdout);
    console.log(stderr);
    cb(err);
  });
})

gulp.task('serve', ['build', 'mongo', 'express', 'browsersync']);
gulp.task('serve-chill', ['build', 'mongo', 'express-chill', 'browsersync']);

gulp.task('build', ['sass', 'js', 'fonts', 'images', 'static'])
