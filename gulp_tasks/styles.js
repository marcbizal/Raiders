module.exports = function(gulp, plugins, browserSync, reload, merge, paths, files, amdOptimize) {
    return function() {
        gulp.src(paths.styles.src)
            .pipe(plugins.changed(paths.styles.src))
            .pipe(plugins.plumber({
                handleError: function(err) {
                    console.log(err);
                    this.emit('end');
                }
            }))
            .pipe(plugins.sourcemaps.init())
            .pipe(plugins.sass())
            .pipe(plugins.autoprefixer({
                browsers: ['last 2 versions', 'ie 9']
            }))
            .pipe(plugins.minifyCss({
                'advanced': false
            }))
            .pipe(plugins.sourcemaps.write('sourcemaps'))
            .pipe(plugins.plumber.stop())
            .pipe(plugins.size({
                showFiles: true,
                title: 'Styles:'
            }))
            .pipe(gulp.dest(paths.styles.build))
            .pipe(reload({
                stream: true
            }))
            .pipe(plugins.duration('building styles'));
    };
};
