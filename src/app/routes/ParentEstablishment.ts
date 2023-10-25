import { RouterManager } from '../core/RouterManager';
import ParentEstablishment from '../controller/ParentEstablishment';
import parentEstablishmentValidator from '../validator/ParentEstablishmentValidator';
import MiddleWare from '../core/middleware/ErrorMiddleware';

const establishmentRouterManager: RouterManager = new RouterManager('/parentEstablishments');

establishmentRouterManager.post('/', MiddleWare.isAdmin(), parentEstablishmentValidator.createParentEstablishment, ParentEstablishment.addParentEstablishment);
establishmentRouterManager.get('/', MiddleWare.jwtMiddleWare(), ParentEstablishment.getParentEstablishments);
establishmentRouterManager.patch('/:id', MiddleWare.jwtMiddleWare(), parentEstablishmentValidator.updateParentEstablishment, ParentEstablishment.updateParentEstablishment);
establishmentRouterManager.get('/:id', MiddleWare.isAdmin(), ParentEstablishment.getParentEstablishment);
establishmentRouterManager.get('/:id/roles', ParentEstablishment.getParentRoles);

export default establishmentRouterManager;
