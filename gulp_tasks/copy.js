module.exports = function(gulp, plugins, browserSync, reload, merge, paths, files, amdOptimize) {
    return function() {
        for (file of files.copy) {
            gulp.src(file.src)
                .pipe(plugins.changed(file.dest))
                .pipe(gulp.dest(file.dest));
        }
    };
};
