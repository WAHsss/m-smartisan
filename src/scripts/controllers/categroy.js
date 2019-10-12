import categroyView from '../views/categroy.art';
import categroySecondView from '../views/categroy-second.art';
import searchBarView from '../views/search-bar.art';
import catagroyModel from '../models/categroy';
import BScroll from 'better-scroll';

class Categroy {
    async render() {
        this.currIndex = 0;
        this.bScroll = null;
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
        let categroySecondViewHtml = categroySecondView({
            item: this.data[this.currIndex]
        })
        this.$scroll_cont.html(categroySecondViewHtml);
        this.bScroll.refresh();
    }
    bindEvent(){
        this.$router.on('click',this.changeSecond.bind(this));
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
                console.log('向下',"到底了");
                this.changeCurrIndex(true) ? this.renderer() : '';
                y =0;
            }else if(y>0 && this.bScroll.y >= 0){
                console.log("向上","到底了");
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
        //console.log(this.currIndex);
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