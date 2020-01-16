var gulp = require('gulp');
var gulpif = require('gulp-if');
var concat = require('gulp-concat');
var sourcemaps = require('gulp-sourcemaps');
var uglify = require('gulp-uglify');
var parseArgs = require('minimist')

gulp.task('clean', function () {
    return gulp
        .src([
            './src/main/resources/web/js/**/*.js'
        ], {read: false})
        .pipe(clean());
});

gulp.task('default', function () {
    // var uglifyFlag = parseArgs.envName === 'production';
    var uglifyFlag = false;

    return gulp
        .src([
            './src/main/web/app.js',
            './src/main/web/**/!(app)*.js'
        ])
        .pipe(sourcemaps.init())
        .pipe(concat('app.js'))
        .pipe(gulpif(uglifyFlag, uglify({mangle: true})))
        .pipe(gulpif(uglifyFlag, sourcemaps.write()))
        .pipe(gulp.dest('./src/main/resources/web/js/'));
});