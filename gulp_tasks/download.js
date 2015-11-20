module.exports = function(gulp, plugins, browserSync, reload, merge, paths, files, amdOptimize) {
    return function() {
        for (file of files.download) {
            plugins.download(file.from)
                .pipe(gulp.dest(file.to));
        }
    };
};
