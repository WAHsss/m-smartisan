import profileView  from '../views/profile.art';

class Profile{
    render(){
        let profileViewHtml = profileView();
        $("main").html(profileViewHtml);
    }
}

export default new Profile();