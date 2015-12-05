'use strict';

let gulp = require('gulp');
let babel = require('gulp-babel');
let sass = require('gulp-sass');
let concat = require('gulp-concat');
let uglify = require('gulp-uglify');
let rename = require('gulp-rename');
let minify = require('gulp-minify');

let dirs = {
  src: {
    scss: './src/stylesheets/*.scss',
    js: "./src/javascripts/**/*.js",
  },
  dist: {
    css: './public/css',
    js: './public/js',
  }
};

gulp.task('sass', function(){
  return gulp.src(dirs.src.scss)
    .pipe(sass())
    .pipe(gulp.dest(dirs.dist.css));
});

gulp.task('scripts', function(){
  return gulp.src(dirs.src.js)
    .pipe(babel({
      presets: ['es2015']
     }))
    .pipe(concat('all.js'))
    .pipe(gulp.dest(dirs.dist.js))
    .pipe(rename('all.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest(dirs.dist.js))
});


gulp.task('watch', function(){
  gulp.watch(dirs.src.js, ['scripts']);
  gulp.watch(dirs.src.scss, ['sass']);
  gulp.watch(dirs.src.html, ['html']);
  gulp.watch(dirs.src.img, ['images']);
});

gulp.task('deploy', ['sass', 'scripts']);

gulp.task('default', ['sass', 'scripts', "watch"]);
