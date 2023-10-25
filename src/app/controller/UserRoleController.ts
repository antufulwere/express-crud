import { Context } from 'koa';
import logger from '../../logger';

import errorHandler from '../utils/ApiErrorHandler';
import userRolesService from '../service/UserRoleService';
import apiResponseHandler from '../constant/ResponseHandler';
class UserController {
	constructor() { }

	async addRole(ctx: Context) {
		try {
			logger.info(`Controller : addRole, Request-Body : ${JSON.stringify(ctx.request)} date: ${new Date()}`);
			const { response, statusCode, success, error } = await userRolesService.addRole(ctx);
			if (!success) {
				apiResponseHandler.errorHandler(ctx, error);
			} else {
				apiResponseHandler.response(ctx, response, success, statusCode);
			}
		} catch (error) {
			console.log(error);
			const errorMessage: string = errorHandler.errorHandler(ctx, error);
			logger.error(`Controller: addRole, Error: ${JSON.stringify(errorMessage)}`, `date: ${new Date()}`);
		}
	}
	async getRoles(ctx: Context) {
		try {
			logger.info(`Controller : getRoles, Request-Body : ${JSON.stringify(ctx.request.body)} date: ${new Date()}`);
			const { response, statusCode, success } = await userRolesService.getRoles(ctx);
			apiResponseHandler.response(ctx, response, success, statusCode);
		} catch (error) {
			console.log(error);
			const errorMessage: string = errorHandler.errorHandler(ctx, error);
			logger.error(`Controller: getRoles, Error: ${JSON.stringify(errorMessage)}`, `date: ${new Date()}`);
		}
	}
	async updateRole(ctx: Context) {
		try {
			logger.info(`Controller : updateRole, Request-Body : ${JSON.stringify(ctx.request.body)} date: ${new Date()}`);
			const { response, statusCode, success } = await userRolesService.updateRole(ctx);
			apiResponseHandler.response(ctx, response, success, statusCode);
		} catch (error) {
			console.log(error);
			const errorMessage: string = errorHandler.errorHandler(ctx, error);
			logger.error(`Controller: updateRole, Error: ${JSON.stringify(errorMessage)}`, `date: ${new Date()}`);
		}
	}
	async deleteRole(ctx: Context) {
		try {
			logger.info(`Controller : deleteRole, Request-Body : ${JSON.stringify(ctx.params)} date: ${new Date()}`);
			const { response, statusCode, success } = await userRolesService.deleteRole(ctx);
			apiResponseHandler.response(ctx, response, success, statusCode);
		} catch (error) {
			console.log(error);
			const errorMessage: string = errorHandler.errorHandler(ctx, error);
			logger.error(`Controller: deleteRole, Error: ${JSON.stringify(errorMessage)}`, `date: ${new Date()}`);
		}
	}
}

const userController: UserController = new UserController();
export default userController;
