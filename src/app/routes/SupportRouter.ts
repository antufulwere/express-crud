import supportController from '../controller/SupportController';
import { RouterManager } from '../core/RouterManager';
import supportValidator from '../validator/SupportValidator';

const supportRouterManager: RouterManager = new RouterManager('/');

supportRouterManager.get('supports', supportValidator.getSupport, supportController.getSupport);
supportRouterManager.post('supports', supportValidator.addSupport, supportController.addSupport);
supportRouterManager.patch('supports/:id', supportValidator.updateSupport,  supportController.updateSupport);
supportRouterManager.delete('supports/:id', supportValidator.deleteSupport, supportController.deleteSupport);

export default supportRouterManager;
