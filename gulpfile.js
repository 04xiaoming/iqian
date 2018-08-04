var gulp = require('gulp'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    rev = require('gulp-rev-append'),
    rename = require('gulp-rename'),
    cssmin = require('gulp-clean-css'),
    browserSync = require('browser-sync');

yargs = require('yargs')
    .options({
        'w': {
            alias: 'watch',
            type: 'boolean'
        },
        's': {
            alias: 'server',
            type: 'boolean'
        },
        'p': {
            alias: 'port',
            type: 'number'
        }
    }).argv;
// //js合并
// gulp.task('jsConcat', function () {
//     gulp.src('src/js/*.js')
//         .pipe(concat('all.js'))//合并后的文件名
//         .pipe(gulp.dest('dist/js'))
//         .pipe(browserSync.reload({stream: true}));
// });
//压缩js
gulp.task('jsmin', function() {
    gulp.src('src/js/libs/*.js') //多个文件以数组形式传入
        .pipe(uglify())
        .pipe(gulp.dest('dist/js/libs'))
        .pipe(browserSync.reload({
            stream: true
        }));
});

// 合并、压缩js文件
gulp.task('js', function() {
    return gulp.src('src/js/*.js')
        .pipe(concat('all.js'))
        .pipe(gulp.dest('dist/js'))
        //.pipe(rename({suffix: '.min'}))
        .pipe(uglify())
        .pipe(gulp.dest('dist/js'))
        .pipe(browserSync.reload({
            stream: true
        }));
});


//对html进行压缩

var htmlmin = require('gulp-htmlmin');
gulp.task('html', function() {
    var options = {
        collapseWhitespace: true,
        collapseBooleanAttributes: true,
        removeComments: true,
        removeEmptyAttributes: true,
        removeScriptTypeAttributes: true,
        removeStyleLinkTypeAttributes: true,
        minifyJS: true,
        minifyCSS: true
    };
    gulp.src('src/*.html')
        .pipe(htmlmin(options))
        .pipe(rev()) //压缩的时候添加版本号
        .pipe(gulp.dest('dist/'));
});


gulp.task('Cssmin', function() {
    gulp.src('src/css/*.css')
        .pipe(cssmin())
        .pipe(gulp.dest('dist/css'))
        .pipe(browserSync.reload({
            stream: true
        }));
});

//sass自动化
var sass = require('gulp-sass');
gulp.task('sass', function() {
    return gulp.src('src/scss/*.scss')
        .pipe(sass({
            outputStyle: 'compressed'
        })).on('error', sass.logError) // 错误信息
        .pipe(gulp.dest('dist/css')); //输出路径
});

//图片压缩
var changed = require('gulp-changed');
var imagemin = require('gulp-imagemin');
var pngquant = require('imagemin-pngquant'); //png图片压缩
gulp.task('images', function() {
    return gulp.src('src/images/**/*.?(png|jpg|gif|JPG|GIF|PNG)')
        .pipe(changed('dist/images/')) // 忽略不变的文件
        .pipe(imagemin({
            optimizationLevel: 5, //类型：Number  默认：3  取值范围：0-7（优化等级）
            progressive: true, //类型：Boolean 默认：false 无损压缩jpg图片
            interlaced: true, //类型：Boolean 默认：false 隔行扫描gif进行渲染
            multipass: true //类型：Boolean 默认：false 多次优化svg直到完全优化
        }))
        .pipe(gulp.dest('dist/images/'));
});

//gulp开启默认任务
gulp.task('default', ['js', 'jsmin', 'Cssmin', 'html', 'images']);

// watch监听
gulp.task('watch', ['release'], function() {
    gulp.watch('src/js/*.js', ['js']);
    gulp.watch('src/js/libs/*.js', ['jsmin']);
    gulp.watch('src/css/*', ['Cssmin']);
    gulp.watch('src/images/**/*.?(png|jpg|gif|JPG|GIF|PNG)', ['images']);
    gulp.watch('src/**/*.html', ['html']);
    gulp.watch('src/scss/*.scss', ['sass']); // 监听的文件
});


gulp.task('server', function() {
    yargs.p = yargs.p || 8080;
    browserSync.init({
        server: {
            baseDir: "./dist"
        },
        ui: {
            port: yargs.p + 1,
            weinre: {
                port: yargs.p + 2
            }
        },
        port: yargs.p,
        startPath: '/'
    });
});

// 参数说明
//  -w: 实时监听
//  -s: 启动服务器
//  -p: 服务器启动端口，默认8080
gulp.task('default', ['release'], function() {
    if (yargs.s) {
        gulp.start('server');
    }

    if (yargs.w) {
        gulp.start('watch');
    }
});