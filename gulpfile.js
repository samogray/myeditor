/**
 * Created by Oleksandr on 22.06.2016.
 */
'use strict';


var gulp = require('gulp');
var watch = require('gulp-watch');
var gulpif = require('gulp-if');
var sass = require('gulp-sass');
var postcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer');
var cssnano = require('gulp-cssnano');
var sourcemaps = require('gulp-sourcemaps');
var del = require('del');
var spritesmith = require('gulp.spritesmith');
var browserSync = require('browser-sync').create();
var notify = require("gulp-notify");
var eslint = require('gulp-eslint');
var uglify = require('gulp-uglify');
var svgSprite = require('gulp-svg-sprite');
var pump = require('pump');
var imagemin = require('gulp-imagemin');
var remember = require('gulp-remember');
var cache = require('gulp-cached');
var concat = require('gulp-concat');
var path = require('path');
var mainBowerFiles = require('gulp-main-bower-files');
var gulpFilter = require('gulp-filter');
var stylus = require('gulp-stylus')


var isDevelopment = !process.env.NODE_ENV || process.env.NODE_ENV == 'dev';
/*SET NODE_ENV=dev (production)  --- команда для віндовс*/


gulp.task('styles', function () {

    var processors = [
        autoprefixer({browsers: ['last 3 version']}),
        require('postcss-inline-svg'),
        require('postcss-svgo')
    ];
    return gulp.src('dev/styles/style.scss')
        .pipe(gulpif(isDevelopment, sourcemaps.init()))
        .pipe(sass({
                /* outputStyle: 'compressed'*/
            })
        )
        .pipe(cache('styles'))
        .pipe(postcss(processors))
        .pipe(remember('styles'))
        .pipe(gulpif(isDevelopment, sourcemaps.write()))
        .pipe(gulp.dest('dev/assets/css/')).pipe(browserSync.stream());
});


gulp.task('style:sprite', function () {
    return gulp.src('dev/sprite/**/*.{png, jpg, svg}')
        .pipe(spritesmith({
            imgName: 'sprite.png',
            cssName: 'sprite.scss'
        })).pipe(gulpif('*.scss', gulp.dest('tmp/sprite'), gulp.dest('public/css')));
});

gulp.task('style:svg', function () {
    var config = {
        mode: {
            css: {
                dest: '.',
                bust: false,
                sprite: 'icons.svg',
                layout: 'vertical',
                prefix: '%-',
                dimensions: true,
                render: {
                    scss: true,
                    dest: 'sprite.scss'
                }
            }
        }
    };
    return gulp.src('dev/sprite/**/*.svg')
        .pipe(svgSprite(config))
        .pipe(gulpif('*.scss', gulp.dest('tmp/sprite'), gulp.dest('public/css')));
});

gulp.task('imgmib', function () {
        gulp.src('src/images/*')
            .pipe(imagemin())
            .pipe(gulp.dest('dist/images'))
    }
);

gulp.task('assets', function () {
    return gulp.src(['dev/assets/**', '!dev/assets/js/*.js'/*, '!dev/assets/css/!*.css'*/], {since: gulp.lastRun('assets')})
        .pipe(gulp.dest('public'));
});

gulp.task('assets-git-dev', function () {
    return gulp.src('dev/**', {since: gulp.lastRun('assets-git-dev')})
        .pipe(gulp.dest('concept/concepts/fitable/dev'));
});
gulp.task('assets-git-public', function () {
    return gulp.src('public/**', {since: gulp.lastRun('assets-git-public')})
        .pipe(gulp.dest('concept/concepts/fitable/public'));
});

gulp.task('concat', function () {
    return gulp.src('dev/assets/js/*.js')
        .pipe(concat('build.js'))
        .pipe(gulp.dest('tmp/js/'));
});

gulp.task('uglify', function (cb) {
    pump([
            gulp.src('tmp/js/build.js', {since: gulp.lastRun('uglify')}),
            uglify(),
            gulp.dest('public/js')
        ],
        cb
    );
});

gulp.task('clean', function () {
    return del('public');
});

gulp.task('build', gulp.series('clean', 'styles'/*, 'postcss'*/,'concat', 'uglify', 'style:svg', 'assets'));
gulp.task('git', gulp.parallel('assets-git-public', 'assets-git-dev'));

gulp.task('watch', function () {
    gulp.watch('dev/styles/**/*.scss', gulp.series('styles')).on('unlink', function (filepath) {
        remember.forget('styles', path.resolve(filepath));
        delete cache.caches.styles[path.resolve(filepath)];
    });
    gulp.watch('dev/assets/js/**/*.js', gulp.series('concat'));
   /* gulp.watch('dev/assets/css/!*.css', gulp.series('postcss'));*/
    gulp.watch('tmp/js/build.js', gulp.series('uglify'));
    gulp.watch('dev/assets/**/*.*', gulp.series('assets'));

});

gulp.task('serve', function () {
    browserSync.init({
         server: "./dev/assets"
    });
    browserSync.watch('public/**/*.*').on('change', browserSync.reload);

});

gulp.task('dev', gulp.series('build', gulp.parallel('serve', 'watch')));//основна команда зборки
