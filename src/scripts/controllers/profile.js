import profileView  from '../views/profile.art';
import BScroll from 'better-scroll';
 
class Profile{
    render(){
        let profileViewHtml = profileView();
        $("main").html(profileViewHtml);
        new BScroll($('.profile-scroll-cont').get(0),{
            probeType:2,
            mouseWheel: true,
            scrollbar : true
        });
    }
}

export default new Profile();