import categoryView from '../views/category.art';
import categorySecondView from '../views/category-second.art';
import searchBarView from '../views/search-bar.art';
import categoryModel from '../models/category';
import BScroll from 'better-scroll';
import store from 'store';

class Category {
    async render() {
        this.currIndex = 0;
        this.bScroll = null;
        //获取搜索框
        let searchBarHtml = searchBarView();

        //获取接口中的数据
        let data = await categoryModel.getClassify()
        this.data=data.data;
        let categoryViewHtml = categoryView({
            list: this.data
        });
        //先将分类的包裹容器插入页面
        $("main").html(categoryViewHtml);
        //然后将搜索框插入，原因为将搜索框布局到分类的包裹容器中
        $(searchBarHtml).insertBefore('.body-wrap');
        this.$scroll_wrap = $('.right-wrap');
        this.$scroll_cont = $('.sub-page-scroll-wrap');
        this.$router = $('.category-router-item');
        this.bScroll = new BScroll(this.$scroll_wrap.get(0),{
            probeType:3,
            bounce : false,
            mouseWheel: true
        });
        this.renderer();
        this.bindEvent();
    }
    renderer(){
        this.$router.eq(this.currIndex).addClass('active').siblings().removeClass('active');
        //console.log(this.data)
        let categorySecondViewHtml = categorySecondView({
            item: this.data[this.currIndex]
        })
        this.$scroll_cont.html(categorySecondViewHtml);
        this.bScroll.refresh();
        $('.third-item , .banner-container').on('tap',function(){
            let spu = $(this).data('spu');
            if(~~spu){
                store.set('productCurr',(spu+'').slice(0,7));
                location.href = 'detail.html';
            }else{
                location.hash = 'shop/'+spu;
            }
        })
    }
    bindEvent(){
        this.$router.on('tap',this.changeSecond.bind(this));
        let startY = 0 , moveEndY = 0 , y = 0;
        $(document).on('touchstart',(e)=>{
            startY =  e.touches[0].pageY;
        })
        $(document).on('touchmove',(e)=>{
            moveEndY = e.changedTouches[0].pageY;
            y = moveEndY - startY;
        })
        this.bScroll.on("touchEnd",(e)=>{
            if(y<0 && this.bScroll.y <= this.bScroll.maxScrollY){
                this.changeCurrIndex(true) ? this.renderer() : '';
                y =0;
            }else if(y>0 && this.bScroll.y >= 0){
                this.changeCurrIndex() ? this.renderer() : '';
                y=0;
            }
        })
    }
    changeSecond(evt){
        let {target} = evt;
        let $ele = $(target);
        this.currIndex = $ele.index();
        this.renderer();
    }
    changeCurrIndex(boo){
        let length = this.data.length-1;
        boo ? this.currIndex ++ : this.currIndex --;
        if(this.currIndex > length){
            this.currIndex = length;
            return false;
        }else if(this.currIndex < 0){
            this.currIndex = 0;
            return false;
        } 
        return true;
    }
}

export default new Category();