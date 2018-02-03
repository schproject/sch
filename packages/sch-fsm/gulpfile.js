'use strict';

const babel = require('gulp-babel'),
    execFile = require('child_process').execFile,
    flow = require('flow-bin'),
    fs = require('fs-extra'),
    gulp = require('gulp'),
    mocha = require('gulp-mocha'),
    path = require('path'),
    util = require('gulp-util');

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

gulp.task('test', ['build'], ()  => {
    return gulp.src(path.join(__dirname, 'test/**/*.spec.js'), {
            read: false
        })
        .pipe(babel())
        .pipe(mocha({
            require: 'babel-register'
        }));
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
