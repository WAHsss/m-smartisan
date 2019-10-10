const layoutView = require('../views/layout.art');

class Index {
    constructor() {
        this.render();
    }
    render() {
        const html = layoutView({});
        $('#root').html(html);
    }
}

new Index();

