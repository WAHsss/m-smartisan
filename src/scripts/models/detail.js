export default {
    get(num) {
        return $.ajax({
            url: '/single/spus' ,
            type: "GET" ,
            data: {
                ids: num
            }
        })
    },
    //https://shopapi.smartisan.com/product/skus?ids=100057701,100057702,100057705,100057710,100057711,100057726,100057727,100057728,100057729&with_stock=true&with_spu=true
    getSkus(list , hasShop) {
        return $.ajax({
            url: '/single/skus' ,
            type: 'GET',
            data: {
                ids: list ,
                with_stock: hasShop,
                with_spu : hasShop
            }
        })
    },
    //https://shopapi.smartisan.com/product/promotions?with_num=true
    getPromotion(){
        return $.ajax({
            url: "/single/promotions",
            type: 'GET',
            data: {
                with_num : true
            }
        })
    }
}