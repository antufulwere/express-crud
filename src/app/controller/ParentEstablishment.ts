import { Context } from 'koa';
import logger from '../../logger';

import errorHandler from '../utils/ApiErrorHandler';
import establishmentService from '../service/ParentEstablishment';
import apiResponseHandler from '../constant/ResponseHandler';
class ParentEstablishment {
	constructor() { }
	async addParentEstablishment(ctx: Context) {
		try {
			logger.info(`Controller : addParentEstablishment, Request-Body : ${JSON.stringify(ctx.request)} date: ${new Date()}`);
			const { response, statusCode, success } = await establishmentService.addParentEstablishment(ctx);
			apiResponseHandler.response(ctx, response, success, statusCode);
		} catch (error) {
			console.log(error);
			const errorMessage: string = errorHandler.errorHandler(ctx, error);
			logger.error(`Controller: addParentEstablishment, Error: ${JSON.stringify(errorMessage)}`, `date: ${new Date()}`);
		}
	}
	async getParentEstablishments(ctx: Context) {
		try {
			logger.info(`Controller : getParentEstablishments, Request-Body : ${JSON.stringify(ctx.request.body)} date: ${new Date()}`);
			const { response, statusCode, success, total } = await establishmentService.getParentEstablishments(ctx);
			apiResponseHandler.response(ctx, response, success, statusCode, total);
		} catch (error) {
			console.log(error);
			const errorMessage: string = errorHandler.errorHandler(ctx, error);
			logger.error(`Controller: getParentEstablishments, Error: ${JSON.stringify(errorMessage)}`, `date: ${new Date()}`);
		}
	}
	async getParentRoles(ctx: Context) {
		try {
			logger.info(`Controller : getParentRoles, Request-Body : ${JSON.stringify(ctx.request.body)} date: ${new Date()}`);
			const { response, statusCode, success, total } = await establishmentService.getParentRoles(ctx);
			apiResponseHandler.response(ctx, response, success, statusCode, total);
		} catch (error) {
			console.log(error);
			const errorMessage: string = errorHandler.errorHandler(ctx, error);
			logger.error(`Controller: getParentRoles, Error: ${JSON.stringify(errorMessage)}`, `date: ${new Date()}`);
		}
	}
	async updateParentEstablishment(ctx: Context) {
		try {
			logger.info(`Controller : updateParentEstablishment, Request-Body : ${JSON.stringify(ctx.request.body)} date: ${new Date()}`);
			const { response, statusCode, success } = await establishmentService.updateParentEstablishment(ctx);
			apiResponseHandler.response(ctx, response, success, statusCode);
		} catch (error) {
			console.log(error);
			const errorMessage: string = errorHandler.errorHandler(ctx, error);
			logger.error(`Controller: updateParentEstablishment, Error: ${JSON.stringify(errorMessage)}`, `date: ${new Date()}`);
		}
	}
	async getParentEstablishment(ctx: Context) {
		try {
			logger.info(`Controller : getParentEstablishment, Request-Body : ${JSON.stringify(ctx.params)} date: ${new Date()}`);
			const { response, statusCode, success } = await establishmentService.getParentEstablishment(ctx);
			apiResponseHandler.response(ctx, response, success, statusCode);
		} catch (error) {
			console.log(error);
			const errorMessage: string = errorHandler.errorHandler(ctx, error);
			logger.error(`Controller: getParentEstablishment, Error: ${JSON.stringify(errorMessage)}`, `date: ${new Date()}`);
		}
	}
}

const parentEstablishment: ParentEstablishment = new ParentEstablishment();
export default parentEstablishment;
