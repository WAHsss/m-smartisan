export default {
    get(num){
       return $.ajax({
            url : '/single',
            type : "GET",
            data : {
                ids: num
            }
        })
    }
}