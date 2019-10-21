export default {
    //page=1&num=20&sort=sort&channel_id=1002&type=shop
    get(goodsNum){
        return $.ajax({
            url: '/shopapi',
            type : "GET",
            data : {
                category_id : goodsNum,
                page : 1,
                num : 20,
                sort : 'sort',
                channel_id : 1002,
                type : 'shop'
            }
        })
    }
}