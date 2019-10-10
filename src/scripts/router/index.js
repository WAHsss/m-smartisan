import indexController from '../controllers/';
import positionController from '../controllers/positions';
import categroyController from '../controllers/categroy';
import cartController from '../controllers/cart';
import profileController from '../controllers/profile';

class Router{
    constructor(){
        indexController.render();
        this.render();
        this.pageControllers = {
            positionController,
            categroyController,
            cartController,
            profileController
        }
    }
    render(){
        window.addEventListener('hashchange',this.hashChangeHandler.bind(this));
        window.addEventListener('load',this.loadHandler.bind(this));
    }
    setActiveClass(hash){
        $(`footer li[data-to=${hash}]`).addClass('active').siblings().removeClass('active');
    } 
    renderDOM(hash){
        this.pageControllers[`${hash}Controller`].render();
    }
    loadHandler(){
        let hash = location.hash.substring(1) || 'position';
        location.hash = hash;
        this.renderDOM(hash);
        this.setActiveClass(hash);
    }
    hashChangeHandler(){
        let hash = location.hash.substring(1);
        this.renderDOM(hash);
        this.setActiveClass(hash);
    }
   
}

new Router();