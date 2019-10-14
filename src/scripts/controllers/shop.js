import shopView from '../views/shop.art';
import shopModel from '../models/shop';

class ShopView{
    async render(){
        // let data = await 
        let shopViewHtml = shopView();
        $('main').html(shopViewHtml);
    }
}

export default new ShopView();