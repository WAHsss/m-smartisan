// import detailController from '../controllers/detail';

// class Router{
//     constructor(){
//         this.render();
//         this.pageController = {
//             detailController
//         }
//     }
//     render(){
//         window.addEventListener('load',this.loadHandle.bind(this));
//     }
//     loadHandle(){
//         let reg = /^\/(\w+)\.\w+$/;
//         let path = location.pathname;
//         let pathLoc = reg.exec(path);
//         this.pageController[`${pathLoc[1]}Controller`].render();
//     }
// }

// export default new Router();