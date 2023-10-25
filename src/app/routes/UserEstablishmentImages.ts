import { RouterManager } from '../core/RouterManager';
import userController from '../controller/UserController';
import userValidator from '../validator/UserValidator';
import MiddleWare from '../core/middleware/ErrorMiddleware';

const establishmentImagesRouterManager: RouterManager = new RouterManager('/user-establishmentImages');

establishmentImagesRouterManager.post('/',MiddleWare.isAdmin(), userValidator.addUserEstablishmentImages, userController.addUserEstablishmentImages);
establishmentImagesRouterManager.get('/', userController.getUserEstablishmentImages);
establishmentImagesRouterManager.put('/:id', MiddleWare.isAdmin(), userValidator.updateUserEstablishmentImages, userController.updateUserEstablishmentImages);
establishmentImagesRouterManager.delete('/:id', MiddleWare.isAdmin(), userController.deleteUserEstablishmentImages);
export default establishmentImagesRouterManager;
