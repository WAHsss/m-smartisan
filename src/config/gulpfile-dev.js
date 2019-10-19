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
        host: '10.9.49.243',
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
                proxy('/single',{
                    target:'https://shopapi.smartisan.com/product',
                    changeOrigin : true,
                    pathRewrite : {
                        '^/single' : ''
                    }
                })
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
    return src(["../scripts/*.js"])
    .pipe(webpack({
        mode:"development",//production开发模式
        entry: {
            app: "../scripts/app.js",
            'app-detail' : "../scripts/app-detail.js"
        },
        output:{
            path : path.resolve(__dirname,`${dirPath}`),//文件路径自动解析拼接
            filename : '[name].js'
        },
        module:{
            rules:[
                {
                   test : /\.html$/,
                   loader : 'string-loader'
                },{
                    test : /\.art$/,
                    loader : 'art-template-loader'
                },{
                    test:/\.scss$/,
                    use:[
                        'style-loader',
                        'css-loader',
                        'sass-loader'
                    ]
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