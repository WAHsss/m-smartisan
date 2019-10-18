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
    }
    handleSelectSingle(evt){
        let {target} = evt;
        
        $(target).toggleClass('dis');
        if($(target).hasClass('dis')){
            this.$allSelect.addClass('dis');
        }else{
            this.$allSelect.removeClass('dis');
        }
    }
    handleSelectAll(evt){
        let {target} = evt;
        $(target).toggleClass('dis');
        console.log($(target).hasClass('dis'))
        if($(target).hasClass('dis')){
            this.$listSelect.addClass('dis');
        }else{
            this.$listSelect.removeClass('dis');
        }
    }
    setCountBar(){
        console.log(this.sum);
        this.$selectNum.text(this.sum);
        this.$selectMoney.text(this.sumMoney+'.00');
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
                        <div class="product-price">
                            <span class="money-category">${ele.price.cate}</span>
                            <span class="money-num">${ele.price.num}</span>
                            <span class="single-number">x ${ele.count}</span>
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