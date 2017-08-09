var gulp = require('gulp');
var sass = require('gulp-sass');
var minify = require('gulp-minify');
var autoprefixer = require('gulp-autoprefixer');

// Minify JS
gulp.task('minify', function(){
  gulp.src('js/*.js')
    // Inject new JS into the live-reload server
});

// Compile sass
gulp.task('sass', function(){
  gulp.src('sass/*.sass')
    .pipe(sass({}))
    .pipe(autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
    }))
    .pipe(gulp.dest('css'))
})


// MAIN WATCH TASK
gulp.task('default', ['sass'], function() {
  // Now watch for changes
  // When a sass or js file is changed, compile it
  gulp.watch("sass/*.sass", ['sass']);
  gulp.watch("js/*.js", ['minify']);
});
