import { RouterManager } from '../core/RouterManager';
import UserRoleController from '../controller/UserRoleController';
import UserRoleValidator from '../validator/UserRoleValidator';
import MiddleWare from '../core/middleware/ErrorMiddleware';

const userRouterManager: RouterManager = new RouterManager('/roles');

userRouterManager.post('/', MiddleWare.isAdmin(), UserRoleValidator.createRole, UserRoleController.addRole);
userRouterManager.get('/', UserRoleController.getRoles);
userRouterManager.patch('/:id', MiddleWare.isAdmin(), UserRoleValidator.updateRole, UserRoleController.updateRole);
userRouterManager.delete('/:id', MiddleWare.isAdmin(), UserRoleController.deleteRole);

export default userRouterManager;
