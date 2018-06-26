var gulp = require('gulp'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    // sass = require('gulp-ruby-sass'),
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    cssnano = require('gulp-cssnano'),
    browserSync = require('browser-sync').create();


var paths = {
  src: {
      scss: 'src/assets/scss/**/*.scss',
      css_dest: 'src/assets/css'
  }
};

var DEST = 'build/';

gulp.task('scripts', function() {
    return gulp.src([
        'src/js/helpers/*.js',
        'src/js/*.js',
      ])
      .pipe(concat('custom.js'))
      .pipe(gulp.dest(DEST+'/js'))
      .pipe(rename({suffix: '.min'}))
      .pipe(uglify())
      .pipe(gulp.dest(DEST+'/js'))
      .pipe(browserSync.stream());
});

// TODO: Maybe we can simplify how sass compile the minify and unminify version
// var compileSASS = function (filename, options) {
//   return sass('src/scss/*.scss', options)
//         .pipe(autoprefixer('last 2 versions', '> 5%'))
//         .pipe(concat(filename))
//         .pipe(gulp.dest(DEST+'/css'))
//         .pipe(browserSync.stream());
// };
//
// gulp.task('sass', function() {
//     return compileSASS('custom.css', {});
// });
//
// gulp.task('sass-minify', function() {
//     return compileSASS('custom.min.css', {style: 'compressed'});
// });

gulp.task('scss-to-css', function() {
  return gulp.src('src/scss/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer())
    .pipe(concat('custom.min.css'))
    .pipe(cssnano({ minifyFontValues: false, discardUnused: false }))
    .pipe(gulp.dest(DEST+'/css'))
    .pipe(browserSync.stream());
});

gulp.task('browser-sync', function() {
    browserSync.init({
        server: {
            baseDir: './'
        },
        startPath: './production/index.html'
    });
});

gulp.task('watch', function() {
  // Watch .html files
  gulp.watch('production/*.html', browserSync.reload);
  // Watch .js files
  gulp.watch('src/js/*.js', ['scripts']);
  // Watch .scss files
  gulp.watch('src/scss/*.scss', ['scss-to-css']);
});

// Default Task
gulp.task('default', ['browser-sync', 'watch']);
