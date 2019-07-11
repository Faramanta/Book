"use strict";

const gulp = require('gulp');
const browsersync = require('browser-sync').create();
const autoprefixer = require('gulp-autoprefixer');
const concat = require('gulp-concat');
const cleanCSS = require('gulp-clean-css');
const uglify = require('gulp-uglify');
const htmlmin = require('gulp-htmlmin');
const del = require("del");
const hash = require('gulp-hash');
const references = require('gulp-hash-references');
const preprocess = require("gulp-preprocess");
const rename = require("gulp-rename");
const modifyCssUrls = require('gulp-modify-css-urls');

function browserSync(done) {
    browsersync.init({
        server: {
            baseDir: "./src/",
            index: "_index_tmp.html",
        },
        port: 3000
    });
    done();
}

// BrowserSync Reload
function browserSyncReload(done) {
    browsersync.reload();
    done();
}
/* Следим за изменениями в файлах */
function watchFiles() {
    gulp.watch('./src/css/**/*.css', browserSyncReload)
    gulp.watch('./src/js/**/*.js', browserSyncReload)
    gulp.watch('./src/index.html', create_tmp_index)
    gulp.watch('./src/_index_tmp.html', browserSyncReload)
}

//Копируем и переименуем файл index.html в файл _index_tmp.html для работы livereload 
function create_tmp_index() {
    return gulp
        .src('./src/index.html')
        .pipe(preprocess({ context: { NODE_ENV: "development", DEBUG: true } })) //      To set environment variables in-line
        .pipe(rename('_index_tmp.html'))
        .pipe(gulp.dest('./src/'))
}

// Очищаем assets
function clean() {
    return del(["./build"]);
}
// Минифицируем css, объединяем в один файл и добавляешь хэш в название
function css_min(){
    return gulp
        .src([
        './src/css/normalize.css',
        './src/css/**/*.css',
        './src/css/owlcarousel/owl.theme.books-megafon.css'
        ])
        .pipe(concat('style.css'))
        .pipe(autoprefixer())
        .pipe(modifyCssUrls({
            modify(url, filePath) {
                const new_url = url.replace('../../', '../');
                return new_url;
            }
        }))
        .pipe(cleanCSS())
        .pipe(hash())
        .pipe(gulp.dest("./build/assets/"))
        .pipe(hash.manifest('asset-manifest.json'))
        .pipe(gulp.dest('.')); // Save the manifest file
}

// Минифицируем js, объединяем в один файл и добавляешь хэш в название
function js_min(){
    return gulp
        .src([
            './src/js/jquery-3.3.1.min.js',
            './src/js/owlcarousel/owl.carousel.js',
            './src/js/magnific-popup.js',
            './src/js/jquery.validate.min.js',
            './src/js/jquery.mask.min.js',
            './src/js/config.js',
            './src/js/index.js',
            './src/js/helpers.js',
            './src/js/main.js',
            './src/js/subscription.js',
            './src/js/validate.js',
            './src/js/**/*.js',
        ])
        .pipe(concat('script.js'))
        .pipe(uglify())
        .pipe(hash())
        .pipe(gulp.dest("./build/assets/"))
        .pipe(hash.manifest('asset-manifest.json'))
        .pipe(gulp.dest('.')); // Save the manifest file
}
// Минифицируем html, и обновляем пути на assets
function html_min(){
    return gulp
        .src('./src/index.html')
        .pipe(preprocess({ context: { NODE_ENV: "production", DEBUG: false } })) //      To set environment variables in-line
        .pipe(references('asset-manifest.json')) //обновляем пути в файле согласно манифесту
        .pipe(htmlmin({ collapseWhitespace: true }))
        .pipe(gulp.dest('./build/'));
}
//Копируем изображения в папку build
function copy_images(){
    return gulp
        .src('./src/img/**/*.{gif,jpg,png,svg}')
        .pipe(gulp.dest('./build/img/'));
}

//Копируем шрифты в папку build
function copy_fonts(){
    return gulp
        .src('./src/fonts/**/*.otf')
        .pipe(gulp.dest('./build/fonts/'));
}

//Копируем файлы
function copy_files(){
    return gulp
        .src('./src/*.{xml,webmanifest}')
        .pipe(gulp.dest('./build/'));
}

const build = gulp.series(clean, css_min, js_min, gulp.parallel(copy_images, copy_fonts, copy_files, html_min));
const watch = gulp.series(create_tmp_index, gulp.parallel(watchFiles, browserSync));

// export tasks
exports.clean = clean;
exports.copy_images = copy_images;
exports.copy_fonts = copy_fonts;
exports.copy_files = copy_files;
exports.css_min = css_min;
exports.js_min = js_min;
exports.build = build;
exports.watch = watch;
exports.create_tmp_index = create_tmp_index;
exports.default = watch;
