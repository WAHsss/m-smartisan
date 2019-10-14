export default {
    getClassify(){
        return $.ajax({
            url:'/api/classify'
        })
    }
}