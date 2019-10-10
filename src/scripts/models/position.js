module.exports = {
    get({ pageNo = 1 } = {}) {
        return $.ajax({
            url: `/api/skulist?page=${pageNo}`
        })
    },
    getHome(){
        return $.ajax({
            url:'/api/home'
        })
    }
}