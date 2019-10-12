import shopView from '../views/shop.art';

class ShopView{
    render(){
        let shopViewHtml = shopView();
        $('main').html(shopViewHtml);
    }
}

export default new ShopView();