import detailView from '../views/detail.art';
import '../../styles/modules/cover-detail.scss';
import BScroll from 'better-scroll';
import store from 'store';
import Model from '../models/detail';
class DetailView{
    async render(){
        let product = store.get('product');
        //store.remove('product');
        if(!product){
            location.href = 'index.html';
        }
        let data = await Model.get(product);
        console.log(data.data.list);
        this.data = data.data.list[0];
        let detailViewHtml = detailView({
            list : this.data
        });
        $('#root').html(detailViewHtml);

        let bScroll = new BScroll($('.detail-scroll-cont').get(0),{
            probeType:2,
            bounce:false,
            mouseWheel: true,
            scrollbar : true
        });
        let swiper = new Swiper('.swiper-container',{
            pagination: {
                el: '.swiper-pagination',
                bulletClass: 'my-bullet',
                bulletActiveClass: 'my-bullet-active'
            },
            loop : true,
        })
    }
}
export default new DetailView();
