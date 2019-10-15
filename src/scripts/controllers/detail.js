import detailView from '../views/detail.art';
import '../../styles/modules/cover-detail.scss';
import BScroll from 'better-scroll';
class DetailView{
    render(){
        let detailViewHtml = detailView();
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
// export default 
new DetailView().render();
