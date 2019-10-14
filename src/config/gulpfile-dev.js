const path = require("path");
const {src,dest,series,parallel,watch} = require("gulp");
const connect = require('gulp-connect');
const sass = require("gulp-sass");
const webpack = require("webpack-stream");
const proxy = require('http-proxy-middleware');

const dirPath = "../../dev/";
function gulpServer(){
    return connect.server({
        name : "mobileApp",
        root:`${dirPath}`,
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
                }),
                proxy('/shopapi',{
                    target:'https://shopapi.smartisan.com/v1/search/goods-list',
                    changeOrigin : true,
                    pathRewrite:{
                        '^/shopapi':''
                    }
                }),
            ]
        }
    });
}
function copyHTML(){
    return src("../*.html")
            .pipe(dest(`${dirPath}`))
            .pipe(connect.reload())
}

function copySCSS(){
    return src(["../styles/*.scss",])
            .pipe(sass().on('error', sass.logError))
            .pipe(dest(`${dirPath}styles/`))
            .pipe(connect.reload())
}
function packJS(){
    return src(["../scripts/app.js"])
    .pipe(webpack({
        mode:"development",//production开发模式
        entry: "../scripts/app.js",
        output:{
            path : path.resolve(__dirname,`${dirPath}`),//文件路径自动解析拼接
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
    .pipe(dest(`${dirPath}scripts/`))
    .pipe(connect.reload())
}
function copyLibs(){
    return src("../libs/**/*")
            .pipe(dest(`${dirPath}libs/`))
            .pipe(connect.reload())
}

function watchFile(){
    watch('../*.html',series(copyHTML));
    watch("../styles/**/*.scss",series(copySCSS));
    watch('../scripts/**/*',series(packJS));
    watch('../libs/*',series(copyLibs));
    watch('../assets/**/*',series(copyAssets));
}

function copyAssets(){
    return src('../assets/**/*')
            .pipe(dest(`${dirPath}/assets`))
            .pipe(connect.reload());
}
exports.default = series(parallel(copyHTML,copySCSS,packJS,copyLibs,copyAssets),parallel(gulpServer,watchFile));