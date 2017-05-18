'use strict';

const babel = require('gulp-babel');
const flow = require('gulp-flowtype');
const flowReporter = require('flow-reporter');
const fs = require('fs-extra');
const gulp = require('gulp');
const path = require('path');

gulp.task('build', ['clean', 'typecheck'], () => {
    return gulp.src(path.join(__dirname, 'src/**/*.js'))
               .pipe(babel())
               .pipe(gulp.dest(path.join(__dirname, 'lib')));
});

gulp.task('clean', (done) => {
    fs.remove(path.join(__dirname, 'lib'), done);
});

gulp.task('typecheck', () => {
    return gulp.src(path.join(__dirname, 'src/**/*.js'))
               .pipe(flow({
                   killFlow: true,
                   reporter: flowReporter
               }));
});
