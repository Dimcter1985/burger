const { src, dest, task, series, watch, parallel } = require("gulp");
const rm = require('gulp-rm');
const sass = require('gulp-sass');
const concat = require('gulp-concat');
const browserSync = require('browser-sync').create();
const reload = browserSync.reload;
const sassGlob = require('gulp-sass-glob');
const autoprefixer = require('gulp-autoprefixer');
const gcmq = require('gulp-group-css-media-queries');
const cleanCSS = require('gulp-clean-css');
const sourcemaps = require('gulp-sourcemaps');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');
const svgo = require('gulp-svgo');
const gulpif = require('gulp-if');
const imagemin = require('gulp-imagemin');
 
const env = process.env.NODE_ENV;
 
const {SRC_PATH, DIST_PATH, JS_LIBS, STYLE_LIBS} = require('./gulp.config');

 
sass.compiler = require('node-sass');
 
task('clean', () => {
 return src(`${DIST_PATH}/**/*`, { read: false })
   .pipe(rm())
})
 
task('copy:html', () => {
 return src(`${SRC_PATH}/*.html`)
   .pipe(dest(DIST_PATH))
   .pipe(reload({ stream: true }));
});

task('copy:fonts', () => {
  return src(`${SRC_PATH}/fonts/*`)
  .pipe(dest(`${DIST_PATH}/fonts`))
  .pipe(reload({stream: true}));
});

task('images', () => {
  return src(`${SRC_PATH}/images/**/*`)
  .pipe(dest('dist/images'))
  .pipe(reload({stream: true}))
  .pipe(imagemin());
});
 
task('styles', () => {
 return src([...STYLE_LIBS, 'src/styles/main.scss'])
   .pipe(gulpif(env === 'dev', sourcemaps.init()))
   .pipe(concat('main.min.scss'))
   .pipe(sassGlob())
   .pipe(sass().on('error', sass.logError))
  //  .pipe(px2rem())
   .pipe(gulpif(env === 'prod', autoprefixer({
       overrideBrowserslist: ['last 2 versions'],
       cascade: false
     })))
   .pipe(gulpif(env === 'prod', gcmq()))
   .pipe(gulpif(env === 'prod', cleanCSS()))
   .pipe(gulpif(env === 'dev', sourcemaps.write()))
   .pipe(dest(DIST_PATH))
   .pipe(reload({ stream: true }));
});
 
task('scripts', () => {
 return src([...JS_LIBS, 'src/scripts/*.js'])
   .pipe(gulpif(env === 'dev', sourcemaps.init()))
   .pipe(concat('main.min.js', {newLine: ';'}))
   .pipe(gulpif(env === 'prod', babel({
       presets: ['@babel/env']
     })))
   .pipe(gulpif(env === 'prod', uglify()))
   .pipe(gulpif(env === 'dev', sourcemaps.write()))
   .pipe(dest(DIST_PATH))
   .pipe(reload({ stream: true }));
});
 
task('icons', () => {
 return src('src/images/icons/*.svg')
   .pipe(svgo({
     plugins: [
       {
         removeAttrs: {
           attrs: '(fill|stroke|style|width|height|data.*)'
         }
       }
     ]
   }))
   .pipe(dest(`${DIST_PATH}/images/icons`));
});
 
task('server', () => {
 browserSync.init({
     server: {
         baseDir: "./dist"
     },
     open: false
 });
});
 
task('watch', () => {
 watch('./src/styles/**/*.scss', series('styles'));
 watch('./src/*.html', series('copy:html'));
 watch('./src/scripts/*.js', series('scripts'));
 watch('./src/fonts/*', series('copy:fonts'));
 watch('./src/images/icons/*.svg', series('icons'));
});
 
 
task('default',
 series(
   'clean',
   parallel('copy:html', 'copy:fonts', 'styles', 'scripts', 'images', 'icons'),
   parallel('watch', 'server')
 )
);
 
task('build',
 series(
   'clean',
   parallel('copy:html', 'copy:fonts', 'styles', 'scripts', 'images', 'icons'))
);