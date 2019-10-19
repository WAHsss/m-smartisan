const layoutView = require('../views/layout.art');
const store = require('store');
const positionController = require('../controllers/positions');

class Index {
    render() {
        const html = layoutView({});
        $('#root').html(html);
        $('footer li').on('tap', this.bindTap);
        if (store.get('cartList')) {
            $('.cart-num').text('');
        } else {
            $('.cart-num').css('display', 'none');
            
        }
    }
    bindTap() {
        location.hash = $(this).data('to');
    }
}

export default new Index();

