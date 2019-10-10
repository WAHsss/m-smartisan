const path = require("path");
const {src,dest,series,parallel,watch} = require("gulp");
const connect = require('gulp-connect');
const sass = require("gulp-sass");
const webpack = require("webpack-stream");
const proxy = require('http-proxy-middleware');
function gulpServer(){
    return connect.server({
        name : "mobileApp",
        root:"./dev/",
        port:"8080",
        livereload : true,
        middleware : ()=>{
            return [
                proxy('/api',{
                    target:'https://shopapi.smartisan.com/mobile',
                    changeOrigin : true,
                    pathRewrite:{
                        '^/api':''
                    }
                })
            ]
        }
    });
}
function copyHTML(){
    return src("./src/*.html")
            .pipe(dest("./dev/"))
            .pipe(connect.reload())
}

function copySCSS(){
    return src(["./src/styles/**/*.scss","!./src/styles/yo/**/*.scss"])
            .pipe(sass().on('error', sass.logError))
            .pipe(dest("./dev/styles/"))
            .pipe(connect.reload())
}
function packJS(){
    return src(["./src/scripts/app.js"])
    .pipe(webpack({
        mode:"development",//production开发模式
        entry: "./src/scripts/app.js",
        output:{
            path : path.resolve(__dirname,'./dev'),//文件路径自动解析拼接
            filename : 'app.js'
        },
        module:{
            rules:[
                {
                   test : /\.html$/,
                   loader : 'string-loader'
                },{
                    test : /\.art$/,
                    loader : 'art-template-loader'
                }
            ]
        }
    }))
    .pipe(dest('./dev/scripts/'))
    .pipe(connect.reload())
}
function copyLibs(){
    return src("./src/libs/**/*")
            .pipe(dest('./dev/libs/'))
            .pipe(connect.reload())
}

function watchFile(){
    watch('./src/*.html',series(copyHTML));
    watch("./src/styles/**/*.scss",series(copySCSS));
    watch('./src/scripts/**/*',series(packJS));
    watch('./src/libs/*',series(copyLibs));
    watch('./src/assets/**/*',series(copyAssets));
}

function copyAssets(){
    return src('./src/assets/**/*')
            .pipe(dest('./dev/assets'))
            .pipe(connect.reload());
}
exports.default = series(parallel(copyHTML,copySCSS,packJS,copyLibs,copyAssets),parallel(gulpServer,watchFile));