const gulp = require('gulp');
const babel = require('gulp-babel');
const plumber = require('gulp-plumber');
const rename = require('gulp-rename');
const autoprefixer = require('gulp-autoprefixer');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const imagemin = require('gulp-imagemin');
const cache = require('gulp-cache');
const sass = require('gulp-sass');
const cleanCSS = require('gulp-clean-css');



gulp.task('styles', function(){
    let stream = gulp.src(['css/poll.scss'])
                     .pipe(plumber({
                       errorHandler: function (error) {
                         console.log(error.message);
                         this.emit('end');
                     }}))
                     .pipe(sass().on('error', sass.logError))
                     .pipe(concat('main.css'))
                     .pipe(gulp.dest('dist/'));
  
    stream.pipe(rename({suffix: '.min'})).pipe(cleanCSS());
  
    return stream.pipe(gulp.dest('dist/'));
  });

gulp.task('scripts', function(){
  let stream = gulp.src([
                    'js/main.js'
                   ])
                   .pipe(plumber({
                     errorHandler: function (error) {
                       console.log(error.message);
                       this.emit('end');
                   }}))
                   .pipe(concat('main.js'))
		               .pipe(babel({
                     presets: ['es2015']
                   }))
                   .pipe(gulp.dest('dist/'));

  stream.pipe(rename({suffix: '.min'})).pipe(uglify());

  return stream.pipe(gulp.dest('dist/'));
});


gulp.task('myTask', function () {
    gulp.start('styles');
    gulp.start('scripts');

    //gulp.watch("css/*.scss", ['styles']);
    //gulp.watch("js/*.js", ['scripts']);

});


