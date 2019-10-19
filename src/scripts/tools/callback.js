/**
 * 耦合 ： this.$cartNum //购物车要展出的数据DOM
 * porp :   this.obs,
 *          this.cartData,
 * function :   this.setNum()  
 *              this.saveData()    
 */


import store from 'store';
class Callback {
    initCallback() {
        this.obs = $.Callbacks();
        let cartList = [];
        this.sum = 0;
        this.sumMoney = 0;
        this.cartData = {
            $data: {
                data: (cartList = store.get('cartList')) ? cartList : []
            }
        }
        let that = this;
        Object.defineProperty(this.cartData, "data", {
            set: function (val) {
                this.$data.data = val;
                that.obs.fire('set');
            },
            get: function () {
                return this.$data.data;
            }
        });
        this.obs.add('set', this.setNum.bind(this));
        this.obs.add('set', this.saveData.bind(this));
    }

    setNum() {
        this.sum = 0;
        this.sumMoney = 0;
        let that = this;
        this.cartData.data.forEach((ele) => {
            that.sum += ele.count;
            that.sumMoney += ele.count* ~~ele.price.num;
        });
        this.$cartNum.text(this.sum);
        this.selectSum = this.sum;
        this.selectSumMoney = this.sumMoney;
        // console.log(this.sum,this.sumMoney);
    }
    saveData() {
        store.set('cartList', this.cartData.data);
    }
}

export default Callback;

