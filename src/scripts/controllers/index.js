const layoutView = require('../views/layout.art');


class Index {
    render() {
        const html = layoutView({});
        $('#root').html(html);
        $('footer li').on('tap',this.bindTap);
    }
    bindTap(){
        location.hash = $(this).data('to');
        $('.search-bar-wrap').remove();
    }
}

export default new Index();

