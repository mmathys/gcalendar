'use strict';

const del = require('del');
const gulp = require('gulp');
const gutil = require('gulp-util');
const gulpLoadPlugins = require('gulp-load-plugins');

let wiredep = require('wiredep').stream;

const plugins = gulpLoadPlugins();
const sassRoot = 'src/scss';
const cssRoot = 'dist/css';

const js = 'src/js/**/*.js';
const jsRoot = 'dist/js/';

const views = 'views/**/*.html';
const viewsRoot = 'views/';

function handleError(err) {
  console.log(err.toString());
}

// ############################################################################################
// ############################################################################################

gulp.task('clean:styles', (cb) => {
  del([
    '**/.sass-cache/**',
  ], cb);
});

gulp.task('inject-dependencies', function() {
  return gulp.src(views)
    .pipe(wiredep())
    .pipe(plugins.rename(function(path) {
      path.extname = '.html';
    }))
    .pipe(gulp.dest(viewsRoot));
});

gulp.task('build-sass', () => {
  return gulp.src(sassRoot+'/*.scss')
    .pipe(plugins.plumber())
    .pipe(plugins.notify('Compile Sass File: <%= file.relative %>...'))
    .pipe(plugins.sourcemaps.init())
    .pipe(plugins.autoprefixer('last 10 versions'))
    .pipe(plugins.sass({
      style: 'compressed'
    })).on('error', handleError)
    .pipe(plugins.sourcemaps.write())
    .pipe(gulp.dest(cssRoot));
});

gulp.task("build-js", function() {
    gulp.src(js)
    .pipe(plugins.sourcemaps.init())
      .pipe(plugins.concat("app.js"))
      //.pipe(plugins.ignore.exclude([ "**/*.map" ]))
      //.pipe(plugins.uglify())
    .pipe(plugins.sourcemaps.write())
    .pipe(gulp.dest(jsRoot));
});

// ############################################################################################
// ############################################################################################

gulp.task('watch-sass', () => {
  plugins.notify('Sass Stream is Active...');
  gulp.watch(sassRoot+'/**/*.scss', ['build-sass']);
});

gulp.task('watch-js', () => {
  plugins.notify('JavaScript Stream is Active...');
  gulp.watch(js, ['build-js']);
});

// ############################################################################################
// ############################################################################################

gulp.task('default', ['build-sass', 'inject-dependencies', 'build-js'], () => {
  gutil.log('Transposing Sass and JavaScript...');
});

gulp.task('clean', ['clean:styles']);
gulp.task('watch', ['watch-sass', 'watch-js']);
