const positionView = require('../views/position.art');
const positionListView = require('../views/position-list.art');
const positionSwiperView = require('../views/component/swiper.art');
const PositionModel = require('../models/position');
const searchBarView = require('../views/search-bar.art');
import store from 'store';
import BScroll from 'better-scroll';
class Position {
    constructor() {
        this.list = [];
        this.pageNo = 1;
        this.pageTotal = 0;
        this.fixdEle = null;
    }
    renderer(result) {
        this.list = [...this.list, ...result.data.skuInfo];
        console.log(this.list);
        
        let positionListHtml = positionListView({
            list: this.list
        })
        $('.product-list-wrap').html(positionListHtml);
    }
    async render() {
        this.ifLoadSearch = false;
        let that = this;
        //加载主体
        let $main = $('main');

        let positionViewHtml = positionView({});
        $main.html(positionViewHtml);
        let $search = $('.search-bar-wrap');
        let $search_size = {
            top: $search.offset().top
        }
        let $back = $('.back-to-top');
        //加载swiper的数据
        let homeRes = await PositionModel.getHome();
        let reg = /\/(\d+\S+)$/;
        let newHomeRes = homeRes.data[0].list.map(ele =>{
            let res = reg.exec(ele.url)
            let temp = res[1];
            if(~~temp){
                ele.url = temp.slice(0,7);
            }else{
                
                ele.url = temp.replace(/type=/,'');
            }
            return ele;
        });
        let positionSwiperViewHtml = positionSwiperView({
            banner: newHomeRes
        });
        $('.swiper-wrapper').html(positionSwiperViewHtml);
        //获取第一页数据
        let result = await PositionModel.get({
            pageNo: 1
        });
        this.pageTotal = result.data.pageTotal;
        this.renderer(result);

        //准备加载搜索框
        let searchBarViewHtml = searchBarView();
        this.fixdEle = $(searchBarViewHtml);
        //当数据都加载完毕后加载轮播
        let swiper = new Swiper('.swiper-container', {
            pagination: {
                el: '.swiper-pagination',
                bulletClass: 'my-bullet',
                bulletActiveClass: 'my-bullet-active'
            },
            loop: true,
            autoplay: true,
        });
        //滚动设置
        let $foot_img = $('.foot img');

        //初始化滚动区域
        let bScroll = new BScroll($('.scroll-container-warp').get(0), {
            probeType: 2,
            bounce: false,
            scrollbar: true,
            mouseWheel:true
        });
        //初始化滚动区域的位置
        // bScroll.scrollBy(0 ,-40,500);
        bScroll.on('scrollEnd', async function () {
            if (this.y <= this.maxScrollY && that.pageNo < that.pageTotal) {
                that.pageNo++;
                $foot_img.attr('src', '/assets/images/ajax-loader.gif')
                // $foot_img.siblings('b').html("释放以刷新");
                let result = await PositionModel.get({
                    pageNo: that.pageNo
                });
                that.renderer(result);
                this.refresh();
                bScroll.scrollBy(0, 40, 500);
                $foot_img.attr('src', '/assets/images/arrow.png');
                $foot_img.removeClass('down');
            } else if (that.pageNo >= that.pageTotal) {
                $foot_img.css({
                    display: 'none'
                });
                $foot_img.siblings('b').html("没有更多了");
            }

        })
        bScroll.on('scroll', function () {
            //判断是否滑动到底部
            if (this.maxScrollY > this.y) {
                $foot_img.addClass('down');
            }
            //判断是否显示回到顶部的按钮
            if (this.y < -800) {
                $back.addClass('active');
            } else {
                $back.removeClass('active');
            }
            //吸顶效果
            if (this.y <= - $search_size.top && !that.ifLoadSearch) {
                that.fixdEle.addClass('shadow').insertBefore('.index-container');
                that.ifLoadSearch = true;
            }
            if ((this.y > - $search_size.top) && that.ifLoadSearch) {
                that.fixdEle.remove();
                that.ifLoadSearch = false;
            }

        })
        $back.on('tap', function () {
            bScroll.scrollTo(0, 0, 500);
            $back.removeClass('active');
            that.fixdEle.remove();
        })
        this.bindEvent();
    }
    bindEvent(){
        $('.product-list-container').on('tap','li[data-spu]',function(){
            console.log(this);
            let id = $(this).data('spu');
            store.set('productCurr',id);
            location.href = './detail.html';
        });
        $('.swiper-container').on('tap','.swiper-slide',function(){
            console.log(this)
            let spu = $(this).data('spu');
            if(Number(spu)){
                store.set('productCurr',spu);
                location.href = 'detail.html';
            }else{
                location.hash = 'shop/'+spu;
            }
        })
    }
}
export default new Position();