import detailView from '../views/detail.art';

class DetailView{
    render(){
        let detailViewHtml = detailView();
        $('main').html(detailViewHtml);
    }
}

export default new DetailView();