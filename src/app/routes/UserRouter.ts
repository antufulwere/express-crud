import { RouterManager } from '../core/RouterManager';
import userController from '../controller/UserController';
import userValidator from '../validator/UserValidator';
import MiddleWare from '../core/middleware/ErrorMiddleware';
const userRouterManager: RouterManager = new RouterManager('');

userRouterManager.patch('/users/_forgot-password', userValidator.forgotPassword, userController.forgotPassword);
userRouterManager.patch('/users/_change-role', MiddleWare.isAdmin(), userValidator.updateUserRole, userController.updateUserRole);
userRouterManager.patch('/users/_admin-reset-password', userValidator.adminResetPassword, userController.adminResetPassword);
userRouterManager.patch('/users/training/:id', MiddleWare.jwtMiddleWare(), userValidator.updateUserTraining, userController.updateUserTraining);
userRouterManager.patch('/users/checklist/:id', userValidator.updateUserChecklist, userController.updateUserChecklist);
userRouterManager.get('/users/trainings/:id', MiddleWare.jwtMiddleWare(), userController.getUserCourses);
userRouterManager.get('/users/checklists/:id', userController.getUserChecklists);
userRouterManager.post('/users', MiddleWare.isAdminOrEst(), userValidator.createUser, userController.addUser);
userRouterManager.post('/addCsv', MiddleWare.isAdminOrEst(), userController.addUserByCsv);
userRouterManager.get('/users/:id/profile', MiddleWare.jwtMiddleWare(), userController.getProfile);
userRouterManager.delete('/users/:id/logout', MiddleWare.jwtMiddleWare(), userController.logout);
userRouterManager.patch('/users/:id/_reset-password', MiddleWare.jwtMiddleWareForResetPassword(), userValidator.resetPassword, userController.resetPassword);
userRouterManager.patch('/users/:id/_change-password', MiddleWare.jwtMiddleWare(), userValidator.changePassword, userController.changePassword);
userRouterManager.patch('/users/:id/_reset-auth', MiddleWare.jwtMiddleWare(), userValidator.resetAuth, userController.resetAuth);
userRouterManager.patch('/users/:id', MiddleWare.jwtMiddleWare(), userValidator.updateUser, userController.updateUser);
userRouterManager.get('/users/positions', userController.getPositions);
userRouterManager.get('/users', MiddleWare.isAdmin(), userController.getUsers);
userRouterManager.get('/users/dashboard/:estId', MiddleWare.isAdmin(), userValidator.getUsersByCourseId, userController.getUsersByCourseId);
userRouterManager.get('/users/:id', userController.getUser);
userRouterManager.post('/users/login', userValidator.loginUser, userController.login);
userRouterManager.post('/auth/google', userValidator.googleLogin, userController.googleLogin);
userRouterManager.post('/users/feedback', userController.sendFeedback);
userRouterManager.get('/users/:userId/training/:id', MiddleWare.jwtMiddleWare(), userController.getUserCourseDetails);
userRouterManager.get('/users/:userId/checklists', MiddleWare.jwtMiddleWare(), userController.getChecklistsOfUser);
userRouterManager.get('/users/:id/summary', MiddleWare.isAdmin(), userController.getSummary);
userRouterManager.get('/questions', userController.getQuestions);
userRouterManager.get('/getQuestions', userController.getQuestionsOnBehalfOfEmail);
userRouterManager.get('/users/:userId/_forgot-user-password', userController.forgotUserPassword);
userRouterManager.patch('/users/:userId/_check-answer', userValidator.checkUserAnswer, userController.checkUserAnswer);
userRouterManager.post('/users/:userId/answer', MiddleWare.jwtMiddleWareForResetPassword(), userValidator.createAnswer, userController.addAnswer);
userRouterManager.get('/_download-user-csv/:estId', MiddleWare.isAdmin(), userValidator.downloadUserCsv, userController.downloadUserCsv);
userRouterManager.get('/training-duration', userValidator.trainingDurationStatistics, userController.trainingDurationStatistics);
userRouterManager.get('/users/training/statistics', MiddleWare.isAdmin(), userValidator.userTrainingStatistics, userController.userTrainingStatistics);
userRouterManager.get('/training', MiddleWare.isAdmin(), userValidator.getTrainingByParentIdOrEstId, userController.getTrainingByParentIdOrEstId);
export default userRouterManager;
