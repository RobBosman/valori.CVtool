const Gulp = require('gulp');
const babel = require('gulp-babel');
const concat = require('gulp-concat');
const sourcemaps = require('gulp-sourcemaps');
const gulpif = require('gulp-if');
const uglify = require('gulp-uglify');
const util = require('gulp-util');

Gulp.task('clean', () => {
    return Gulp
        .src('src/main/resources/bundle.js', {read: false})
        .pipe(clean());
});

Gulp.task('default', () => {
    const uglifyFlag = util.env.targetEnvironment === 'production';
    return Gulp
        .src('src/main/jsx/*.jsx')
        .pipe(babel({plugins: ['transform-react-jsx', '@babel/plugin-proposal-class-properties']}))
        .pipe(sourcemaps.init())
        .pipe(concat('bundle.js'))
        .pipe(gulpif(uglifyFlag, uglify({mangle: true})))
        .pipe(gulpif(uglifyFlag, sourcemaps.write()))
        .pipe(Gulp.dest('src/main/resources/'));
});