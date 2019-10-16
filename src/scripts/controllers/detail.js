import detailView from '../views/detail.art';
import swiperView from '../views/component/swiper.art';
import '../../styles/modules/cover-detail.scss';
import BScroll from 'better-scroll';
import store from 'store';
import Model from '../models/detail';
class DetailView {
    async render() {
        let productCurr = store.get('productCurr');
        let productBefore = store.get('productBefore');
        let isSame = productCurr === productBefore;
        store.set('productBefore', productCurr);
        if (!productBefore && !productCurr) {
            location.href = 'index.html';
        }
        this.defaultSku = 0;
        this.selectedList = [];
        this.stairs = 0;
        this.bScroll = null;
        this.stairsEle = null;
        //获取当前商品的信息
        if (!isSame || !(this.spus = store.get('spus'))) {
            let data = await Model.get(productCurr);
            this.spus = data.data.list[0];
            store.set("spus", this.spus);
        }

        this.defaultSkuNo = parseInt(this.spus['shop_info'].default_sku);
        //拿到当前商品的所有次件商品
        let skusArr = this.spus.sku_info.reduce((prev, curr) => {
            prev.push(curr.sku_id)
            return prev;
        }, []);
        //获取所有商品信息
        if (!isSame || !(this.skus = store.get('skus'))) {
            let skusData = await Model.getSkus(skusArr.join(','), true);
            this.skus = skusData.data.list;
            store.set("skus", this.skus);
        }
        //获取推荐的商品
        let recmdArr = this.spus.shop_info.recmd_skus.join(',');
        if (!isSame || !(this.recmd = store.get('recmd'))) {
            let recmdData = await Model.getSkus(recmdArr, false);
            this.recmd = recmdData.data.list;
            store.set('recmd', this.recmd);
        }

        //获取活动信息
        if (!(this.promotion = store.get('promotion'))) {
            let promotion = await Model.getPromotion();
            this.promotion = promotion.data.list;
            store.set('promotion', this.promotion);
        }

        //在skus中找到对应spu默认id的的对象
        this.defaultSku = this.seachSkusDefault(this.defaultSkuNo);
        this.promotionInfo = this.seachPromInfo(this.defaultSkuNo);

        console.log(this.defaultSku);
        console.log(this.promotionInfo);
        console.log(this.recmd);
        let detailViewHtml = detailView({
            data: this.defaultSku,
            promotion: this.promotionInfo,
            attr: Object.values(this.defaultSku.attr_info),
            recmd: this.recmd
        });

        $('#root').html(detailViewHtml).css({
            background: 'none'
        });
        let swiperViewHtml = swiperView({
            banner: this.defaultSku.shop_info.ali_images
        });
        $('.swiper-wrapper').html(swiperViewHtml);
        //图片预占位
        let aliMobile = this.defaultSku.shop_info.tpl_content.base.images.ali_mobile;
        $('.detail-img-list li').css({
            height: 0,
            fontSize: 0,
            paddingBottom: aliMobile.height / aliMobile.width * 100 + '%'
        })
        if (this.defaultSku.shop_info.ali_images.length !== 1) {
            new Swiper('.swiper-container', {
                pagination: {
                    el: '.swiper-pagination',
                    bulletClass: 'my-bullet',
                    bulletActiveClass: 'my-bullet-active'
                },
                loop: true,
            });
        }

        this.bScroll = new BScroll($('.detail-scroll-cont').get(0), {
            probeType: 2,
            bounce: false,
            mouseWheel: true,
            scrollbar: true
        });
        this.stairsEle = $('.stairs-tit');
        this.offsetArr = [];
        for (let i = 0; i < this.stairsEle.length; i++) {
            this.offsetArr.push(- parseInt(this.stairsEle.eq(i).offset().top) - 105);
        }
        this.bindEvent();
    }
    bindEvent() {
        let $stairs = $('.stairs-item');
        $stairs.on('tap', (e) => {
            let { target } = e;
            let index = $(target).index();
            this.stairs = index;
            $(target).addClass("active").siblings().removeClass('active');
            this.bScroll.scrollToElement(this.stairsEle.get(index), 500);
        });
        this.bScroll.on('scroll', (e) => {
            let index = 0;
            for (let i = 0; i < this.offsetArr.length; i++) {
                if (e.y < this.offsetArr[i]) {
                    index = i;
                }
            }
            $stairs.eq(index).addClass("active").siblings().removeClass('active');
        })
        $('.back-bar aside').on('tap', () => {
            history.back();
        })
    }
    //找到默认显示的商品
    seachSkusDefault(index) {
        return this.skus.filter((ele) => {
            return ele.id === index
        })[0];
    }
    //搜索优惠信息
    seachPromInfo(index) {
        let discountInfoArr = [];
        this.promotion.forEach(element => {
            let discountPrice = 0;
            let skus = element.rule.result.discount_skus;
            let boo = false;
            if (skus) {
                boo = element.rule.result.discount_skus.some(ele => {
                    if (ele.sku_id === index) {
                        discountPrice = ele.discount_price
                        return true;
                    }
                    return false;
                })
            }

            if (boo) {
                discountInfoArr.push({
                    tag: element.tag,
                    title: element.title,
                    discount_price: discountPrice
                })
            }
        });
        return discountInfoArr;
    }
}
export default new DetailView().render();
