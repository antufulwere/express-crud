import { RouterManager } from '../core/RouterManager';
import FormController from '../controller/FormController';
import FormValidator from '../validator/FormValidator';
import MiddleWare from '../core/middleware/ErrorMiddleware';

const userRouterManager: RouterManager = new RouterManager('/forms');

userRouterManager.post('/', MiddleWare.isAdmin(), FormValidator.createForm, FormController.addForm);
userRouterManager.get('/', FormController.getForms);
userRouterManager.get('/:id', FormController.addForm);
userRouterManager.patch('/:id', MiddleWare.isAdmin(), FormValidator.updateForm, FormController.updateForm);

export default userRouterManager;
