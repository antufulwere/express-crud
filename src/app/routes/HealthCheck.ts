import UserController from '../controller/UserController';
import { RouterManager } from '../core/RouterManager';

const healthCheck: RouterManager = new RouterManager('/');

healthCheck.get('/', UserController.check);

export default healthCheck;
