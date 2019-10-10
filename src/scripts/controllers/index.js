const layoutView = require('../views/layout.art');

class Index {
    render() {
        const html = layoutView({});
        $('#root').html(html);
        $('footer li').on('click',this.bindClick)
    }
    bindClick(){
        location.hash = $(this).data('to');
    }
}

export default new Index();

