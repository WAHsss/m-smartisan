import cartView from '../views/cart.art';
import callBack from '../tools/callback';
import BScroll  from 'better-scroll';
/**
 ** cartInfo = {
  *  id : number,
  *  tit : string,
  *  subtit: string,
  *  price :{
  *      cate : string,
  *      num : string
  *  },
  *  attr : [{
  *       spec_name: string,
  *       value : string
  *    }],
  *  img : url,
  *  count : number
  * }
 */

class Cart extends callBack {
    render() {
        this.$cartNum = $('.cart-num');
        this.$cartNum .css('display','block');
        
        this.initCallback();
        this.setNum();
        let cartViewHtml = cartView();
        $("main").html(cartViewHtml);
        this.$cartList = $('.cart-list');
        this.$selectNum = $('.select-num');
        this.$selectMoney = $('.sum-money-box .money-num');
        this.$allSelect = $('#select-all');
        this.$edit = $('.edit');
        this.$btnCont = $('.btn-container');
        this.$listSelect = null;
        this.obs.add(this.setCountBar.bind(this));
        this.setCountBar();
        this.renderer();
        this.bScroll = new BScroll($('.cart-scroll-wrap').get(0),{
            probeType:2,
            bounce : false,
            mouseWheel : true
        })
        this.bindEvent();
    }
    bindEvent(){
        this.$cartList.on('tap','.selected-box',this.handleSelectSingle.bind(this));
        this.$allSelect.on('tap',this.handleSelectAll.bind(this));
        this.$edit.on('tap',this.handleEdit.bind(this));
        this.$cartList.on('tap','.add',this.addGoodsCount.bind(this));
        this.$cartList.on('tap','.reduce',this.reduceGoodsCount.bind(this));
    }
    addGoodsCount(evt){
        let {target} = evt;
        let $target = $(target);
        
    }
    reduceGoodsCount(evt){
        let {target} = evt;
        let $target = $(target);
    }
    handleEdit(){
        let $coupon = $('.coupon-fluid');
        $coupon.toggleClass('none');
        $('.white-base').toggleClass('none');
        $('.sum-money-box').toggleClass('none');
        $('.single-number').toggleClass('none');
        $('.change-box').toggleClass('none');
        if($coupon.hasClass('none')){
            this.$edit.text('完成');
            this.$btnCont.addClass('use-red').text('删除所选');
        }else{
            this.$edit.text('编辑');
            this.$btnCont.removeClass('use-red').text('现在结算');
        }
    }
    handleSelectSingle(evt){
        let {target} = evt;
        let $target = $(target);
        $target.toggleClass('dis');
        if(this.$listSelect.hasClass('dis')){
            this.$allSelect.addClass('dis');
        }else{
            this.$allSelect.removeClass('dis');
        }
        let dataId = $target.parents('.cart-item').data('spu');
        let data =  this.searchInfo(dataId);
        if($target.hasClass('dis')){ 
            this.selectSum-= ~~data.count;
            this.selectSumMoney -= data.count * ~~data.price.num;
        }else{
            this.selectSum += ~~data.count;
            this.selectSumMoney += data.count * ~~data.price.num;
        }
        this.setCountBar();
    }
    
    handleSelectAll(evt){
        let {target} = evt;
        $(target).toggleClass('dis');
        if($(target).hasClass('dis')){
            this.$listSelect.addClass('dis');
            this.$selectNum.text(0);
            this.$selectMoney.text('0.00');
            
        }else{
            this.$listSelect.removeClass('dis');
            this.$selectNum.text(this.sum);
            this.$selectMoney.text(this.sumMoney+'.00');
        }
        this.$btnCont.toggleClass('no-use');
    }
    setCountBar(){
        this.$selectNum.text(this.selectSum);
        this.$selectMoney.text(this.selectSumMoney+'.00');
    }
    searchInfo(id){
        let data = null;
        this.cartData.data.some((ele)=>{
            if(ele.id === ~~id){
                data = ele
                return true;
            }
            return false;
        })
        return data;
    }
    renderer(){
        let html = ``;
        this.cartData.data.forEach(ele => {
            html += `
                <li class="cart-item" data-spu=${ele.id}>
                    <div class="selected-all-wrap"><span class="selected-box"></span></div>
                    <div class="selected-img-wrap">
                        <img src=${ele.img} alt="">
                    </div>
                    <article class="selected-info">
                        <h3 class="selected-tit">${ele.tit}</h3>
                        <p>`;
                        ele.attr.forEach((element,index)=>{
                            if(index === ele.attr.length - 1){
                                html+=`<span>${element.value}</span>`
                            }else{
                                html+=`<span>${element.value}</span>·`
                            } 
                        })
                        html +=`</p>
                        <div class="price-container">
                            <div class="change-box none"><span class="change-btn reduce"></span>${ele.count} <span class="change-btn add"></span></div>
                            <div class="product-price">
                                <span class="money-category">${ele.price.cate}</span>
                                <span class="money-num">${ele.price.num}</span>
                                <span class="single-number">x ${ele.count}</span>
                            </div>
                        </div>
                    </article>
                </li>
            `
        });
        this.$cartList.html(html);
        this.$listSelect = $('.selected-box',this.$cartList);
    }
}

export default new Cart();