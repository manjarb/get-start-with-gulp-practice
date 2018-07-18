// Load Node Modules/Plugins
import gulp from 'gulp';
import concat from 'gulp-concat';
import uglify from 'gulp-uglify';
import jshint from 'gulp-jshint';
import imagemin from 'gulp-imagemin';
import connect from 'connect';
import serve from 'serve-static';
import browsersync from 'browser-sync';
import postcss from 'gulp-postcss';
import cssnext from 'postcss-cssnext';
import cssnano from 'cssnano';
import browserify from 'browserify';
import source from 'vinyl-source-stream';
import buffer from 'vinyl-buffer';
import plumber from 'gulp-plumber';
import beeper from 'beeper';
import del from 'del';
import sourcemaps from 'gulp-sourcemaps';

// Error Handler
function onError(err) {
    beeper();
    console.log('Name:', err.name);
    console.log('Reason:', err.reason);
    console.log('File:', err.file);
    console.log('Line:', err.line);
    console.log('Column:', err.column);
}

// For myth
gulp.task('myth-styles', function () {
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

// Styles Task
// Can add array to Src also
// var cssFiles = ['assets/css/normalize.css', 'assets/css/*.css'];

gulp.task('styles', ['clean'], function () {
    gulp.src('app/css/*.css')
        .pipe(plumber({
            errorHandler: onError
        }))
        .pipe(concat('all.css'))
        .pipe(postcss([
            cssnext(),
            cssnano()
        ]))
        .pipe(gulp.dest('dist'));
});

gulp.task('scripts', function () {
    return gulp.src('app/js/*.js')
        .pipe(sourcemaps.init()) // Added
        .pipe(jshint())
        .pipe(jshint.reporter('default'))
        .pipe(concat('all.js'))
        .pipe(uglify())
        .pipe(sourcemaps.write()) // Added
        .pipe(gulp.dest('dist'));
});

// Browserify Task
gulp.task('browserify', function() {
    return browserify('./app/js/app.js')
        .transform('babelify', {
            presets: ['env']
        })
        .bundle()
        .pipe(source('bundle.js'))
        .pipe(buffer())
        .pipe(gulp.dest('dist'));
});

gulp.task('images', function () {
    return gulp.src('app/img/*')
        .pipe(imagemin())
        .pipe(gulp.dest('dist/img'));
});

gulp.task('watch', function () {
    gulp.watch('app/css/*.css', ['styles', browsersync.reload]);
    gulp.watch('app/js/*.js', ['scripts', browsersync.reload]);
    gulp.watch('app/img/*', ['images', browsersync.reload]);
});

gulp.task('server', function () {
    return connect().use(serve(__dirname))
        .listen(8080)
        .on('listening', function () {
            console.log('Server Running: View at http://localhost:8080');
        });
});

gulp.task('browsersync', function () {
    return browsersync({
        server: {
            baseDir: './'
        }
    });
});

gulp.task('clean', function () {
    return del(['dist']);
});

gulp.task('default', ['styles', 'scripts', 'images', 'browsersync', 'watch']);