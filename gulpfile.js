var gulp = require('gulp');
var concat = require('gulp-concat');
var myth = require('gulp-myth');
var sass = require('gulp-sass');
var uglify = require('gulp-uglify');
var jshint = require('gulp-jshint');
var imagemin = require('gulp-imagemin');
var connect = require('connect');
var serve = require('serve-static');

gulp.task('styles', function () {
    return gulp.src('app/css/*.css')
        .pipe(concat('all.css'))
        .pipe(myth())
        .pipe(gulp.dest('dist'));
});

// For sass
gulp.task('sass-styles', function () {
    return gulp.src('app/css/*.scss')
        .pipe(sass())
        .pipe(gulp.dest('dist'));
});

gulp.task('scripts', function () {
   return gulp.src('app/js/*.js')
       .pipe(jshint())
       .pipe(jshint.reporter('default'))
       .pipe(concat('all.js'))
       .pipe(uglify())
       .pipe(gulp.dest('dist'));
});

gulp.task('images', function () {
   return gulp.src('app/img/*')
       .pipe(imagemin())
       .pipe(gulp.dest('dist/img'));
});

gulp.task('watch', function () {
    gulp.watch('app/css/*.css', ['styles']);
    gulp.watch('app/js/*.js', ['scripts']);
    gulp.watch('app/img/*', ['images']);
});

gulp.task('server', function () {
   return connect().use(serve(__dirname))
       .listen(8080)
       .on('listening', function () {
          console.log('Server Running: View at http://localhost:8080');
       });
});

gulp.task('default', ['styles', 'scripts', 'images', 'watch']);