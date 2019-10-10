const positionView = require('../views/position.art');
const positionListView = require('../views/position-list.art');
const positionSwiperView = require('../views/position-swiper.art');
const PositionModel = require('../models/position');
const BScroll = require('better-scroll');
class Position {
    constructor() {
        this.render();
        this.list = [];
        this.pageNo = 1;
        this.pageTotal = 0;
    }
    async renderer(result){
        this.list = [...this.list,...result.data.skuInfo];
        let positionListHtml = positionListView({
            list: this.list
        })
        $('.product-list-wrap').html(positionListHtml);
    }
    async render() {

        let that = this;
        //加载主体
        let $main = $('main');

        
        let positionViewHtml = positionView({});
        $main.html(positionViewHtml);

        //加载swiper
        let homeRes = await PositionModel.getHome();
        let positionSwiperViewHtml = positionSwiperView({
            banner: homeRes.data[0].list
        });
        $('.swiper-wrapper').html(positionSwiperViewHtml);
        //获取第一页数据
        let result = await PositionModel.get({
            pageNo : 1
        });
        this.pageTotal = result.data.pageTotal;
        this.renderer(result);

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
        let $head_img = $('.head img');
        let $foot_img = $('.foot img');
                
        //初始化滚动区域
        let bScroll = new BScroll.default($main.get(0), {
            probeType: 2,
            bounce : false
        });

        let bScrollInner = new BScroll.default($('.home-box').get(0),{
            probeType:2,
            scrollbar : true
        })
        bScrollInner.scrollBy(0,-40);
        //初始化滚动区域的位置
        // bScroll.scrollBy(0 ,-40,500);
        bScrollInner.on('scrollEnd', async function () {
            if(this.y>-40&&this.y<0){
                bScrollInner.scrollBy(0 ,-40,500);
            }
            //下拉刷新
            if (this.y >= 0) {
                that.pageNo = 1;
                $foot_img.css({
                    display : 'block'
                });
                $foot_img.siblings('b').html("上拉加载更多...");
                $head_img.attr('src', '/assets/images/ajax-loader.gif');
                let result = await PositionModel.get({
                    pageNo : 1
                });
                that.list = [];
                that.renderer(result);
                bScrollInner.scrollBy(0 ,-40,500);
                $head_img.attr('src', '/assets/images/arrow.png');
                $head_img.removeClass('up');
            }
            if(this.y <= this.maxScrollY && that.pageNo<that.pageTotal){
                that.pageNo ++;
                $foot_img.attr('src', '/assets/images/ajax-loader.gif')
                // $foot_img.siblings('b').html("释放以刷新");
                let result = await PositionModel.get({
                    pageNo:that.pageNo
                });
                that.renderer(result);
                bScrollInner.scrollBy(0,40,500);
                $foot_img.attr('src','/assets/images/arrow.png');
                $foot_img.removeClass('down');
            }else if(that.pageNo>=that.pageTotal){
                $foot_img.css({
                    display: 'none'
                });
                $foot_img.siblings('b').html("没有更多了");
            }
        })
        bScrollInner.on('scroll', function () {
            if (this.y > 0) {
                $head_img.addClass('up')
            }

            if (this.maxScrollY > this.y) {
                $foot_img.addClass('down');
            }
        })
    }
}
new Position();