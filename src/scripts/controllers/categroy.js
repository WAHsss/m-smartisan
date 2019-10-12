import categroyView from '../views/categroy.art';
import categroySecondView from '../views/categroy-second.art';
import searchBarView from '../views/search-bar.art';
import catagroyModel from '../models/categroy';

class Categroy {
    async render() {
        this.currIndex = 0;
        this.bScroll = null;
        //注意每次重新载入二级页面都需要重新获取高度
        this.th = 0;
        //获取搜索框
        let searchBarHtml = searchBarView();

        //获取接口中的数据
        let data = await catagroyModel.getClassify()
        this.data=data.data;
        let categroyViewHtml = categroyView({
            list: this.data
        });
        //先将分类的包裹容器插入页面
        $("main").html(categroyViewHtml);
        //然后将搜索框插入，原因为将搜索框布局到分类的包裹容器中
        $('.categroy-wrapper').html((index, oldHtml) => searchBarHtml + oldHtml);
        this.$scroll_wrap = $('.right-wrap');
        this.$scroll_cont = $('.sub-page-scroll-wrap');
        this.$router = $('.categroy-router-item');
        this.renderer();
        this.bindEvent();
    }
    renderer(){
        this.$router.eq(this.currIndex).addClass('active').siblings().removeClass('active');
        let categroySecondViewHtml = categroySecondView({
            item: this.data[this.currIndex]
        })
        this.$scroll_cont.html(categroySecondViewHtml);
        this.$scroll_wrap.scrollTop(0);
        //页面数据重新渲染，需重新获取滚动的高度
        this.th = this.$scroll_wrap.get(0).scrollHeight;
    }
    bindEvent(){
        let startY,moveEndY,Y,h;
        this.$router.on('tap',this.changeSecond.bind(this));
        $(document).on('touchstart',(e)=>{
            startY = e.touches[0].pageY;
        });
        $(document).on('touchmove',(e)=>{
            moveEndY = e.changedTouches[0].pageY;
            Y = moveEndY - startY;
            h =this.$scroll_wrap.scrollTop()+this.$scroll_wrap.get(0).clientHeight;
            
        });
        $(document).on("touchend",(e)=>{
            if(Y<0 && this.th === h){
                console.log('向下',"到底了");
                this.changeCurrIndex(true) ? this.renderer() : '';

            }
            if(Y>0 && this.$scroll_wrap.scrollTop() === 0){
                console.log("向上","到底了");
                this.changeCurrIndex() ? this.renderer() : '';
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
        console.log(this.currIndex);
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

export default new Categroy();