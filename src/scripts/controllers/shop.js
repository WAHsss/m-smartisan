import shopView from '../views/shop.art';
import shopModel from '../models/shop';
import BScroll from 'better-scroll';

class ShopView{
    async render(){
        let reg = /\/(\d+)\?(\w+)$/;
        let path = reg.exec(location.hash);
        if(path[2] == "shop"){
           let data = await shopModel.get(path[1]);
            this.data = data.data;
        }
        $('footer li[data-to=category]').addClass('active').siblings().removeClass('active');
        let shopViewHtml = shopView({
            list : this.data.list
        });
        $('main').html(shopViewHtml);
        this.bindEvent();
        let bScroll = new BScroll($('.shop-scroll-cont').get(0),{
            probeType:2,
            scrollbar:true,
            bounce : false,
            mouseWheel:true
        })
    }
    bindEvent(){
        $('.back-bar aside').on('tap',()=>{
            history.back();
        })
    }
}

export default new ShopView();