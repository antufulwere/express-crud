import { RouterManager } from '../core/RouterManager';
import userController from '../controller/UserController';
import userValidator from '../validator/UserValidator';
import MiddleWare from '../core/middleware/ErrorMiddleware';

const establishmentRouterManager: RouterManager = new RouterManager('/user-establishments');

establishmentRouterManager.post('/', MiddleWare.isAdmin(), userValidator.addUserEstablishment, userController.addUserEstablishment);
establishmentRouterManager.get('/', MiddleWare.isAdmin(), userController.getUserEstablishment);
establishmentRouterManager.delete('/:id', MiddleWare.isAdmin(), userController.deleteUserEstablishment);
export default establishmentRouterManager;