import categroyView  from '../views/categroy.art';

class Categroy{
    render(){
        let categroyViewHtml = categroyView();
        $("main").html(categroyViewHtml);
    }
}

export default new Categroy();