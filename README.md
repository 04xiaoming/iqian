iqian前端开发环境

前端gulp构建的开源前端开发环境 主要对js合并和压缩、image图片压缩、html代码压缩

js如果不需要压缩的文件,可以放入js/libs

注意:使用本demo 确认已安装node

node-v 查看版本

><link rel="stylesheet" type="text/css" href="css/css.css"/>
><script src="js/libs/jquery.js"></script>
><script src="js/all.min.js"></script>

# gulp 自动化发布工具

gulpfile.js

html进行压缩

``` python
var gulp = require('gulp');
var htmlmin = require('gulp-htmlmin');
gulp.task('html',function(){
    var options = {
        collapseWhitespace:true,
        collapseBooleanAttributes:true,
        removeComments:true,
        removeEmptyAttributes:true,
        removeScriptTypeAttributes:true,
        removeStyleLinkTypeAttributes:true,
        minifyJS:true,
        minifyCSS:true
    };
    gulp.src('src/*.html')
        .pipe(htmlmin(options))
        .pipe(rev())//压缩的时候添加版本号
        .pipe(gulp.dest('dist/'));
});
//不对html进行压缩 仅加版本号并拷贝到dist目录
var gulp = require('gulp');
gulp.task('html',function(){
    gulp.src('src/*.html')
        .pipe(rev())//压缩的时候添加版本号
        .pipe(gulp.dest('dist/'));
});
```
合并、压缩js文件
``` python
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
```

图片压缩
``` python
var changed = require('gulp-changed');
var imagemin = require('gulp-imagemin');
var pngquant = require('imagemin-pngquant');//png图片压缩
gulp.task('images', function () {
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
```

sass自动化
``` python

var sass = require('gulp-sass');
gulp.task('sass', function() {
    return gulp.src('src/scss/*.scss')
        .pipe(sass({
            outputStyle: 'compressed'
        })).on('error', sass.logError) // 错误信息
        .pipe(gulp.dest('dist/css')); //输出路径
});
```
