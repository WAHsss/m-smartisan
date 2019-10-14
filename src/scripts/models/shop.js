export default {
    get(goodsNum){
        return $.ajax({
            url: `shopapi/category_id=${goodsNum}`
        })
    }
}