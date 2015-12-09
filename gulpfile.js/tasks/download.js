var gulp        = require('gulp');
var path        = require('path');
var pathExists  = require('path-exists');
var download    = require("gulp-download");
var insert      = require('gulp-insert');
var config      = require('../config');

var downloadTask = function(cb) {
    var dest_path = "";
    for (var file of config.tasks.download.files) {
        var dest_path = path.join(file.dest, path.basename(file.src));
        if (!pathExists.sync(dest_path)) {
            download(file.src)
                .pipe(insert.prepend(file.requires))
                .pipe(gulp.dest(path.join(config.root.src, file.dest)));
        }
    }
    cb();
};

gulp.task('download', downloadTask);
module.exports = downloadTask;
