# m-smartisan
smartisan's m-site
锤子的m栈，模拟实现
### Building
1. 需要把项目克隆到本地 
2. 在当前环境执行` npm i `(如果没有安装`gulp-cli`,请在全局安装它)
3. 运行`npm start`
==tips==: 如果项目无法运行?
1. 你可能端口号被占用了 ： 默认端口号为 `8080`
2. 可能你的node版本太低，推荐使用nvm管理node的版本，本项目使用的node版本为`10.14.1` 可以在根目录的`.nvmrc`配置node版本
### 主要页面：
1. position 首页面
2. category 商品分类
3. cart 购物车
4. detail 详情页
5. shopList 单个商品的list页面
6. profile 个人信息展示页面

### 核心技术
1. 脚手架 gulp
单页面，多页面，本地储存
#### 页面 
1. position：100%布局， 吸顶，回到顶部，上拉刷新 
2. category： 100%布局，楼梯+无缝连接
3. cart+detail ：rem布局， 楼梯， 组件类之间的继承，利用订阅者发布者模式+对象的属性定制`Object.defineProperty()`实现数据驱动
4. profile + shopList： 100%布局
 