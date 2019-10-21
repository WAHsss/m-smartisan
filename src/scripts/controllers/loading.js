import loadingView from '../views/component/loading.art';
class Loading{
    render(){
        let loadingViewHtml = loadingView();
        $('main').html(loadingViewHtml);
    }
}
export default new Loading();