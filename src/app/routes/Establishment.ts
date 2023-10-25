import { RouterManager } from '../core/RouterManager';
import Establishment from '../controller/Establishment';
import parentEstablishmentValidator from '../validator/EstablishmentValidator';
import MiddleWare from '../core/middleware/ErrorMiddleware'
const establishmentRouterManager: RouterManager = new RouterManager(
    "/parentEstablishments"
);
establishmentRouterManager.post(
    "/:estParentId/establishments",
    parentEstablishmentValidator.createEstablishment,
    Establishment.addEstablishment
);
establishmentRouterManager.get(
    "/:estParentId/establishments",
    Establishment.getEstablishments
);
establishmentRouterManager.patch(
    "/:estParentId/establishments/:estId",
    MiddleWare.isUserEstablishment(),
    parentEstablishmentValidator.updateEstablishment,
    Establishment.updateEstablishment
);
establishmentRouterManager.post(
    "/establishments/login",
    parentEstablishmentValidator.loginEstablishment,
    Establishment.login
);
establishmentRouterManager.get(
    "/:estParentId/establishments/users",
    Establishment.getUsers
);
establishmentRouterManager.get(
    "/:estParentId/establishments/:estId",
    MiddleWare.isUserEstablishment(),
    Establishment.getEstablishment
);
establishmentRouterManager.get(
    "/:estParentId/establishments/:estId/users/:userId/items",
    MiddleWare.isUserEstablishment(),
    MiddleWare.jwtMiddleWare(),
    parentEstablishmentValidator.getEstablishmentItems,
    Establishment.getEstablishmentItems
);
establishmentRouterManager.get(
    "/:estParentId/establishments/:estId/forms",
    MiddleWare.isUserEstablishment(),
    MiddleWare.jwtMiddleWare(),
    Establishment.getEstablishmentForms
);
establishmentRouterManager.patch(
    "/:estParentId/establishments/:estId/form/:id",
    MiddleWare.isAdmin(true, "update"),
    parentEstablishmentValidator.updateEstForms,
    Establishment.updateEstablishmentForms
);
establishmentRouterManager.get(
    "/:estParentId/establishments/:estId/users/:userId/history",
    MiddleWare.isUserEstablishment(),
    MiddleWare.jwtMiddleWare(),
    parentEstablishmentValidator.getEstablishmentItems,
    Establishment.getEstablishmentItems
);
establishmentRouterManager.get(
    "/:estParentId/establishments/:estId/users/:userId/activities",
    MiddleWare.isUserEstablishment(),
    MiddleWare.jwtMiddleWare(),
    parentEstablishmentValidator.getUserActivities,
    Establishment.getUserActivities
);

export default establishmentRouterManager;
