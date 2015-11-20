module.exports = function(gulp, plugins, browserSync, reload, merge, paths, files, amdOptimize) {
  return function() {
    // Vendor
    var vendor = gulp.src(files.vendor_js)
        .pipe(plugins.changed(paths.scripts.build))
        .pipe(plugins.sourcemaps.init())
        .pipe(plugins.concat('vendor.js'))
        .pipe(plugins.uglify())
        .pipe(plugins.sourcemaps.write('/sourcemaps'))
        .pipe(plugins.size({
          showFiles: true,
          title: 'Dependencies:'
        }))
        .pipe(gulp.dest(paths.scripts.build));

    // Main
    var main = gulp.src(files.js)
        .pipe(plugins.changed(paths.scripts.build))
        .pipe(amdOptimize('main'))
        .pipe(plugins.sourcemaps.init())
        .pipe(plugins.jshint({
          "esnext": true
        }))
        .pipe(plugins.jshint.reporter('jshint-stylish'))
        .pipe(plugins.concat('main.js'))
        .pipe(plugins.babel())
        .pipe(plugins.uglify())
        .pipe(plugins.sourcemaps.write('/sourcemaps'))
        .pipe(plugins.size({
          showFiles: true,
          title: 'App:'
        }))
        .pipe(gulp.dest(paths.scripts.build));

    return merge(vendor, main);
  };
};
