import gulp from 'gulp'
import browserSync from 'browser-sync'
import pug from 'gulp-pug'
import sass from 'gulp-sass'
import autoprefixer from 'gulp-autoprefixer'
import babel from 'gulp-babel'
import uglify from 'gulp-uglify'
import imagemin from 'gulp-imagemin'
import del from 'del'

const paths = {
  build: 'build',
  images: {
    src: 'app/images/**/*.{jpg,jpeg,png,svg}',
    dest: 'build/images/'
  },
  scripts: {
    src: 'app/js/**/*.js',
    dest: 'build/js/'
  },
  styles: {
    src: 'app/scss/**/*.scss',
    dest: 'build/css/'
  },
  views: {
    src: 'app/templates/**/*.pug',
    dest: 'build/'
  }
}

const clean = () => del([paths.build])
export { clean }

export function styles () {
  return gulp.src(paths.styles.src)
    .pipe(sass({
      outputStyle: 'compressed'
    }).on('error', sass.logError))
    .pipe(autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
    }))
    .pipe(gulp.dest(paths.styles.dest))
    .pipe(browserSync.reload({stream: true}))
}

export function scripts () {
  return gulp.src(paths.scripts.src, { sourcemaps: true })
    .pipe(babel())
    .pipe(uglify())
    .pipe(gulp.dest(paths.scripts.dest))
    .pipe(browserSync.reload({stream: true}))
}

export function images () {
  return gulp.src(paths.images.src, {since: gulp.lastRun('images')})
    .pipe(imagemin({optimizationLevel: 5}))
    .pipe(gulp.dest(paths.images.dest))
    .pipe(browserSync.reload({stream: true}))
}

export function views () {
  return gulp.src(paths.views.src)
    .pipe(pug())
    .pipe(gulp.dest(paths.views.dest))
    .pipe(browserSync.reload({stream: true}))
}

function watchAssets () {
  gulp.watch(paths.scripts.src, scripts)
  gulp.watch(paths.styles.src, styles)
  gulp.watch(paths.images.src, images)
  gulp.watch(paths.views.src, views)

  browserSync.init({
    server: {
      baseDir: paths.build
    }
  })
}

const build = gulp.series(clean, gulp.parallel(styles, scripts, images, views))
export { build }

const watch = gulp.series(clean, build, watchAssets)
export { watch }

export default build
