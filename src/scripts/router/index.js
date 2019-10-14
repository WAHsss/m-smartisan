import indexController from '../controllers/';
import positionController from '../controllers/positions';
import categoryController from '../controllers/category';
import cartController from '../controllers/cart';
import profileController from '../controllers/profile';
import shopController from '../controllers/shop';
import detailController from '../controllers/detail';

class Router{
    constructor(){
        this.render();
        this.pageControllers = {
            positionController,
            categoryController,
            cartController,
            profileController,
            shopController,
            detailController
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
        let reg = new RegExp('^(\\w+)','g');
        let path = reg.exec(hash);

        indexController.render();
        location.hash = hash;

        this.renderDOM(path[1]);
        this.setActiveClass(path[1]);
    }
    hashChangeHandler(){
        let hash = location.hash.substring(1);
        let reg = new RegExp('^(\\w+)','g');
        let path = reg.exec(hash);
        this.renderDOM(path[1]);
        this.setActiveClass(path[1]);
    }
   
}

new Router();