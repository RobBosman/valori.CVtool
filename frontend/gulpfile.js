'use strict';

const Gulp = require('gulp');
const clean = require('gulp-clean');
const babel = require('gulp-babel');
const concat = require('gulp-concat');
const sourcemaps = require('gulp-sourcemaps');
const gulpif = require('gulp-if');
const uglify = require('gulp-uglify');

const bundledJsFile = 'bundle.js';
const outDir = 'src/main/resources';

function _clean() {
    return Gulp
        .src(outDir + '/' + bundledJsFile, {allowEmpty: true, read: false})
        .pipe(clean({force: true}));
}

function _build() {
    const isProd = process.argv.join(' ').includes('--targetEnvironment PROD');
    return Gulp
        .src('src/main/jsx/*.jsx')
        .pipe(babel({plugins: ['transform-react-jsx', '@babel/plugin-proposal-class-properties']}))
        .pipe(sourcemaps.init())
        .pipe(concat(bundledJsFile))
        .pipe(gulpif(isProd, uglify()))
        .pipe(gulpif(isProd, sourcemaps.write()))
        .pipe(Gulp.dest(outDir));
}

exports.default = Gulp.series(_clean, _build);