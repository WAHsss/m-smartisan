const positionView = require('../views/position.art');
const positionListView = require('../views/position-list.art');
const positionSwiperView = require('../views/position-swiper.art');
const PositionModel = require('../models/position');
const BScroll = require('better-scroll');
class Position {
    constructor() {
        this.list = [];
        this.pageNo = 1;
        this.pageTotal = 0;
        this.fixdEle = null;
    }
    renderer(result) {
        this.list = [...this.list, ...result.data.skuInfo];
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
        let $search = $('.search-bar-wrap');
        let $search_size = {
            top: $search.offset().top
        }
        let $back = $('.back-to-top');
        //加载swiper的数据
        let homeRes = await PositionModel.getHome();
        let positionSwiperViewHtml = positionSwiperView({
            banner: homeRes.data[0].list
        });
        $('.swiper-wrapper').html(positionSwiperViewHtml);
        //获取第一页数据
        let result = await PositionModel.get({
            pageNo: 1
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
        let $foot_img = $('.foot img');

        //初始化滚动区域
        let bScroll = new BScroll.default($main.get(0), {
            probeType: 3,
            bounce: false,
            scrollbar: true
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
            if (this.maxScrollY > this.y) {
                $foot_img.addClass('down');
            }
            if (this.y <= - $search_size.top) {
                if (!that.fixdEle) {
                    that.fixdEle = $search.clone();
                    that.fixdEle.addClass('shadow').insertBefore('.index-container');
                }
            } else {
                if (that.fixdEle != null) {
                    that.fixdEle.remove();
                    that.fixdEle = null;
                }
            }
            if(this.y<-800){
                $back.addClass('active');
            }else{
                $back.removeClass('active');
            }
        })
        $back.on('click',function(){
            bScroll.scrollTo(0,0,500);
        })
    }
}
export default new Position();