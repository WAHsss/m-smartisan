const path = require("path");
const { src, dest, series, parallel } = require("gulp");
const sass = require("gulp-sass");
const webpack = require("webpack-stream");

const cleanCSS = require('gulp-clean-css');
const rev = require("gulp-rev");
const revCollector =  require("gulp-rev-collector");

const dirPath = "../../build/";
function copyHTML() {
    return src([`${dirPath}rev/**/*.json`,"../*.html"])
        .pipe(revCollector())
        .pipe(dest(`${dirPath}`))
}
function copySCSS() {
    return src(["../styles/*.scss"])
        .pipe(sass().on('error', sass.logError))
        .pipe(cleanCSS({compatibility: 'ie8'}))
        .pipe(rev())
        .pipe(dest(`${dirPath}styles/`))
        .pipe( rev.manifest() )
        .pipe(dest(`${dirPath}rev/styles/`))
}
function packJS() {
    return src(["../scripts/*.js"])
        .pipe(webpack({
            mode: "production",//production开发模式
            entry: {
                app : "../scripts/app.js",
                'app-detail' : "../script/app-detail.js"
            },
            output: {
                path: path.resolve(__dirname, `${dirPath}`),//文件路径自动解析拼接
                filename: '[name].js'
            },
            module: {
                rules: [
                    {
                        test: /\.html$/,
                        loader: 'string-loader'
                    }, {
                        test: /\.art$/,
                        loader: 'art-template-loader'
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
        .pipe(rev())
        .pipe(dest(`${dirPath}scripts/`))
        .pipe(rev.manifest())
        .pipe(dest(`${dirPath}rev/scripts/`))
}
function copyLibs() {
    return src("../libs/**/*")
        .pipe(dest(`${dirPath}libs/`))
}
function copyAssets() {
    return src('../assets/**/*')
        .pipe(dest(`${dirPath}/assets`))
}
exports.default = series(parallel(copySCSS, packJS, copyLibs, copyAssets) ,copyHTML);