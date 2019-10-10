import cartView  from '../views/cart.art';

class Cart{
    render(){
        let cartViewHtml = cartView();
        $("main").html(cartViewHtml);
    }
}

export default new Cart();