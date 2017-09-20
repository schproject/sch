'use strict';

const babel = require('gulp-babel');
const execFile = require('child_process').execFile;
const flow = require('flow-bin');
const fs = require('fs-extra');
const gulp = require('gulp');
const path = require('path');
const util = require('gulp-util');

gulp.task('build', ['clean', 'flow:check'], () => {
    return gulp.src(path.join(__dirname, 'src/**/*.js'))
               .pipe(babel())
               .pipe(gulp.dest(path.join(__dirname, 'lib')));
});

gulp.task('clean', (done) => {
    fs.remove(path.join(__dirname, 'lib'), done);
});

gulp.task('flow:check', (done) => {
    runFlow('check', done);
});

function runFlow(cmd, callback) {
    execFile(flow, [ cmd ], { cwd: module.__dirname }, function(err, stdout, stderr) {
        if(err && stdout.length > 0) {
            callback(new util.PluginError('flow', stdout));
        } else if(err) {
            callback(err);
        } else {
            util.log(stdout);
            callback();
        }
    });
}
