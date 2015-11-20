module.exports = function(gulp, plugins, browserSync, reload, merge, paths, files, amdOptimize) {
  return function() {
    gulp.src(paths.images.src)
    .pipe(plugins.changed(paths.images.build))
    .pipe(plugins.imagemin())
    .pipe(plugins.size({
      showFiles: true,
      title: 'Images:'
    }))
    .pipe(gulp.dest(paths.images.build))
    .pipe(plugins.duration('compressing images'));
  };
};
