'use strict';

var gulp = require('gulp'),
  changed = require('gulp-changed'),
  sass = require('gulp-sass'),
  csso = require('gulp-csso'),
  less = require('gulp-less'),
  path = require('path'),
  autoprefixer = require('gulp-autoprefixer'),
  browserify = require('browserify'),
  watchify = require('watchify'),
  source = require('vinyl-source-stream'),
  buffer = require('vinyl-buffer'),
  babelify = require('babelify'),
  uglify = require('gulp-uglify'),
  del = require('del'),
  notify = require('gulp-notify'),
  browserSync = require('browser-sync'),
  sourcemaps = require('gulp-sourcemaps'),
  ghPages = require('gulp-gh-pages'),
  replace = require('gulp-replace'),
  reload = browserSync.reload,
  p = {
    jsx: './scripts/app.jsx',
    scss: 'styles/main.scss',
    less: 'styles/main.less',
    bundle: 'app.js',
    distJs: 'dist/js',
    distCss: 'dist/css'
  };

gulp.task('clean', function (cb) {
  del(['dist'], cb);
});

gulp.task('browserSync', function () {
  browserSync({
    server: {
      baseDir: './'
    }
  });
});

gulp.task('watchify', function () {
  var bundler = watchify(browserify(p.jsx, watchify.args));

  function rebundle() {
    return bundler
      .bundle()
      .on('error', notify.onError())
      .pipe(source(p.bundle))
      .pipe(gulp.dest(p.distJs))
      .pipe(reload({stream: true}));
  }

  bundler.transform(babelify)
    .on('update', rebundle);
  return rebundle();
});

gulp.task('browserify', function () {
  browserify(p.jsx)
    .transform(babelify)
    .bundle()
    .pipe(source(p.bundle))
    .pipe(buffer())
    .pipe(sourcemaps.init({loadMaps: true}))
    .pipe(uglify())
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(p.distJs));
});

gulp.task('styles', function () {
  return gulp.src(p.scss)
    .pipe(changed(p.distCss))
    .pipe(sass({errLogToConsole: true}))
    .on('error', notify.onError())
    .pipe(autoprefixer('last 1 version'))
    .pipe(csso())
    .pipe(gulp.dest(p.distCss))
    .pipe(reload({stream: true}));
});

gulp.task('less', function () {
  return gulp.src(p.less)
    .pipe(less({
      paths: [path.join(__dirname, 'less', 'includes')]
    }))
    .pipe(gulp.dest(p.distCss));
});

gulp.task('watchTask', function () {
  gulp.watch(p.scss, ['styles', 'less']);
});

gulp.task('index', function () {
  gulp.src('index.html')
    .pipe(replace(/"dist\//g, '"'))
    .pipe(gulp.dest('dist'))
});

gulp.task('main', function () {
  gulp.src('main')
    .pipe(gulp.dest('dist'))
});

gulp.task('watch', ['clean'], function () {
  gulp.start(['browserSync', 'watchTask', 'watchify', 'styles', 'less', 'index', 'main']);
});

gulp.task('build', ['clean'], function () {
  process.env.NODE_ENV = 'production';
  gulp.start(['browserify', 'styles', 'less', 'index', 'main']);
});

gulp.task('deploy', function () {
  return gulp.src('./dist/**/*')
    .pipe(ghPages());
});

gulp.task('default', function () {
  console.log('Run "gulp watch or gulp build"');
});
