'use strict';

const del = require('del');
const gulp = require('gulp');
const gutil = require('gulp-util');
const gulpLoadPlugins = require('gulp-load-plugins');
const electron = require('electron-connect').server.create();


let wiredep = require('wiredep').stream;

const plugins = gulpLoadPlugins();
const sassRoot = 'src/renderer/scss';
const cssRoot = 'dist/css';

const js = 'src/renderer/js/**/*.js';
const jsRoot = 'dist/js/';

const jsBrowser = 'src/browser/js/**/*.js';

const views = 'src/renderer/views/**/*.jade';
const viewsRoot = 'dist/views';

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
  var task = gulp.src(views)
    .pipe(plugins.jade())
    .pipe(wiredep({
      ignorePath: '../'
    }))
    .pipe(plugins.rename(function(path) {
      path.extname = '.html';
    }))
    .pipe(gulp.dest(viewsRoot))
  //restart()
  return task
});

gulp.task('build-sass', () => {
  var task = gulp.src(sassRoot+'/*.scss')
    .pipe(plugins.plumber())
    //.pipe(plugins.notify('Compile Sass File: <%= file.relative %>...'))
    .pipe(plugins.sourcemaps.init())
    .pipe(plugins.autoprefixer('last 10 versions'))
    .pipe(plugins.sass({
      style: 'compressed'
    })).on('error', handleError)
    .pipe(plugins.sourcemaps.write())
    .pipe(gulp.dest(cssRoot))
  //restart()
  return task
});

gulp.task("build-js", function() {
    var task = gulp.src(js)
      .pipe(plugins.sourcemaps.init())
        .pipe(plugins.concat("app.js"))
        //.pipe(plugins.ignore.exclude([ "**/*.map" ]))
        //.pipe(plugins.uglify())
      .pipe(plugins.sourcemaps.write())
      .pipe(gulp.dest(jsRoot))
    //restart()
    return task
});

// ############################################################################################
// ############################################################################################

var hasFinishedInitialBuild = false;

function restart() {
  if(hasFinishedInitialBuild) {
    console.log("restart program")
    exec('killall electron; electron .', function (err, stdout, stderr) {
      console.log(stdout);
      console.log(stderr);
    });
  }
}

gulp.task('watch-sass', () => {
  //plugins.notify('Sass Stream is Active...');
  gulp.watch(sassRoot+'/**/*.scss', ['build-sass', electron.reload]);
});

gulp.task('watch-js', () => {
  //plugins.notify('JavaScript Stream is Active...');
  gulp.watch(js, ['build-js', electron.reload]);
});

gulp.task('watch-jade', () => {
  //plugins.notify('Jade Stream is Active...');
  gulp.watch(views, ['inject-dependencies', electron.reload]);
});

gulp.task('watch-js-browser', () => {
  //plugins.notify('Jade Stream is Active...');
  gulp.watch(jsBrowser, [electron.restart]);
});

var exec = require('child_process').exec;
gulp.task('start', () => {
  /*
  exec('electron .', function (err, stdout, stderr) {
    console.log(stdout);
    console.log(stderr);
  });
  console.log("initial start. restart now if changes are made")
  hasFinishedInitialBuild = true;
  */
  electron.start();

});


// ############################################################################################
// ############################################################################################

gulp.task('default', ['build-sass', 'inject-dependencies', 'build-js'], () => {
  gutil.log('Transposing Sass and JavaScript...');
});

gulp.task('clean', ['clean:styles']);
gulp.task('watch', ['watch-sass', 'watch-js', 'watch-jade']);
gulp.task('develop', ['default', 'watch', 'start'])
