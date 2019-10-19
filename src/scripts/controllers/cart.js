import cartView from '../views/cart.art';
import callBack from '../tools/callback';
import BScroll from 'better-scroll';
import recmdView from '../views/component/recmd.art';
import emptyCartView from '../views/component/empty-cart.art';
import store from 'store';
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
    render(){
        this.$cartNum = $('.cart-num');
        this.$cartNum.css('display', 'block');
        this.initCallback();
        this.setNum();
        if(this.cartData.data.length > 0){
            this.listRender();
        }else{
            this.emptyRender();
        }
        $('#root').on('tap','.now-buy',()=>{
            location.hash = "position";
        });
    }
    
    emptyRender(){
        let emptyCartViewHtml = emptyCartView();
        $("main").html(emptyCartViewHtml);
    }
    listRender() {
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
        let recmd = null;
        if((recmd = store.get('recmd')) && recmd.length !== 0 ){
            let recmdViewHtml = recmdView({
                recmd
            });
            $(recmdViewHtml).appendTo('.cart-scroll-container');
        }
        
        this.singleCount = $('.single-count');
        this.disableChange();
        this.bScroll = new BScroll($('.cart-scroll-wrap').get(0), {
            probeType: 2,
            bounce: false,
            mouseWheel: true
        })
        this.bindEvent();
    }
    bindEvent() {
        this.$cartList.on('tap', '.selected-box', this.handleSelectSingle.bind(this));
        this.$allSelect.on('tap', this.handleSelectAll.bind(this));
        this.$edit.on('tap', this.handleEdit.bind(this));
        this.$cartList.on('tap', '.add', this.changeGoodsCount.bind(this));
        this.$cartList.on('tap', '.reduce', this.changeGoodsCount.bind(this));
        this.$btnCont.on('tap',this.handleDelete.bind(this));
    }
    handleDelete(evt){
        let { target } = evt;
        let $target = $(target);
        let temp = this.cartData.data;
        if($target.text().trim() === "删除所选"){
            let deleteArr = [];
            this.$listSelect.forEach((item)=>{
                let $item = $(item);
                if(!$item.hasClass('dis')){
                    let $parent = $item.parents('.cart-item');
                    deleteArr.push(~~$parent.data('spu'));
                    $parent.remove();
                }
            });
            for(let i = temp.length - 1 ; i >= 0 ; i--){
                console.log(deleteArr.indexOf(temp[i].id))
                if(deleteArr.indexOf(temp[i].id)>=0){
                    temp.splice(i,1);
                }
            }
            this.cartData.data = temp;
            if(this.cartData.data.length === 0){
                this.emptyRender();
            }
        }else{
            return false;
        }
    }
    changeGoodsCount(evt) {
        let { target } = evt;
        let $target = $(target);
        let that = this;
        let dataId = $target.parents('.cart-item').data('spu');
        let data = this.searchInfo(dataId);
        let temp = this.cartData.data;
        temp.some((ele) => {
            if (ele.id === ~~dataId) {
                if ($target.text() === '-') {
                    if (ele.count > 1) {
                        --ele.count
                    } else {
                        ele.count = 1;
                    }
                } else {
                    if (ele.count < 5) {
                        ++ele.count;
                    } else {
                        ele.count = 5;
                    }
                }
                that.disableChange();
                $target.siblings('.single-count').text(ele.count);
                $target.parent('.change-box ').siblings('.product-price').children('.single-number').text('x' + ele.count);
                return true;
            }
            return false;
        });
        this.cartData.data = temp;
    }
    disableChange() {
        this.singleCount.forEach((item) => {
            let num = ~~$(item).text();
            if (num === 5) {
                $(item).siblings('.add').css('opacity', '0.3');
            } else if (num === 1) {
                $(item).siblings('.reduce').css('opacity', '0.3');
            } else {
                $(item).siblings().css('opacity', 1);
            }
        })
    }
    handleEdit() {
        let $coupon = $('.coupon-fluid');
        $coupon.toggleClass('none');
        $('.white-base').toggleClass('none');
        $('.sum-money-box').toggleClass('none');
        $('.single-number').toggleClass('none');
        $('.change-box').toggleClass('none');
        if ($coupon.hasClass('none')) {
            this.$edit.text('完成');
            this.$btnCont.addClass('use-red').text('删除所选');
        } else {
            this.$edit.text('编辑');
            this.$btnCont.removeClass('use-red').text('现在结算');
        }
    }
    handleSelectSingle(evt) {
        let { target } = evt;
        let $target = $(target);
        $target.toggleClass('dis');
        if (this.$listSelect.hasClass('dis')) {
            this.$allSelect.addClass('dis');
        } else {
            this.$allSelect.removeClass('dis');
        }
        let dataId = $target.parents('.cart-item').data('spu');
        let data = this.searchInfo(dataId);
        if ($target.hasClass('dis')) {
            this.selectSum -= ~~data.count;
            this.selectSumMoney -= data.count * ~~data.price.num;
        } else {
            this.selectSum += ~~data.count;
            this.selectSumMoney += data.count * ~~data.price.num;
        }
        this.setCountBar();
    }

    handleSelectAll(evt) {
        let { target } = evt;
        $(target).toggleClass('dis');
        if ($(target).hasClass('dis')) {
            this.$listSelect.addClass('dis');
            this.$selectNum.text(0);
            this.$selectMoney.text('0.00');

        } else {
            this.$listSelect.removeClass('dis');
            this.$selectNum.text(this.sum);
            this.$selectMoney.text(this.sumMoney + '.00');
        }
        this.$btnCont.toggleClass('no-use');
    }
    setCountBar() {
        this.$selectNum.text(this.selectSum);
        this.$selectMoney.text(this.selectSumMoney + '.00');
    }
    searchInfo(id) {
        let data = null;
        this.cartData.data.some((ele) => {
            if (ele.id === ~~id) {
                data = ele
                return true;
            }
            return false;
        })
        return data;
    }
    renderer() {
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
            ele.attr.forEach((element, index) => {
                if (index === ele.attr.length - 1) {
                    html += `<span>${element.value}</span>`
                } else {
                    html += `<span>${element.value}</span>·`
                }
            })
            html += `</p>
                        <div class="price-container">
                            <div class="change-box none"><span class="change-btn reduce">-</span><span class="single-count">${ele.count}</span> <span class="change-btn add">+</span></div>
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
        this.$listSelect = $('.selected-box', this.$cartList);
    }
}

export default new Cart();