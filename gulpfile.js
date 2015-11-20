// Load plugins
var gulp        = require('gulp');
var plugins     = require('gulp-load-plugins')();
var merge       = require('merge-stream');
var browserSync = require('browser-sync');
var reload      = browserSync.reload;
var paths       = require('./gulp_tasks/paths.json');
var files       = require('./gulp_tasks/files.json');
var amdOptimize = require("amd-optimize");

var getTask = function(task) {
  return require('./gulp_tasks/' + task)(gulp, plugins, browserSync, reload, merge, paths, files, amdOptimize);
};

// Get Vendor JS
gulp.task('download', getTask('download'));
// BrowserSync
gulp.task('browser-sync', getTask('browser-sync'));
// Copy
gulp.task('copy', getTask('copy'));
// Styles
gulp.task('styles', getTask('styles'));
// Scripts
gulp.task('scripts', getTask('scripts'));
// images
gulp.task('images', getTask('images'));

// Bundled Tasks
gulp.task('default', [
  'copy',
  'styles',
  'scripts',
  'images',
]);

// Watch
gulp.task('watch', ['browser-sync'], function() {
  // Styles
  gulp.watch(paths.styles.src, ['styles']);
  // Images
  gulp.watch(paths.images.src, ['images', reload]);
  // Scripts
  gulp.watch(paths.scripts.src, ['scripts', reload]);

  // Watch for files that need to be copied
  for (file of files.copy) {
      gulp.watch(file.src, ['copy', reload]);
  }
});
