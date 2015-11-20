module.exports = function(gulp, plugins, browserSync, reload, merge, paths, files, amdOptimize) {
  return function() {
    browserSync.init({
      server: {
        baseDir: "../gh-pages/"
      }
    });
  };
};
